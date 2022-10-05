import jetpack from 'fs-jetpack';
import path from 'node:path';
import process from 'node:process';
import { inspect } from 'node:util';
import schedule from 'node-schedule';
import * as si from 'systeminformation';
import log from '../utils/Log';

import prisma from '../structures/database';

import { getEnvironmentDefaults } from './Util';

interface CachedStatsEntry {
	cache?: any;
	generating: boolean;
	generatedOn: number;
}

// NOTE: Currently uses in-memory caching because storing to database is a tad too elaborate for me
// Maybe in the future...
export const cachedStats: { [index: string]: CachedStatsEntry } = {};

// Symbols would be better because they're unique, but harder to serialize them
export const Type = Object.freeze({
	// Should contain key value: number
	TIME: 'time',
	// Should contain key value: number
	BYTE: 'byte',
	// Should contain key value: { used: number, total: number }
	BYTE_USAGE: 'byteUsage',
	// Should contain key value: number
	TEMP_CELSIUS: 'tempC',
	// Should contain key data: Array<{ key: string, value: number | string }>
	// and optionally a count/total
	DETAILED: 'detailed',
	// Should contain key value: null
	// May consider still displaying entries with this type in the frontend,
	// but mark as unavailable explicitly due to backend lacking the capabilities
	UNAVAILABLE: 'unavailable',
	// Hidden type should be skipped during iteration, can contain anything
	// These should be treated on a case by case basis on the frontend
	HIDDEN: 'hidden'
});

