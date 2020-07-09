const jetpack = require('fs-jetpack');
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const previewUtil = require('./videoPreview/FragmentPreview');

const log = require('./Log');

class ThumbUtil {
	static imageExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.webp'];

	static videoExtensions = ['.webm', '.mp4', '.wmv', '.avi', '.mov'];

	static thumbPath = path.join(__dirname, '../../../', process.env.UPLOAD_FOLDER, 'thumbs');

	static squareThumbPath = path.join(__dirname, '../../../', process.env.UPLOAD_FOLDER, 'thumbs', 'square');

	static videoPreviewPath = path.join(__dirname, '../../../', process.env.UPLOAD_FOLDER, 'thumbs', 'preview');

	static generateThumbnails(filename) {
		const ext = path.extname(filename).toLowerCase();
		const output = `${filename.slice(0, -ext.length)}.png`;
		const previewOutput = `${filename.slice(0, -ext.length)}.webm`;

		// eslint-disable-next-line max-len
		if (ThumbUtil.imageExtensions.includes(ext)) return ThumbUtil.generateThumbnailForImage(filename, output);
		// eslint-disable-next-line max-len
		if (ThumbUtil.videoExtensions.includes(ext)) return ThumbUtil.generateThumbnailForVideo(filename, previewOutput);
		return null;
	}

	static async generateThumbnailForImage(filename, output) {
		const filePath = path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, filename);

		const file = await jetpack.readAsync(filePath, 'buffer');
		await sharp(file)
			.resize(64, 64)
			.toFormat('png')
			.toFile(path.join(ThumbUtil.squareThumbPath, output));
		await sharp(file)
			.resize(225, null)
			.toFormat('png')
			.toFile(path.join(ThumbUtil.thumbPath, output));
	}

	static async generateThumbnailForVideo(filename, output) {
		const filePath = path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, filename);

		ffmpeg(filePath)
			.thumbnail({
				timestamps: [0],
				filename: '%b.png',
				folder: ThumbUtil.squareThumbPath,
				size: '64x64',
			})
			.on('error', (error) => log.error(error.message));

		ffmpeg(filePath)
			.thumbnail({
				timestamps: [0],
				filename: '%b.png',
				folder: ThumbUtil.thumbPath,
				size: '150x?',
			})
			.on('error', (error) => log.error(error.message));

		try {
			await previewUtil({
				input: filePath,
				width: 150,
				output: path.join(ThumbUtil.videoPreviewPath, output),
				log: log.debug,
			});
		} catch (e) {
			log.error(e);
		}
	}

	static getFileThumbnail(filename) {
		if (!filename) return null;
		const ext = path.extname(filename).toLowerCase();

		const isImage = ThumbUtil.imageExtensions.includes(ext);
		const isVideo = ThumbUtil.videoExtensions.includes(ext);

		if (isImage) return { thumb: `${filename.slice(0, -ext.length)}.png` };
		if (isVideo) {
			return {
				thumb: `${filename.slice(0, -ext.length)}.png`,
				preview: `${filename.slice(0, -ext.length)}.webm`,
			};
		}

		return null;
	}

	static async removeThumbs({ thumb, preview }) {
		if (thumb) {
			await jetpack.removeAsync(path.join(ThumbUtil.thumbPath, thumb));
			await jetpack.removeAsync(path.join(ThumbUtil.squareThumbPath, thumb));
		}
		if (preview) {
			await jetpack.removeAsync(path.join(ThumbUtil.videoPreviewPath, preview));
		}
	}
}

module.exports = ThumbUtil;
