import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../structures/interfaces';

import { inspect } from 'node:util';
import log from '../../utils/Log';

import { cachedStats, getStats, keyOrder, Type } from '../../utils/StatsGenerator';

export const options = {
	url: '/service/statistics',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: Response) => {
	let ordered: { [index: string]: any } = {};
	ordered = keyOrder.reduce((acc, k) => {
		acc[k] = {
			...cachedStats[k]?.cache,
			meta: {
				cached: Boolean(cachedStats[k]?.cache),
				generatedOn: cachedStats[k]?.generatedOn,
				type: Type.HIDDEN
			}
		};
		return acc;
	}, ordered);

	return res.json({ statistics: ordered });
};
