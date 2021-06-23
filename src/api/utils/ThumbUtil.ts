import jetpack from 'fs-jetpack';
import path from 'path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import previewUtil from './videoPreview/FragmentPreview';

// TODO: Check that importing the log function works for routes and CLI (generateThumbs.ts)
import { log } from '../main';

const imageExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.webp'];
const videoExtensions = ['.webm', '.mp4', '.wmv', '.avi', '.mov'];

const thumbPath = path.join(__dirname, '../../../', 'uploads', 'thumbs');
const squareThumbPath = path.join(__dirname, '../../../', 'uploads', 'thumbs', 'square');
const videoPreviewPath = path.join(__dirname, '../../../', 'uploads', 'thumbs', 'preview');

export const generateThumbnails = (filename: string) => {
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

const generateThumbnailForImage = async (filename: string, output: string) => {
	const filePath = path.join(__dirname, '../../../', 'uploads', filename);

	const file = await jetpack.readAsync(filePath, 'buffer');
	await sharp(file)
		.resize(64, 64)
		.toFormat('webp')
		.toFile(path.join(squareThumbPath, output));
	await sharp(file)
		.resize(225, null)
		.toFormat('webp')
		.toFile(path.join(thumbPath, output));
};

const generateThumbnailForVideo = async (filename: string, output: string) => {
	const filePath = path.join(__dirname, '../../../', 'uploads', filename);

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
	} catch (e) {
		log.error(e);
	}
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

export const removeThumbs = async ({ thumb, preview }: { thumb?: string; preview?: string }) => {
	if (thumb) {
		await jetpack.removeAsync(path.join(thumbPath, thumb));
		await jetpack.removeAsync(path.join(squareThumbPath, thumb));
	}
	if (preview) {
		await jetpack.removeAsync(path.join(videoPreviewPath, preview));
	}
};
