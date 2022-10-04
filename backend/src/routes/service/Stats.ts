import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../structures/interfaces';

import { inspect } from 'node:util';
import log from '../../utils/Log';

import { cachedStats, getStats, keyOrder } from '../../utils/StatsGenerator';

export const options = {
	url: '/service/statistics',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: Response) => {
	// NOTE: Currently uses in-memory caching because storing to database is a tad too elaborate for me
	// Maybe in the future...
	await getStats();

	let ordered: { [index: string]: any } = {};
	ordered = keyOrder.reduce((acc, k) => {
		// If null, cache is likely still generating
		// For any requests after the first request that initiated the generation
		acc[k] = cachedStats[k].cache || null;
		return acc;
	}, ordered);

	return res.json({ statistics: ordered });
};
