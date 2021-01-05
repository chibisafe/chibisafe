/* eslint-disable no-await-in-loop */
const jetpack = require('fs-jetpack');
const randomstring = require('randomstring');
const path = require('path');
const JWT = require('jsonwebtoken');
const db = require('knex')({
	client: process.env.DB_CLIENT,
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		filename: path.join(__dirname, '../../../database/database.sqlite')
	},
	useNullAsDefault: process.env.DB_CLIENT === 'sqlite'
});
const moment = require('moment');
const crypto = require('crypto');
const Zip = require('adm-zip');
const uuidv4 = require('uuid/v4');

const log = require('./Log');
const ThumbUtil = require('./ThumbUtil');

const blockedExtensions = process.env.BLOCKED_EXTENSIONS.split(',');

class Util {
	static uploadPath = path.join(__dirname, '../../../', process.env.UPLOAD_FOLDER);

	static uuid() {
		return uuidv4();
	}

	static isExtensionBlocked(extension) {
		return blockedExtensions.includes(extension);
	}

	static constructFilePublicLink(file) {
		/*
			TODO: This wont work without a reverse proxy serving both
			the site and the API under the same domain. Pls fix.
		*/
		file.url = `${process.env.DOMAIN}/${file.name}`;
		const { thumb, preview } = ThumbUtil.getFileThumbnail(file.name) || {};
		if (thumb) {
			file.thumb = `${process.env.DOMAIN}/thumbs/${thumb}`;
			file.thumbSquare = `${process.env.DOMAIN}/thumbs/square/${thumb}`;
			file.preview = preview && `${process.env.DOMAIN}/thumbs/preview/${preview}`;
		}
		return file;
	}

	static getUniqueFilename(name) {
		const retry = (i = 0) => {
			const filename = randomstring.generate({
				length: parseInt(process.env.GENERATED_FILENAME_LENGTH, 10),
				capitalization: 'lowercase'
			}) + path.extname(name).toLowerCase();

			// TODO: Change this to look for the file in the db instead of in the filesystem
			const exists = jetpack.exists(path.join(Util.uploadPath, filename));
			if (!exists) return filename;
			if (i < 5) return retry(i + 1);
			log.error('Couldnt allocate identifier for file');
			return null;
		};
		return retry();
	}

	static getUniqueAlbumIdentifier() {
		const retry = async (i = 0) => {
			const identifier = randomstring.generate({
				length: parseInt(process.env.GENERATED_ALBUM_LENGTH, 10),
				capitalization: 'lowercase'
			});
			const exists = await db
				.table('links')
				.where({ identifier })
				.first();
			if (!exists) return identifier;
			/*
				It's funny but if you do i++ the asignment never gets done resulting in an infinite loop
			*/
			if (i < 5) return retry(i + 1);
			log.error('Couldnt allocate identifier for album');
			return null;
		};
		return retry();
	}

	static async getFileHash(filename) {
		const file = await jetpack.readAsync(path.join(Util.uploadPath, filename), 'buffer');
		if (!file) {
			log.error(`There was an error reading the file < ${filename} > for hashing`);
			return null;
		}

		const hash = crypto.createHash('md5');
		hash.update(file, 'utf8');
		return hash.digest('hex');
	}

	static generateFileHash(data) {
		const hash = crypto
			.createHash('md5')
			.update(data)
			.digest('hex');
		return hash;
	}

	static async checkIfFileExists(db, user, hash) {
		const exists = await db.table('files')
			.where(function() { // eslint-disable-line func-names
				if (user) this.where('userId', user.id);
				else this.whereNull('userId');
			})
			.where({ hash })
			.first();
		return exists;
	}

	static getFilenameFromPath(fullPath) {
		return fullPath.replace(/^.*[\\\/]/, ''); // eslint-disable-line no-useless-escape
	}

