import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../../structures/interfaces';

import { cachedStats, getStats, keyOrder, Type } from '../../../utils/StatsGenerator';

// NOTE: Use case? Refresh button per-category to request on-demand refresh
export const options = {
	url: '/admin/service/statistics/:category',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { category } = req.path_parameters;
	if (!category || !keyOrder.includes(category)) {
		return res.status(400).json({ message: 'Bad request.' });
	}

	// Generate required stats category, forced
	await getStats([category], true);

	const statistics = {
		[category]: {
			...cachedStats[category]?.cache,
			meta: {
				cached: Boolean(cachedStats[category]?.cache),
				generatedOn: cachedStats[category]?.generatedOn,
				type: Type.HIDDEN
			}
		}
	};

	return res.json({ statistics });
};
