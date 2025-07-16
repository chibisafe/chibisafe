# chibisafe-upload.example.txt
#
# CLI tool for uploading files and directories to a Chibisafe server, supporting large files via chunked uploads.
#
# Features:
# - Supports single file and directory (multi-file) uploads.
# - Automatically splits large files into chunks and uploads them in sequence.
# - Retries failed chunk uploads up to 3 times.
# - Shows progress for chunked uploads.
# - Prints a summary for each file and for directory uploads.
# - Sends a final empty chunk to trigger file reassembly on the server (required for Chibisafe compatibility).
#
# Requirements: fish shell, curl, uuidgen, split, awk, stat, date
#
# Usage:
#   chibisafe-upload <file-or-directory>
#
# Configuration:
#   Set the variables below with your Chibisafe API details before use.
#   Set DEBUG=1 to enable debug output.
#
# For more details, see: https://chibisafe.moe/docs

# --- USER CONFIGURABLE VARIABLES ---
set -g CHIBISAFE_REQUEST_URL "https://your-chibisafe-server/api/upload"     # Set your upload URL
set -g CHIBISAFE_API_KEY your_api_key_here                                  # Set your API key
set -g CHIBISAFE_ALBUM_UUID your_album_uuid_here                            # Optional: Set your album UUID or leave blank
set -g CHIBISAFE_TMP_DIR /tmp/chibisafe                                     # Temp storage for dump files
set -g CHIBISAFE_CHUNK_SIZE 67108864                                        # 64MB chunk size (must be below the Node.js 'busboy' module limit, default 100MB; recommend <100MB)
set -g DEBUG 0                                                              # Set to 1 to enable debug output
# -----------------------------------
#
# This script supports chunked uploads compatible with Chibisafe's backend API.
# For files larger than CHIBISAFE_CHUNK_SIZE, the file is split and each chunk is uploaded with:
#   - chibi-chunk-number: <chunk index> (header)
#   - chibi-chunks-total: <total chunks> (header)
#   - chibi-uuid: <uuid for the upload> (header)
#
# Requires: uuidgen, split, curl
#
# See https://chibisafe.moe/docs for API details.

# Print usage information
function print_usage
    # Prints usage instructions for the script.
    echo "Usage: chibisafe-upload <file-or-directory>"
    return 1
end

# Check if a file with the given UUID exists on the Chibisafe server
function check_file_existence_by_uuid --argument uuid
    # Calls the Chibisafe API to check if a file with the given UUID exists.
    # Prints the result to the user.
    if test $DEBUG -eq 1
        echo "[DEBUG] Checking existence of file with UUID: $uuid"
    end
    set -l api_url (string replace -r '/api/upload$' "/api/file/$uuid" $CHIBISAFE_REQUEST_URL)
    set -l response (curl -w "\n[HTTP_STATUS_CODE]%{http_code}" -H "x-api-key: $CHIBISAFE_API_KEY" "$api_url" -s)
    set -l status_codes (string match -r '\[HTTP_STATUS_CODE\](\d+)' -- $response | string replace -r '\[HTTP_STATUS_CODE\](\d+)' '$1')
    set -l status_code (string trim (string join ' ' $status_codes | awk '{print $NF}'))
    if test $DEBUG -eq 1
        echo "$response"
        echo "[DEBUG] File existence check HTTP status: $status_code"
    end
    if test $status_code -eq 200
        echo "[INFO] File with UUID $uuid exists on Chibisafe."
    else
        if test $DEBUG -eq 1
            echo "[WARN] File with UUID $uuid not found on Chibisafe."
        end
    end
end

