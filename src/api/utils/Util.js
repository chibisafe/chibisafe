const config = require('../../../config');
const jetpack = require('fs-jetpack');
const randomstring = require('randomstring');
const path = require('path');
const JWT = require('jsonwebtoken');
const db = require('knex')(config.server.database);
const moment = require('moment');
const log = require('../utils/Log');
const crypto = require('crypto');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');

const imageExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png', '.webp'];
const videoExtensions = ['.webm', '.mp4', '.wmv', '.avi', '.mov'];

class Util {
	static isExtensionBlocked(extension) {
		return config.uploads.blockedExtensions.includes(extension);
	}

	static generateThumbnails(filename) {
		const ext = path.extname(filename).toLowerCase();
		const output = `${filename.slice(0, -ext.length)}.png`;
		if (imageExtensions.includes(ext)) return this.generateThumbnailForImage(filename, output);
		if (videoExtensions.includes(ext)) return this.generateThumbnailForVideo(filename);
		return null;
	}

	/*
	static async removeExif(filename) {
		This needs more testing.
		Even though the exif data seems to be stripped, no other online service
		is recognizing the file as an image file.

		const ExifTransformer = require('exif-be-gone');
		const toStream = require('buffer-to-stream');

		const file = await jetpack.readAsync(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, filename), 'buffer');
		const writer = jetpack.createWriteStream(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, `${filename}.noexif`));
		toStream(file).pipe(new ExifTransformer()).pipe(writer);
	}
	*/

	static async generateThumbnailForImage(filename, output) {
		const file = await jetpack.readAsync(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, filename), 'buffer');
		await sharp(file)
			.resize(64, 64)
			.toFormat('png')
			.toFile(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, 'thumbs', 'square', output));
		await sharp(file)
			.resize(225, null)
			.toFormat('png')
			.toFile(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, 'thumbs', output));
	}

	static generateThumbnailForVideo(filename) {
		ffmpeg(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, filename))
			.thumbnail({
				timestamps: [0],
				filename: '%b.png',
				folder: path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, 'thumbs', 'square'),
				size: '64x64'
			})
			.on('error', error => log.error(error.message));
		ffmpeg(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, filename))
			.thumbnail({
				timestamps: [0],
				filename: '%b.png',
				folder: path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, 'thumbs'),
				size: '150x?'
			})
			.on('error', error => log.error(error.message));
	}

	static getFileThumbnail(filename) {
		const ext = path.extname(filename).toLowerCase();
		if (!imageExtensions.includes(ext) && !videoExtensions.includes(ext)) return null;
		return `${filename.slice(0, -ext.length)}.png`;
	}

	static constructFilePublicLink(file) {
		file.url = `${config.filesServeLocation}/${file.name}`;
		const thumb = this.getFileThumbnail(file.name);
		if (thumb) {
			file.thumb = `${config.filesServeLocation}/thumbs/${thumb}`;
			file.thumbSquare = `${config.filesServeLocation}/thumbs/square/${thumb}`;
		}
		return file;
	}

	static getUniqueFilename(name) {
		const retry = (i = 0) => {
			const filename = randomstring.generate({
				length: config.uploads.generatedFilenameLength,
				capitalization: 'lowercase'
			}) + path.extname(name);
			const exists = jetpack.exists(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, filename));
			if (!exists) return filename;
			if (i < config.uploads.retryFilenameTimes) return retry(i + 1);
			return null;
		};
		return retry();
	}

	static getUniqueAlbumIdentifier() {
		const retry = async (i = 0) => {
			const identifier = randomstring.generate({
				length: config.albums.generatedAlbumLinkLength,
				capitalization: 'lowercase'
			});
			const exists = await db.table('links').where({ identifier }).first();
			if (!exists) return identifier;
			/*
				It's funny but if you do i++ the asignment never gets done resulting in an infinite loop
			*/
			if (i < config.albums.retryAlbumLinkTimes) return retry(i + 1);
			log.error('Couldnt allocate identifier for album');
			return null;
		};
		return retry();
	}

	static async getFileHash(filename) {
		const file = await jetpack.readAsync(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, filename), 'buffer');
		if (!file) {
			log.error(`There was an error reading the file < ${filename} > for hashing`);
			return null;
		}

		const hash = crypto.createHash('md5');
		hash.update(file, 'utf8');
		return hash.digest('hex');
	}

	static getFilenameFromPath(fullPath) {
		return fullPath.replace(/^.*[\\\/]/, ''); // eslint-disable-line no-useless-escape
	}

	static async deleteFile(filename, deleteFromDB = false) {
		try {
			await jetpack.removeAsync(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, filename));
			if (deleteFromDB) {
				await db.table('files').where('name', filename).delete();
			}
		} catch (error) {
			log.error(`There was an error removing the file < ${filename} >`);
			log.error(error);
		}
	}

	static async deleteAllFilesFromAlbum(id) {
		try {
			const files = await db.table('files').where({ albumId: id });
			for (const file of files) {
				await jetpack.removeAsync(path.join(__dirname, '..', '..', '..', config.uploads.uploadFolder, file));
			}
			await db.table('files').where({ albumId: id }).delete();
		} catch (error) {
			log.error(error);
		}
	}

	static isAuthorized(req) {
		if (!req.headers.authorization) return false;
		const token = req.headers.authorization.split(' ')[1];
		if (!token) return false;

		return JWT.verify(token, config.server.secret, async (error, decoded) => {
			if (error) {
				log.error(error);
				return false;
			}
			const id = decoded ? decoded.sub : '';
			const iat = decoded ? decoded.iat : '';

			const user = await db.table('users').where({ id }).first();
			if (!user || !user.enabled) return false;
			if (iat && iat < moment(user.passwordEditedAt).format('x')) return false;

			return user;
		});
	}
}

module.exports = Util;
