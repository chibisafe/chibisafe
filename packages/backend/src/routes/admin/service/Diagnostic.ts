import { URL, fileURLToPath } from 'node:url';
import envinfo from 'envinfo';
import type { FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/admin/service/diagnostic',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (_: RequestWithUser, res: FastifyReply) => {
	const auditPath = fileURLToPath(new URL('../../../../../../logs/chibisafe-audit.json', import.meta.url));
	const logsAudit = await jetpack.readAsync(auditPath, 'json');
	const logsFile = logsAudit.files[logsAudit.files.length - 1];
	const logs = await jetpack.readAsync(logsFile.name, 'utf8');

	const envInfo = await envinfo.run(
		{
			System: ['OS', 'CPU', 'Memory', 'Shell'],
			Binaries: ['Node', 'Yarn', 'npm'],
			Virtualization: ['Docker']
		},
		{
			showNotFound: true
		}
	);

	const diagnostics = envInfo + '\n\n' + logs;
	return res.send({ diagnostics });
};
