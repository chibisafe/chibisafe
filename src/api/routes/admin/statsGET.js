const Route = require('../../structures/Route');
const Util = require('../../utils/Util');
const si = require('systeminformation');

// TODO: Implement a cache system that can be reset by other endpoints
const statsCache = {
	system: null,
	fileSystems: null,
	uploads: null,
	users: null,
	albums: null
};

// Thank you Bobby for the stats code https://github.com/BobbyWibowo/lolisafe/blob/safe.fiery.me/controllers/utilsController.js
class filesGET extends Route {
	constructor() {
		super('/admin/stats', 'get', { adminOnly: true });
	}

	async getSystemInfo() {
		const os = await si.osInfo();

		const currentLoad = await si.currentLoad();
		const mem = await si.mem();
		const time = si.time();
		const nodeUptime = process.uptime();

		return {
			'Platform': `${os.platform} ${os.arch}`,
			'Distro': `${os.distro} ${os.release}`,
			'Kernel': os.kernel,
			'CPU Load': `${currentLoad.currentload.toFixed(1)}%`,
			'CPUs Load': currentLoad.cpus.map(cpu => `${cpu.load.toFixed(1)}%`).join(', '),
			'System Memory': {
				value: {
					used: mem.active,
					total: mem.total
				},
				type: 'byteUsage'
			},
			'Memory Usage': {
				value: process.memoryUsage().rss,
				type: 'byte'
			},
			'System Uptime': {
				value: time.uptime,
				type: 'time'
			},
			'Node.js': `${process.versions.node}`,
			'Service Uptime': {
				value: Math.floor(nodeUptime),
				type: 'time'
			}
		};
	}

	async getFileSystemsInfo() {
		const stats = {};

		const fsSize = await si.fsSize();
		for (const fs of fsSize) {
			stats[`${fs.fs} (${fs.type}) on ${fs.mount}`] = {
				value: {
					total: fs.size,
					used: fs.used
				},
				type: 'byteUsage'
			};
		}

		return stats;
	}

	async getUploadsInfo(db) {
		const stats = {
			'Total': 0,
			'Images': 0,
			'Videos': 0,
			'Others': {
				data: {},
				count: 0,
				type: 'detailed'
			},
			'Temporary': 0,
			'Size in DB': {
				value: 0,
				type: 'byte'
			}
		};

		const getFilesCountAndSize = async () => {
			const uploads = await db.table('files').select('size');

			return {
				'Total': uploads.length,
				'Size in DB': {
					value: uploads.reduce((acc, upload) => acc + parseInt(upload.size, 10), 0),
					type: 'byte'
				}
			};
		};

		const getImagesCount = async () => {
			const Images = await db.table('files')
				.where('type', 'like', `image/%`)
				.count('id as count')
				.then(rows => rows[0].count);

			return { Images };
		};

		const getVideosCount = async () => {
			const Videos = await db.table('files')
				.where('type', 'like', `video/%`)
				.count('id as count')
				.then(rows => rows[0].count);

			return { Videos };
		};

		const getOthersCount = async () => {
			// rename to key, value from type, count
			const data = await db.table('files')
				.select('type as key')
				.count('id as value')
				.whereNot('type', 'like', `image/%`)
				.whereNot('type', 'like', `video/%`)
				.groupBy('key')
				.orderBy('value', 'desc');

			const count = data.reduce((acc, val) => acc + val.value, 0);

			return {
				Others: {
					data,
					count,
					type: 'detailed'
				}
			};
		};

		const result = await Promise.all([getFilesCountAndSize(), getImagesCount(), getVideosCount(), getOthersCount()]);

		return { ...stats, ...Object.assign({}, ...result) };
	}

	async getUsersInfo(db) {
		const stats = {
			Total: 0,
			Admins: 0,
			Disabled: 0
		};

		const users = await db.table('users');
		stats.Total = users.length;

		 for (const user of users) {
			if (!user.enabled) {
				stats.Disabled++;
			}

			if (user.isAdmin) {
				stats.Admins++;
			}
		}

		return stats;
	}

	async getAlbumStats(db) {
		const stats = {
			'Total': 0,
			'NSFW': 0,
			'Generated archives': 0,
			'Generated identifiers': 0,
			'Files in albums': 0
		};

		const albums = await db.table('albums');
		stats.Total = albums.length;
		for (const album of albums) {
			if (album.nsfw) stats.NSFW++;
			if (album.zipGeneratedAt) stats['Generated archives']++; // XXX: Bobby checks each after if a zip really exists on the disk. Is it really needed?
		}

		stats['Generated identifiers'] = await db.table('albumsLinks').count('id as count').then(rows => rows[0].count);
		stats['Files in albums'] = await db.table('albumsFiles')
			.whereNotNull('albumId')
			.count('id as count')
			.then(rows => rows[0].count);

		return stats;
	}

	async run(req, res, db) {
		const tmp = {
			system: await this.getSystemInfo(),
			fileSystems: await this.getFileSystemsInfo(),
			uploads: await this.getUploadsInfo(db),
			users: await this.getUsersInfo(db),
			albums: await this.getAlbumStats(db)
		};

		return res.json(tmp);
	}
}

module.exports = filesGET;
