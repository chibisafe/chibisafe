import si from 'systeminformation';
import prisma from '../structures/database';

export const Type = Object.freeze({
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

export const getSystemInfo = async () => {
	const os = await si.osInfo();

	const currentLoad = await si.currentLoad();
	const mem = await si.mem();
	const time = si.time();
	const nodeUptime = process.uptime();

	return {
		'Platform': `${os.platform} ${os.arch}`,
		'Distro': `${os.distro} ${os.release}`,
		'Kernel': os.kernel,
		'CPU Load': `${currentLoad.currentLoad.toFixed(1)}%`,
		'CPUs Load': currentLoad.cpus.map(cpu => `${cpu.load.toFixed(1)}%`).join(', '),
		'System Memory': {
			value: {
				used: mem.active,
				total: mem.total
			},
			type: Type.BYTE_USAGE
		},
		'Memory Usage': {
			value: process.memoryUsage().rss,
			type: Type.BYTE
		},
		'System Uptime': {
			value: time.uptime,
			type: Type.TIME
		},
		'Node.js': `${process.versions.node}`,
		'Service Uptime': {
			value: Math.floor(nodeUptime),
			type: Type.TIME
		}
	};
};

export const getFileSystemsInfo = async () => {
	const stats = {};

	const fsSize = await si.fsSize();
	for (const fs of fsSize) {
		stats[`${fs.fs} (${fs.type}) on ${fs.mount}`] = {
			value: {
				total: fs.size,
				used: fs.used
			},
			type: Type.BYTE_USAGE
		};
	}

	return stats;
};

export const getUploadsInfo = async () => {
	const stats = {
		'Total': 0,
		'Images': 0,
		'Videos': 0,
		'Others': {
			data: {},
			count: 0,
			type: Type.DETAILED
		},
		'Size in DB': {
			value: 0,
			type: Type.BYTE
		}
	};

	const getFilesCountAndSize = async () => {
		const uploads = await prisma.files.findMany({
			select: {
				size: true
			}
		});

		return {
			'Total': uploads.length,
			'Size in DB': {
				value: uploads.reduce((acc, upload) => acc + upload.size, 0),
				type: Type.BYTE
			}
		};
	};

	const getImagesCount = async () => {
		const Images = await prisma.files.count({
			select: {
				id: true
			},
			where: {
				type: {
					contains: 'image/'
				}
			}
		});

		return { Images: Images.id };
	};

	const getVideosCount = async () => {
		const Videos = await prisma.files.count({
			select: {
				id: true
			},
			where: {
				type: {
					contains: 'video/'
				}
			}
		});

		return { Videos: Videos.id };
	};

	const getOthersCount = async () => {
		// TODO: This needs additional testing as the returned object is no the same one as
		// before the typescript rewrite due to Prisma constraints.
		// https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing
		const data = await prisma.files.findMany({
			select: {
				type: true
			},
			where: {
				NOT: [
					{
						type: {
							contains: 'image/'
						}
					},
					{
						type: {
							contains: 'video/'
						}
					}
				]
			},
			orderBy: {
				type: 'desc'
			}
		});
		/*
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
				type: Type.DETAILED
			}
		};
		*/
	};

	const result = await Promise.all([getFilesCountAndSize(), getImagesCount(), getVideosCount(), getOthersCount()]);

	return { ...stats, ...Object.assign({}, ...result) };
};

export const getUsersInfo = async () => {
	const stats = {
		Total: 0,
		Admins: 0,
		Disabled: 0
	};

	const users = await prisma.users.findMany({
		select: {
			enabled: true,
			isAdmin: true
		}
	});

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
};

export const getAlbumStats = async () => {
	const stats = {
		'Total': 0,
		'NSFW': 0,
		'Generated archives': 0,
		'Generated identifiers': 0,
		'Files in albums': 0
	};

	const albums = await prisma.albums.findMany({
		select: {
			nsfw: true,
			zippedAt: true
		}
	});
	stats.Total = albums.length;
	for (const album of albums) {
		if (album.nsfw) stats.NSFW++;
		if (album.zippedAt) stats['Generated archives']++; // XXX: Bobby checks each after if a zip really exists on the disk. Is it really needed?
	}

	stats['Generated identifiers'] = await prisma.albumsLinks.count();
	stats['Files in albums'] = await prisma.albumsFiles.count();

	return stats;
};

// TODO: Finish this as it does nothing rn
export const getStats = () => ({});
/*
export const getStats = async () => {
	const res = {};

	for (const [name, funct] of Object.entries(statGenerators)) {
		res[name] = await funct(db);
	}

	return res;
};

export const getMissingStats = async (db, existingStats) => {
	const res = {};

	for (const [name, funct] of Object.entries(statGenerators)) {
		if (existingStats.indexOf(name) === -1)	res[name] = await funct(db);
	}

	return res;
};
*/

export const statGenerators = {
	system: getSystemInfo,
	fileSystems: getFileSystemsInfo,
	uploads: getUploadsInfo,
	users: getUsersInfo,
	albums: getAlbumStats
};

export const keyOrder = Object.keys(statGenerators);
