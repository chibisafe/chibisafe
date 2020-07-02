const jetpack = require('fs-jetpack');
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');

const imageExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.webp'];
const videoExtensions = ['.webm', '.mp4', '.wmv', '.avi', '.mov'];

class ThumbUtil {
	static generateThumbnails(filename) {
		const ext = path.extname(filename).toLowerCase();
		const output = `${filename.slice(0, -ext.length)}.png`;
		if (imageExtensions.includes(ext)) return this.generateThumbnailForImage(filename, output);
		if (videoExtensions.includes(ext)) return this.generateThumbnailForVideo(filename);
		return null;
	}

	static async generateThumbnailForImage(filename, output) {
		const file = await jetpack.readAsync(
			path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, filename),
			'buffer'
		);
		await sharp(file)
			.resize(64, 64)
			.toFormat('png')
			.toFile(path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, 'thumbs', 'square', output));
		await sharp(file)
			.resize(225, null)
			.toFormat('png')
			.toFile(path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, 'thumbs', output));
	}

	static generateThumbnailForVideo(filename) {
		ffmpeg(path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, filename))
			.thumbnail({
				timestamps: [0],
				filename: '%b.png',
				folder: path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, 'thumbs', 'square'),
				size: '64x64'
			})
			.on('error', error => log.error(error.message));
		ffmpeg(path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, filename))
			.thumbnail({
				timestamps: [0],
				filename: '%b.png',
				folder: path.join(__dirname, '..', '..', '..', process.env.UPLOAD_FOLDER, 'thumbs'),
				size: '150x?'
			})
			.on('error', error => log.error(error.message));
	}

	static getFileThumbnail(filename) {
		if (!filename) return null;
		const ext = path.extname(filename).toLowerCase();
		if (!imageExtensions.includes(ext) && !videoExtensions.includes(ext)) return null;
		return `${filename.slice(0, -ext.length)}.png`;
	}
}

module.exports = ThumbUtil;
