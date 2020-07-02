const jetpack = require('fs-jetpack');
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const generatePreview = require('ffmpeg-generate-video-preview');

const log = require('./Log');

class ThumbUtil {
	static imageExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.webp'];
	static videoExtensions = ['.webm', '.mp4', '.wmv', '.avi', '.mov'];

	static thumbPath = path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, 'thumbs');
	static squareThumbPath = path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, 'thumbs', 'square');
	static videoPreviewPath = path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, 'thumbs', 'preview');

	static generateThumbnails(filename) {
		const ext = path.extname(filename).toLowerCase();
		const output = `${filename.slice(0, -ext.length)}.png`;
		const previewOutput = `${filename.slice(0, -ext.length)}.gif`;

		if (ThumbUtil.imageExtensions.includes(ext)) return this.generateThumbnailForImage(filename, output);
		if (ThumbUtil.videoExtensions.includes(ext)) return this.generateThumbnailForVideo(filename, previewOutput);
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

	static generateThumbnailForVideo(filename, output) {
		const filePath = path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, filename);

		ffmpeg(filePath)
			.thumbnail({
				timestamps: [0],
				filename: '%b.png',
				folder: ThumbUtil.squareThumbPath,
				size: '64x64'
			})
			.on('error', error => log.error(error.message));

		ffmpeg(filePath)
			.thumbnail({
				timestamps: [0],
				filename: '%b.png',
				folder: ThumbUtil.thumbPath,
				size: '150x?'
			})
			.on('error', error => log.error(error.message));

		try {
			generatePreview({
				input: filePath,
				width: 150,
				output: path.join(ThumbUtil.videoPreviewPath, output)
			});
		} catch (e) {
			console.error(e);
		}
	}

	static getFileThumbnail(filename) {
		if (!filename) return null;
		const ext = path.extname(filename).toLowerCase();
		if (!ThumbUtil.imageExtensions.includes(ext) && !ThumbUtil.videoExtensions.includes(ext)) return null;
		return `${filename.slice(0, -ext.length)}.png`;
	}

	static async removeThumbs(thumbName) {
		await jetpack.removeAsync(path.join(ThumbUtil.thumbPath, thumbName));
		await jetpack.removeAsync(ThumbUtil.squareThumbPath, thumbName);
	}
}

module.exports = ThumbUtil;
