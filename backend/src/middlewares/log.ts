import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

interface DebugInformation {
	ip: string;
	url: string;
	method: string;
	body: string | undefined;
	params: object | undefined;
	query: object | undefined;
}

export default (req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
	const debug = {
		ip: req.ip,
		url: req.url,
		method: req.method
	} as DebugInformation;

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (req.params) debug.params = req.params;

	req.log.debug(JSON.stringify(debug));

	next();
};
