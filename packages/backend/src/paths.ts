import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';

const rootUploadsDir = new URL(
	// If upload dir is absolute, URL will automatically ignore the import.meta.url
	process.env.UPLOADS_DIR ?? '../../../uploads',
	import.meta.url
);

export default {
	root: fileURLToPath(rootUploadsDir),
	live: fileURLToPath(new URL('live', rootUploadsDir)),
	tmp: fileURLToPath(new URL('tmp', rootUploadsDir)),
	zips: fileURLToPath(new URL('zips', rootUploadsDir)),
	quarantine: fileURLToPath(new URL('quarantine', rootUploadsDir)),
	squareThumbs: fileURLToPath(new URL('thumbs/square', rootUploadsDir)),
	previewThumbs: fileURLToPath(new URL('thumbs/preview', rootUploadsDir))
};
