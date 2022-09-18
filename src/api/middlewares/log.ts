import type { Request } from 'hyper-express';
import log from '../utils/Log';

interface DebugInformation {
	ip: string;
	url: string;
	method: string;
	body: string | undefined;
	params: object | undefined;
	query: object | undefined;
}

export default async (req: Request) => {
	const debug = {
		ip: req.ip,
		url: req.url,
		method: req.method
	} as DebugInformation;

	const body = await req.json();
	if (body) debug.body = body;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (req.path_parameters) debug.params = req.path_parameters;

	log.debug(JSON.stringify(debug));
};
