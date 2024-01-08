import path from 'node:path';
import { URL, fileURLToPath } from 'node:url';
import ffmpeg from 'fluent-ffmpeg';
import jetpack from 'fs-jetpack';
import { log } from './Logger.js';
import previewUtil from './videoPreview/FragmentPreview.js';

const imageExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.webp', '.svg'];
const videoExtensions = ['.webm', '.mp4', '.wmv', '.avi', '.mov'];

const thumbPath = fileURLToPath(new URL('../../../../uploads/thumbs', import.meta.url));
const squareThumbPath = fileURLToPath(new URL('../../../../uploads/thumbs/square', import.meta.url));
const videoPreviewPath = fileURLToPath(new URL('../../../../uploads/thumbs/preview', import.meta.url));

const generateThumbnailForImage = async (filename: string, output: string) => {
	const filePath = fileURLToPath(new URL(`../../../../uploads/${filename}`, import.meta.url));

	ffmpeg(filePath)
		.size('64x64')
		.format('webp')
		.output(path.join(squareThumbPath, output))
		.on('error', error => log.error(error.message))
		.run();

	ffmpeg(filePath)
		.size('255x?')
		.format('webp')
		.output(path.join(thumbPath, output))
		.on('error', error => log.error(error.message))
		.run();
};

const generateThumbnailForVideo = async (filename: string, output: string) => {
	const filePath = fileURLToPath(new URL(`../../../../uploads/${filename}`, import.meta.url));

	ffmpeg(filePath)
		.thumbnail({
			timestamps: [0],
			filename: '%b.webp',
			folder: squareThumbPath,
			size: '64x64'
		})
		.on('error', error => log.error(error.message));

	ffmpeg(filePath)
		.thumbnail({
			timestamps: [0],
			filename: '%b.webp',
			folder: thumbPath,
			size: '150x?'
		})
		.on('error', error => log.error(error.message));

	try {
		await previewUtil({
			input: filePath,
			width: 150,
			output: path.join(videoPreviewPath, output)
		});
	} catch (error) {
		log.error(error);
	}
};

export const generateThumbnails = async (filename: string) => {
	if (!filename) return;
	const ext = path.extname(filename).toLowerCase();
	const output = `${filename.slice(0, -ext.length)}.webp`;
	const previewOutput = `${filename.slice(0, -ext.length)}.webm`;

	// eslint-disable-next-line max-len
	if (imageExtensions.includes(ext)) return generateThumbnailForImage(filename, output);
	// eslint-disable-next-line max-len
	if (videoExtensions.includes(ext)) return generateThumbnailForVideo(filename, previewOutput);
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
