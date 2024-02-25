import process from 'node:process';
import schedule from 'node-schedule';
import * as si from 'systeminformation';
import prisma from '@/structures/database.js';
import { SETTINGS } from '@/structures/settings.js';
import { log } from '@/utils/Logger.js';

interface StatGeneratorOptions {
	funct(): Promise<{ [index: string]: any }>;
	// If set, getStats() will only re-generate if cache no longer satisfies maxAge option,
	// otherwise must specify "force" bool option in getStats() to re-generate
	maxAge?: number;
}

interface CachedStatsEntry {
	cache?: any;
	generatedOn: number;
	generating: boolean;
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
			type: string;
			value: { available?: number; total: number; used: number };
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

export const getUploadsInfo = async () => {
	const uploads = await prisma.files.findMany({
		select: {
			name: true,
			type: true,
			size: true
		}
	});

	const stats = {
		Total: uploads.length,
		Images: 0,
		Videos: 0,
		Others: 0,
		sizeInDB: 0
	};

	// Temporary mime types container
	const types: { [index: string]: number } = {};

	for (const upload of uploads) {
		if (upload.type.startsWith('image/')) {
			stats.Images++;
		} else if (upload.type.startsWith('video/')) {
			stats.Videos++;
		} else {
			stats.Others++;
		}

		stats.sizeInDB += Number(upload.size);

		if (types[upload.type] === undefined) {
			types[upload.type] = 0;
		}

		types[upload.type]++;
	}

	return stats;
};

export const getUsersInfo = async () => {
	const stats = {
		Total: 0,
		Admins: 0,
		Disabled: 0
	};

	const users = await prisma.users.findMany({
		include: {
			roles: {
				select: {
					name: true
				}
			}
		}
	});
	stats.Total = users.length;

	for (const user of users) {
		if (!user.enabled) {
			stats.Disabled++;
		}

		if (user?.roles.some(role => role.name === 'admin')) {
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
		if (album.zippedAt) stats['Generated archives']++;
	}

	stats['Generated identifiers'] = await prisma.links
		.count({
			select: {
				id: true
			}
		})
		.then((row: any) => row.id);

	// TODO: Fix relation
	// stats['Files in albums'] = await prisma.albumsFiles
	// 	.count({
	// 		select: {
	// 			id: true
	// 		}
	// 	})
	// 	.then(row => row.id);

	return stats;
};

const statGenerators: { [index: string]: StatGeneratorOptions } = {
	system: {
		funct: getSystemInfo,
		maxAge: 1000
	},
	service: {
		funct: getServiceInfo,
		maxAge: 1000
	},
	fileSystems: {
		funct: getFileSystemsInfo,
		maxAge: 60000
	},
	uploads: {
		funct: getUploadsInfo
	},
	users: {
		funct: getUsersInfo
	},
	albums: {
		funct: getAlbumStats
	}
};

export const keyOrder = Object.keys(statGenerators).filter(category => SETTINGS.enabledStatistics?.includes(category));

export const getStats = async (categories?: string[], force = false) => {
	let keys: string[] = keyOrder;
	if (Array.isArray(categories) && categories.length) {
		keys = categories;
	}

	await Promise.all(
		keys.map(async name => {
			const opts = statGenerators[name];

			if (!cachedStats[name]) {
				cachedStats[name] = {
					generating: false,
					generatedOn: 0
				} as CachedStatsEntry;
			}

			// Skip if somehow still generating (e.g. by scheduler, or other requests)
			if (cachedStats[name]?.generating) return;

			// Skip if cache already exists, and satisfies the following...
			if (cachedStats[name]?.cache) {
				if (typeof opts?.maxAge === 'number') {
					// maxAge is configured, is not forced to re-generated, and cache still satisfies it
					if (!force && Date.now() - (cachedStats[name]?.generatedOn ?? 0) <= opts.maxAge) {
						return;
					}
				} else if (!force) {
					// Otherwise, maxAge is not configured, and is not forced to re-generate
					return;
				}
			}

			if (cachedStats[name]) {
				cachedStats[name]!.generating = true;
			}

			return opts?.funct().then(result => {
				if (cachedStats[name]) {
					cachedStats[name]!.cache = result;

					cachedStats[name]!.generatedOn = Date.now();
					cachedStats[name]!.generating = false;
				}

				log.debug(`StatsGenerator.getStats(): ${name}: OK`);
			});
		})
	);
};

export const jumpstartStatistics = async () => {
	// Only use scheduler to generate the following categories
	const scheduledStatsCategories = ['system', 'service', 'fileSystems', 'uploads', 'users', 'albums'].filter(
		category => SETTINGS.enabledStatistics.includes(category)
	);

	// Immediately generate stats for the first time
	log.debug('Generate scheduled stats categories for the first time');
	await getStats(scheduledStatsCategories);

	if (!SETTINGS.disableStatisticsCron) {
		// Start scheduler
		schedule.scheduleJob(SETTINGS.statisticsCron, async () => {
			// Get scheduled stats categories, forced
			log.debug('Generating scheduled stats categories\u2026');
			return getStats(scheduledStatsCategories, true);
		});
	}
};