# Upload a single file (handles both single-part and chunked uploads)
function upload_file --argument file
    # Uploads a single file to Chibisafe.
    # If the file is larger than CHIBISAFE_CHUNK_SIZE, it will be split into chunks.
    # After all data chunks, a final empty chunk is sent to trigger reassembly on the server.
    # Each chunk upload is retried up to 3 times on failure.
    # Progress is displayed after each chunk.
    if test $DEBUG -eq 1
        echo "[DEBUG] upload_file called with file: $file"
    end
    set -l dump_dir $CHIBISAFE_TMP_DIR
    mkdir -p $dump_dir
    if test $status -ne 0
        echo "[ERROR] Failed to create temp directory: $dump_dir"
        return 1
    end
    set -l dump_file "$dump_dir/headers.dump"
    set album_header
    if test -n "$CHIBISAFE_ALBUM_UUID"
        set album_header -H "albumuuid: $CHIBISAFE_ALBUM_UUID"
    end
    set -l filesize (stat -c %s "$file")
    set -l mimetype (file --mime-type -b "$file")
    if test $filesize -le $CHIBISAFE_CHUNK_SIZE
        # Single-part upload
        if test $DEBUG -eq 1
            echo "[DEBUG] Single-part upload"
        end
        set -l response (curl -w "\n[HTTP_STATUS_CODE]%{http_code}" -D $dump_file -H "x-api-key: $CHIBISAFE_API_KEY" $album_header -F "file[]=@$file" -F "name=(basename $file)" -F "type=$mimetype" -F "size=$filesize" -s $CHIBISAFE_REQUEST_URL)
        if test $DEBUG -eq 1
            echo "$response"
        end
        set -l status_codes (string match -r '\[HTTP_STATUS_CODE\](\d+)' -- $response | string replace -r '\[HTTP_STATUS_CODE\](\d+)' '$1')
        set -l status_code (string trim (string join ' ' $status_codes | awk '{print $NF}'))
        if test $DEBUG -eq 1
            echo "[DEBUG] HTTP status: $status_code"
        end
        if test -z "$status_code"
            echo "[ERROR] No HTTP status code received. Aborting."
            return 1
        end
        if test $status_code -eq 200
            echo "Success: $file"
            # Extract UUID from JSON response
            set -l uuid (echo $response | string match -r '"uuid"\s*:\s*"([^"]+)"' | string replace -r '.*"uuid"\s*:\s*"([^"]+)".*' '$1')
            if test -n "$uuid"
                check_file_existence_by_uuid $uuid
            else
                if test $DEBUG -eq 1
                    echo "[WARN] Could not extract UUID from upload response."
                end
            end
        else
            echo "Failed: $file"
            cat $dump_file
        end
    else
        # Chunked upload
        if test $DEBUG -eq 1
            echo "[DEBUG] Chunked upload"
        end
        if not type -q uuidgen
            echo "Error: uuidgen is required for chunked uploads."
            return 1
        end
        set -l chunks (math "ceil($filesize / $CHIBISAFE_CHUNK_SIZE)")
        set -l basename (basename "$file")
        set -l split_prefix "$dump_dir/$basename.chunk-"
        set -l upload_uuid (uuidgen)
        split -b $CHIBISAFE_CHUNK_SIZE -d --additional-suffix=".part" "$file" "$split_prefix"
        set -l chunk_files $split_prefix*.part
        if test (count $chunk_files) -eq 0
            echo "[ERROR] No chunk files created. Aborting."
            return 1
        end
        set -l chunk 0
        set -l last_response ''
        set -l last_status_code ''
        for chunk_file in $chunk_files
            set -l attempt 1
            set -l max_attempts 3
            set -l success 0
            while test $attempt -le $max_attempts
                if test $DEBUG -eq 1
                    echo "[DEBUG] Uploading chunk $chunk of $chunks: $chunk_file (Attempt $attempt/$max_attempts)"
                    echo "[DEBUG] Headers:"
                    echo "  x-api-key: $CHIBISAFE_API_KEY"
                    if test -n "$album_header"
                        echo "  albumuuid: $CHIBISAFE_ALBUM_UUID"
                    end
                    echo "  chibi-chunk-number: $chunk"
                    echo "  chibi-chunks-total: $chunks"
                    echo "  chibi-uuid: $upload_uuid"
                    echo "[DEBUG] Form fields:"
                    echo "  file[]=@$chunk_file;filename=$basename"
                    echo "  name=$basename"
                    echo "  type=$mimetype"
                    echo "  size=$filesize"
                end
                set -l response (curl -w "\n[HTTP_STATUS_CODE]%{http_code}" \
                    -D $dump_file \
                    -H "x-api-key: $CHIBISAFE_API_KEY" \
                    $album_header \
                    -H "chibi-chunk-number: $chunk" \
                    -H "chibi-chunks-total: $chunks" \
                    -H "chibi-uuid: $upload_uuid" \
                    -F "file[]=@$chunk_file;filename=$basename" \
                    -F "name=$basename" \
                    -F "type=$mimetype" \
                    -F "size=$filesize" \
                    -s $CHIBISAFE_REQUEST_URL)
                set -l status_codes (string match -r '\[HTTP_STATUS_CODE\](\d+)' -- $response | string replace -r '\[HTTP_STATUS_CODE\](\d+)' '$1')
                set -l status_code (string trim (string join ' ' $status_codes | awk '{print $NF}'))
                if test $DEBUG -eq 1
                    echo "$response"
                    echo "[DEBUG] HTTP status: $status_code"
                end
                set last_response $response
                set last_status_code $status_code
                if test -z "$status_code"
                    echo "[ERROR] No HTTP status code received for chunk $chunk. Aborting."
                    return 1
                end
                if test $status_code -eq 204 -o $status_code -eq 200
                    set success 1
                    break
                else
                    if test $DEBUG -eq 1
                        echo "[WARN] Failed to upload chunk $chunk (Attempt $attempt/$max_attempts). Retrying..."
                    end
                    sleep 2
                end
                set attempt (math "$attempt + 1")
            end
            if test $success -eq 0
                echo "[ERROR] Failed: $file (chunk $chunk) after $max_attempts attempts."
                cat $dump_file
                break
            end
            set -l percent (math "100 * ($chunk + 1) / $chunks")
            echo -n (printf "[PROGRESS] %d/%d chunks (%.1f%%)\r" (math "$chunk + 1") $chunks $percent)
            set chunk (math "$chunk + 1")
        end
        echo
        rm -f $chunk_files
        # Send final empty chunk to trigger reassembly
        set -l empty_file /dev/null
        if test $DEBUG -eq 1
            echo "[DEBUG] Sending final empty chunk: $chunks of $chunks"
            echo "[DEBUG] Headers:"
            echo "  x-api-key: $CHIBISAFE_API_KEY"
            if test -n "$album_header"
                echo "  albumuuid: $CHIBISAFE_ALBUM_UUID"
            end
            echo "  chibi-chunk-number: $chunks"
            echo "  chibi-chunks-total: $chunks"
            echo "  chibi-uuid: $upload_uuid"
            echo "[DEBUG] Form fields:"
            echo "  file[]=@$empty_file;filename=$basename"
            echo "  name=$basename"
            echo "  type=$mimetype"
            echo "  size=$filesize"
        end
        set -l response (curl -w "\n[HTTP_STATUS_CODE]%{http_code}" \
            -D $dump_file \
            -H "x-api-key: $CHIBISAFE_API_KEY" \
            $album_header \
            -H "chibi-chunk-number: $chunks" \
            -H "chibi-chunks-total: $chunks" \
            -H "chibi-uuid: $upload_uuid" \
            -F "file[]=@$empty_file;filename=$basename" \
            -F "name=$basename" \
            -F "type=$mimetype" \
            -F "size=$filesize" \
            -s $CHIBISAFE_REQUEST_URL)
        set -l status_codes (string match -r '\[HTTP_STATUS_CODE\](\d+)' -- $response | string replace -r '\[HTTP_STATUS_CODE\](\d+)' '$1')
        set -l last_status_code (string trim (string join ' ' $status_codes | awk '{print $NF}'))
        set -l last_response $response
        if test $DEBUG -eq 1
            echo "$response"
            echo "[DEBUG] HTTP status: $last_status_code"
        end
        if test -z "$last_status_code"
            echo "[ERROR] No HTTP status code received after chunked upload. Aborting."
            return 1
        end
        if test $last_status_code -eq 200
            echo "Success: $file (all chunks uploaded)"
            # Extract UUID from JSON response
            set -l uuid (echo $last_response | string match -r '"uuid"\s*:\s*"([^"]+)"' | string replace -r '.*"uuid"\s*:\s*"([^"]+)".*' '$1')
            if test -n "$uuid"
                check_file_existence_by_uuid $uuid
            else
                if test $DEBUG -eq 1
                    echo "[WARN] Could not extract UUID from upload response."
                end
            end
        else
            echo "Failed to complete upload for $file"
        end
    end
    # Do not remove $dump_dir since it's a shared temp directory
