import path from 'node:path';
import { URL, fileURLToPath } from 'node:url';
import ffmpeg from 'fluent-ffmpeg';
import jetpack from 'fs-jetpack';
import { deleteTmpFile } from './File.js';
import { log } from './Logger.js';
import previewUtil from './videoPreview/FragmentPreview.js';

export const imageExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.webp', '.svg'];
export const videoExtensions = ['.webm', '.mp4', '.wmv', '.avi', '.mov'];

const thumbPath = fileURLToPath(new URL('../../../../uploads/thumbs', import.meta.url));
const squareThumbPath = fileURLToPath(new URL('../../../../uploads/thumbs/square', import.meta.url));
const videoPreviewPath = fileURLToPath(new URL('../../../../uploads/thumbs/preview', import.meta.url));

const generateThumbnailForImage = async ({
	filename,
	output,
	tmp = false,
	watched = false
}: {
	filename: string;
	output: string;
	tmp?: boolean;
	watched?: boolean;
}) => {
	const filePath = fileURLToPath(
		new URL(`../../../../uploads/${tmp ? 'tmp/' : ''}${watched ? 'live/' : ''}${filename}`, import.meta.url)
	);

	await new Promise((resolve, reject) => {
		ffmpeg(filePath)
			.size('64x64')
			.format('webp')
			.output(path.join(squareThumbPath, output))
			.on('error', error => {
				log.error(error.message);
				return reject;
			})
			.on('end', resolve)
			.run();
	});

	await new Promise((resolve, reject) => {
		ffmpeg(filePath)
			.size('256x?')
			.format('webp')
			.output(path.join(thumbPath, output))
			.on('error', error => {
				log.error(error.message);
				return reject;
			})
			.on('end', resolve)
			.run();
	});

	if (tmp) await deleteTmpFile(filePath);
};

const generateThumbnailForVideo = async ({
	filename,
	output,
	tmp = false,
	watched = false
}: {
	filename: string;
	output: string;
	tmp?: boolean;
	watched?: boolean;
}) => {
	const filePath = fileURLToPath(
		new URL(`../../../../uploads/${tmp ? 'tmp/' : ''}${watched ? 'live/' : ''}${filename}`, import.meta.url)
	);

	await new Promise((resolve, reject) => {
		ffmpeg(filePath)
			.thumbnail({
				timestamps: [0],
				filename: '%b.webp',
				folder: squareThumbPath,
				size: '64x64'
			})
			.on('error', error => {
				log.error(error.message);
				return reject;
			})
			.on('end', resolve);
	});

	await new Promise((resolve, reject) => {
		ffmpeg(filePath)
			.thumbnail({
				timestamps: [0],
				filename: '%b.webp',
				folder: thumbPath,
				size: '256x?'
			})
			.on('error', error => {
				log.error(error.message);
				return reject;
			})
			.on('end', resolve);
	});

	try {
		await previewUtil({
			input: filePath,
			width: 256,
			output: path.join(videoPreviewPath, output)
		});

		if (tmp) await deleteTmpFile(filePath);
	} catch (error) {
		log.error(error);
	}
};

export const generateThumbnails = async ({
	filename,
	tmp = false,
	watched = false
}: {
	filename: string;
	tmp?: boolean;
	watched?: boolean;
}) => {
	if (!filename) return;
	const ext = path.extname(filename).toLowerCase();
	const output = `${filename.slice(0, -ext.length)}.webp`;
	const previewOutput = `${filename.slice(0, -ext.length)}.webm`;

	log.debug(`Generating thumbnails for ${filename}`);

	// eslint-disable-next-line max-len
	if (imageExtensions.includes(ext)) return generateThumbnailForImage({ filename, output, tmp, watched });
	// eslint-disable-next-line max-len
	if (videoExtensions.includes(ext))
		return generateThumbnailForVideo({ filename, output: previewOutput, tmp, watched });
	return null;
};

export const getFileThumbnail = (filename: string) => {
	if (!filename) return null;
	const ext = path.extname(filename).toLowerCase();

	const isImage = imageExtensions.includes(ext);
	const isVideo = videoExtensions.includes(ext);

	if (isImage) return { thumb: `${filename.slice(0, -ext.length)}.webp` };
	if (isVideo) {
		return {
			thumb: `${filename.slice(0, -ext.length)}.webp`,
			preview: `${filename.slice(0, -ext.length)}.webm`
		};
	}

	return null;
};

export const removeThumbs = async ({ thumb, preview }: { preview?: string; thumb?: string }) => {
	if (thumb) {
		await jetpack.removeAsync(path.join(thumbPath, thumb));
		await jetpack.removeAsync(path.join(squareThumbPath, thumb));
	}

	if (preview) {
		await jetpack.removeAsync(path.join(videoPreviewPath, preview));
	}
};
