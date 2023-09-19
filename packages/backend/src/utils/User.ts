import prisma from '@/structures/database.js';
import { SETTINGS } from '@/structures/settings.js';

export const getUsedQuota = async (userId: number, extraBytes = 0) => {
	if (!userId) return null;
	try {
		const user = await prisma.users.findFirst({
			where: {
				id: userId
			},
			select: {
				storageQuota: true
			}
		});

		if (!user) return null;

		const userStorageQuota = Number(user.storageQuota);

		const result = await prisma.$queryRaw`SELECT SUM(size) FROM files WHERE userId = ${userId}`;
		// @ts-ignore
		const totalSize = Number(result[0]['SUM(size)']) + extraBytes ?? 0;

		const data = {
			used: totalSize,
			quota: userStorageQuota === 0 ? SETTINGS.usersStorageQuota : userStorageQuota === -1 ? 0 : userStorageQuota,
			overQuota: false
		};

		// If no global quota and no user quota, return false
		if (SETTINGS.usersStorageQuota === 0 && userStorageQuota === 0) {
			return data;
		}

		// If user quota is set, check if user is over quota
		if (userStorageQuota !== 0) {
			data.overQuota = totalSize > userStorageQuota;
			return data;
		}

		// If user quota is not set, check if user is over global quota
		data.overQuota = totalSize > SETTINGS.usersStorageQuota;
		return data;
	} catch (error: any) {
		throw new Error(error);
	}
};
