const fs = require('fs');
const path = require('path');
const blake3 = require('blake3');
const jetpack = require('fs-jetpack');
const FileType = require('file-type');

function DiskStorage(opts) {
	this.getFilename = opts.filename;

	if (typeof opts.destination === 'string') {
		jetpack.dir(opts.destination);
		this.getDestination = ($0, $1, cb) => { cb(null, opts.destination); };
	} else {
		this.getDestination = opts.destination;
	}
}

DiskStorage.prototype._handleFile = function _handleFile(req, file, cb) {
	const that = this; // eslint-disable-line consistent-this

	that.getDestination(req, file, (err, destination) => {
		if (err) return cb(err);

		that.getFilename(req, file, (err, filename) => {
			if (err) return cb(err);

			const finalPath = path.join(destination, filename);
			const onerror = err => {
				hash.dispose(); // eslint-disable-line no-use-before-define
				cb(err);
			};

			let outStream;
			let hash;
			if (file._isChunk) {
				if (!file._chunksData.stream) {
					file._chunksData.stream = fs.createWriteStream(finalPath, { flags: 'a' });
					file._chunksData.stream.on('error', onerror);
				}
				if (!file._chunksData.hasher) {
					file._chunksData.hasher = blake3.createHash();
				}

				outStream = file._chunksData.stream;
				hash = file._chunksData.hasher;
			} else {
				outStream = fs.createWriteStream(finalPath);
				outStream.on('error', onerror);
				hash = blake3.createHash();
			}

			file.stream.on('error', onerror);
			file.stream.on('data', d => hash.update(d));

			if (file._isChunk) {
				if (file._chunksData.chunks === 0) {
					FileType.stream(file.stream).then(ftStream => {
						file._chunksData.fileType = ftStream.fileType;
						file.stream.on('end', () => {
							cb(null, {
								destination,
								filename,
								path: finalPath,
								fileType: file._chunksData.fileType
							});
						});
						ftStream.pipe(outStream, { end: false });
					});
				} else {
					file.stream.on('end', () => {
						cb(null, {
							destination,
							filename,
							path: finalPath,
							fileType: file._chunksData.fileType
						});
					});
					file.stream.pipe(outStream, { end: false });
				}
			} else {
				FileType.stream(file.stream).then(ftStream => {
					outStream.on('finish', () => {
						cb(null, {
							destination,
							filename,
							path: finalPath,
							size: outStream.bytesWritten,
							hash: hash.digest('hex'),
							fileType: ftStream.fileType
						});
					});
					ftStream.pipe(outStream);
				});
			}
		});
	});
};

DiskStorage.prototype._removeFile = function _removeFile(req, file, cb) {
	const path = file.path;

	delete file.destination;
	delete file.filename;
	delete file.path;

	fs.unlink(path, cb);
};

module.exports = opts => new DiskStorage(opts);