end

# Main entry point: handles single file or directory uploads, prints summary
function chibisafe-upload
    # Accepts a file or directory as argument.
    # For directories, uploads all files recursively and prints a summary.
    if test $DEBUG -eq 1
        echo "[DEBUG] chibisafe-upload called with argv: $argv"
    end
    # Check required variables
    set missing_vars
    for var in CHIBISAFE_REQUEST_URL CHIBISAFE_API_KEY
        if test -z (eval echo ".$var")
            set missing_vars $missing_vars $var
        end
    end
    if test (count $missing_vars) -gt 0
        echo "Error: Missing required variable(s): $missing_vars"
        return 1
    end
    # Check argument
    if test (count $argv) -ne 1
        print_usage
        return 1
    end
    set target $argv[1]
    if test $DEBUG -eq 1
        echo "[DEBUG] target: $target"
    end
    if test -f $target
        set -l start_time (date +%s)
        upload_file $target
        set -l end_time (date +%s)
        set -l elapsed (math "$end_time - $start_time")
        echo "[SUMMARY] $target: completed in $elapsed seconds."
    else if test -d $target
        if test $DEBUG -eq 1
            echo "[DEBUG] $target is a directory"
        end
        set -l total 0
        set -l succeeded 0
        set -l failed 0
        for f in (find $target -type f)
            set -l start_time (date +%s)
            upload_file $f
            set -l end_time (date +%s)
            set -l elapsed (math "$end_time - $start_time")
            echo "[SUMMARY] $f: completed in $elapsed seconds."
            set total (math "$total + 1")
            if test $status -eq 0
                set succeeded (math "$succeeded + 1")
            else
                set failed (math "$failed + 1")
            end
        end
        echo "[SUMMARY] Directory upload: $total files attempted, $succeeded succeeded, $failed failed."
    else
        echo "Error: $target is not a file or directory."
        return 1
    end
end
