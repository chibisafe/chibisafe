const si = require('systeminformation');

class StatsGenerator {
	// symbols would be better because they're unique, but harder to serialize them
	static Type = Object.freeze({
		// should contain key value: number
		TIME: 'time',
		// should contain key value: number
		BYTE: 'byte',
		// should contain key value: { used: number, total: number }
		BYTE_USAGE: 'byteUsage',
		// should contain key data: Array<{ key: string, value: number | string }>
		// and optionally a count/total
		DETAILED: 'detailed',
		// hidden type should be skipped during iteration, can contain anything
		// these should be treated on a case by case basis on the frontend
		HIDDEN: 'hidden'
	});

	static statGenerators = {
		system: StatsGenerator.getSystemInfo,
		fileSystems: StatsGenerator.getFileSystemsInfo,
		uploads: StatsGenerator.getUploadsInfo,
		users: StatsGenerator.getUsersInfo,
		albums: StatsGenerator.getAlbumStats
	};

	static keyOrder = Object.keys(StatsGenerator.statGenerators);

	static async getSystemInfo() {
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
				type: StatsGenerator.Type.BYTE_USAGE
			},
			'Memory Usage': {
				value: process.memoryUsage().rss,
				type: StatsGenerator.Type.BYTE
			},
			'System Uptime': {
				value: time.uptime,
				type: StatsGenerator.Type.TIME
			},
			'Node.js': `${process.versions.node}`,
			'Service Uptime': {
				value: Math.floor(nodeUptime),
				type: StatsGenerator.Type.TIME
			}
		};
	}

	static async getFileSystemsInfo() {
		const stats = {};

		const fsSize = await si.fsSize();
		for (const fs of fsSize) {
			stats[`${fs.fs} (${fs.type}) on ${fs.mount}`] = {
				value: {
					total: fs.size,
					used: fs.used
				},
				type: StatsGenerator.Type.BYTE_USAGE
			};
		}

		return stats;
	}

	static async getUploadsInfo(db) {
		const stats = {
			'Total': 0,
			'Images': 0,
			'Videos': 0,
			'Others': {
				data: {},
				count: 0,
				type: StatsGenerator.Type.DETAILED
			},
			'Size in DB': {
				value: 0,
				type: StatsGenerator.Type.BYTE
			}
		};

		const getFilesCountAndSize = async () => {
			const uploads = await db.table('files').select('size');

			return {
				'Total': uploads.length,
				'Size in DB': {
					value: uploads.reduce((acc, upload) => acc + parseInt(upload.size, 10), 0),
					type: StatsGenerator.Type.BYTE
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
					type: StatsGenerator.Type.DETAILED
				}
			};
		};

		const result = await Promise.all([getFilesCountAndSize(), getImagesCount(), getVideosCount(), getOthersCount()]);

		return { ...stats, ...Object.assign({}, ...result) };
	}

	static async getUsersInfo(db) {
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

	static async getAlbumStats(db) {
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

	static async getStats(db) {
		const res = {};

		for (const [name, funct] of Object.entries(StatsGenerator.statGenerators)) {
			res[name] = await funct(db);
		}

		return res;
	}

	static async getMissingStats(db, existingStats) {
		const res = {};

		for (const [name, funct] of Object.entries(StatsGenerator.statGenerators)) {
			if (existingStats.indexOf(name) === -1)	res[name] = await funct(db);
		}

		return res;
	}
}

module.exports = StatsGenerator;