	static async deleteFile(filename, deleteFromDB = false) {
		const thumbName = ThumbUtil.getFileThumbnail(filename);
		try {
			await jetpack.removeAsync(path.join(Util.uploadPath, filename));
			if (thumbName) await ThumbUtil.removeThumbs(thumbName);

			if (deleteFromDB) {
				await db
					.table('files')
					.where('name', filename)
					.delete();
			}
		} catch (error) {
			log.error(`There was an error removing the file < ${filename} >`);
			log.error(error);
		}
	}

	static async deleteAllFilesFromAlbum(id) {
		try {
			const fileAlbums = await db.table('albumsFiles').where({ albumId: id });
			for (const fileAlbum of fileAlbums) {
				const file = await db
					.table('files')
					.where({ id: fileAlbum.fileId })
					.first();

				if (!file) continue;

				await this.deleteFile(file.name, true);
			}
		} catch (error) {
			log.error(error);
		}
	}

	static async deleteAllFilesFromUser(id) {
		try {
			const files = await db.table('files').where({ userId: id });
			for (const file of files) {
				await this.deleteFile(file.name, true);
			}
		} catch (error) {
			log.error(error);
		}
	}

	static async deleteAllFilesFromTag(id) {
		try {
			const fileTags = await db.table('fileTags').where({ tagId: id });
			for (const fileTag of fileTags) {
				const file = await db
					.table('files')
					.where({ id: fileTag.fileId })
					.first();
				if (!file) continue;
				await this.deleteFile(file.name, true);
			}
		} catch (error) {
			log.error(error);
		}
	}

	static async isAuthorized(req) {
		if (req.headers.token) {
			const user = await db.table('users').where({ apiKey: req.headers.token }).first();
			if (!user || !user.enabled) return false;
			return user;
		}

		if (!req.headers.authorization) return false;
		const token = req.headers.authorization.split(' ')[1];
		if (!token) return false;

		return JWT.verify(token, process.env.SECRET, async (error, decoded) => {
			if (error) {
				log.error(error);
				return false;
			}
			const id = decoded ? decoded.sub : '';
			const iat = decoded ? decoded.iat : '';

			const user = await db
				.table('users')
				.where({ id })
				.first();
			if (!user || !user.enabled) return false;
			if (iat && iat < moment(user.passwordEditedAt).format('x')) return false;

			return user;
		});
	}

	static createZip(files, album) {
		try {
			const zip = new Zip();
			for (const file of files) {
				zip.addLocalFile(path.join(Util.uploadPath, file));
			}
			zip.writeZip(
				path.join(
					__dirname,
					'../../../',
					process.env.UPLOAD_FOLDER,
					'zips',
					`${album.userId}-${album.id}.zip`
				)
			);
		} catch (error) {
			log.error(error);
		}
	}

	static generateThumbnails = ThumbUtil.generateThumbnails;
	static async saveFileToDatabase(req, res, user, db, file, originalFile) {
		/*
			Save the upload information to the database
		*/
		const now = moment.utc().toDate();
		let insertedId = null;
		try {
			/*
				This is so fucking dumb
			*/
			if (process.env.DB_CLIENT === 'sqlite3') {
				insertedId = await db.table('files').insert({
					userId: user ? user.id : null,
					name: file.name,
					original: originalFile.originalname,
					type: originalFile.mimetype || '',
					size: file.size,
					hash: file.hash,
					ip: req.ip,
					createdAt: now,
					editedAt: now
				});
			} else {
				insertedId = await db.table('files').insert({
					userId: user ? user.id : null,
					name: file.name,
					original: originalFile.originalname,
					type: originalFile.mimetype || '',
					size: file.size,
					hash: file.hash,
					ip: req.ip,
					createdAt: now,
					editedAt: now
				}, 'id');
			}
			return insertedId;
		} catch (error) {
			console.error('There was an error saving the file to the database');
			console.error(error);
			return null;
		}
	}

	static async saveFileToAlbum(db, albumId, insertedId) {
		if (!albumId) return;

		const now = moment.utc().toDate();
		try {
			await db.table('albumsFiles').insert({ albumId, fileId: insertedId[0] });
			await db.table('albums').where('id', albumId).update('editedAt', now);
		} catch (error) {
			console.error(error);
		}
	}
}

module.exports = Util;