export const getSystemInfo = async () => {
	const os = await si.osInfo();

	const cpu = await si.cpu();
	const cpuTemperature = await si.cpuTemperature();
	const currentLoad = await si.currentLoad();
	const mem = await si.mem();
	const time = si.time();

	return {
		Platform: `${os.platform} ${os.arch}`,
		Distro: `${os.distro} ${os.release}`,
		Kernel: os.kernel,
		CPU: `${cpu.cores} \u00D7 ${cpu.manufacturer} ${cpu.brand} @ ${cpu.speed.toFixed(2)}GHz`,
		'CPU Load': `${currentLoad.currentLoad.toFixed(1)}%`,
		'CPUs Load': currentLoad.cpus.map(cpu => `${cpu.load.toFixed(1)}%`).join(', '),
		'CPU Temperature':
			cpuTemperature && typeof cpuTemperature.main === 'number'
				? {
						value: cpuTemperature.main,
						// Temperature value from this library is hard-coded to Celsius
						type: Type.TEMP_CELSIUS
				  }
				: { value: null, type: Type.UNAVAILABLE },
		Memory: {
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
		Swap:
			mem && typeof mem.swaptotal === 'number' && mem.swaptotal > 0
				? {
						value: {
							used: mem.swapused,
							total: mem.swaptotal
						},
						type: Type.BYTE_USAGE
				  }
				: { value: null, type: Type.UNAVAILABLE },
		Uptime: {
			value: time.uptime,
			type: Type.TIME
		}
	};
};

export const getServiceInfo = async () => {
	const nodeUptime = process.uptime();

	return {
		'Node.js': `${process.versions.node}`,
		'Memory Usage': {
			value: process.memoryUsage().rss,
			type: Type.BYTE
		},
		Uptime: {
			value: Math.floor(nodeUptime),
			type: Type.TIME
		}
	};
};

export const getFileSystemsInfo = async () => {
	const stats: { [index: string]: any } = {};

	const fsSize = await si.fsSize();
	for (const fs of fsSize) {
		const obj: {
			value: { total: number; used: number; available?: number };
			type: string;
		} = {
			value: {
				total: fs.size,
				used: fs.used
			},
			type: Type.BYTE_USAGE
		};
		if (typeof fs.available === 'number') {
			obj.value.available = fs.available;
		}

		stats[`${fs.fs} (${fs.type}) on ${fs.mount}`] = obj;
	}

	return stats;
};

const getFilesCountAndSize = async () => {
	const uploads = await prisma.files.findMany({
		select: {
			size: true
		}
	});

	return {
		Total: uploads.length,
		'Size in DB': {
			value: uploads.reduce((acc, upload) => acc + upload.size, 0),
			type: Type.BYTE
		}
	};
};

const getImagesCount = async () => {
	const rows = await prisma.$queryRaw<{ [index: string]: bigint }[]>`
		SELECT COUNT(id)
		FROM files
		WHERE type LIKE ${`image/%`}
	`;

	// Number-ify bigint
	const count = Number(rows[0]['COUNT(id)']);

	return { Images: count };
};

const getVideosCount = async () => {
	const rows = await prisma.$queryRaw<{ [index: string]: bigint }[]>`
		SELECT COUNT(id)
		FROM files
		WHERE type LIKE ${`video/%`}
	`;

	// Number-ify bigint
	const count = Number(rows[0]['COUNT(id)']);

	return { Videos: count };
};

const getOthersCount = async () => {
	// Rename to key, value from type, count
	const rows = await prisma.$queryRaw<{ key: string; value: bigint }[]>`
		SELECT type AS key, COUNT(id) AS value
		FROM files
		WHERE type NOT LIKE ${`image/%`}
		AND type NOT LIKE ${`video/%`}
		GROUP BY key
		ORDER BY value DESC
	`;

	const data = rows.map(val => {
		return {
			key: val.key,
			value: Number(val.value)
		};
	});

	// Number-ify bigint
	const count = data.reduce((acc, val) => acc + val.value, 0);

	return {
		Others: {
			data,
			count,
			type: Type.DETAILED
		}
	};
};

export const getUploadsInfo = async () => {
	const stats = {
		Total: 0,
		Images: 0,
		Videos: 0,
		Others: {
			data: {},
			count: 0,
			type: Type.DETAILED
		},
		'Size in DB': {
			value: 0,
			type: Type.BYTE
		}
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

	const users = await prisma.users.findMany();
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
		Total: 0,
		NSFW: 0,
		'Generated archives': 0,
		'Generated identifiers': 0,
		'Files in albums': 0
	};

	const albums = await prisma.albums.findMany();
	stats.Total = albums.length;

	for (const album of albums) {
		if (album.nsfw) stats.NSFW++;
	}

	const files = await jetpack.listAsync(path.join(__dirname, '../../../uploads', 'zips'));
	if (Array.isArray(files)) {
		stats['Generated archives'] = files.length;
	}

	stats['Generated identifiers'] = await prisma.links
		.count({
			select: {
				id: true
			}
		})
		.then(row => row.id);

	stats['Files in albums'] = await prisma.albumsFiles
		.count({
			select: {
				id: true
			}
		})
		.then(row => row.id);

	return stats;
};

const statGenerators = {
	system: getSystemInfo,
	service: getServiceInfo,
	fileSystems: getFileSystemsInfo,
	uploads: getUploadsInfo,
	users: getUsersInfo,
	albums: getAlbumStats
};

export const keyOrder = Object.keys(statGenerators);

export const getStats = async () => {
	await Promise.all(
		Object.entries(statGenerators).map(async ([name, funct]) => {
			if (!cachedStats[name]) {
				cachedStats[name] = {
					generating: false,
					generatedOn: 0
				} as CachedStatsEntry;
			}

			if (cachedStats[name].generating) return;

			cachedStats[name].generating = true;

			await funct().then(result => {
				cachedStats[name].cache = result;

				cachedStats[name].generatedOn = Date.now();
				cachedStats[name].generating = false;
			});
		})
	);
	log.debug('StatsGenerator.getStats(): OK');
};

export const jumpstartStatistics = async () => {
	await getStats();
	schedule.scheduleJob(getEnvironmentDefaults().statisticsCron, getStats);
};
