import prisma from '@/structures/database';
import { SETTINGS } from '@/structures/settings';

export const getUsedQuota = async (userId: number) => {
	try {
		const user = await prisma.users.findFirst({
			where: {
				id: userId
			},
			select: {
				storageQuota: true
			}
		});

		if (!user) return false;

		const result = await prisma.$queryRaw`SELECT SUM(size) FROM files WHERE userId = ${userId}`;
		// @ts-ignore
		const totalSize = Number(result[0]['SUM(size)']) ?? 0;

		const data = {
			used: totalSize,
			quota: user.storageQuota ?? SETTINGS.usersStorageQuota,
			overQuota: false
		};

		// If no global quota and no user quota, return false
		if (SETTINGS.usersStorageQuota === 0 && user.storageQuota === 0) {
			return data;
		}

		// If user quota is set, check if user is over quota
		if (user.storageQuota !== 0) {
			data.overQuota = totalSize > user.storageQuota;
			return data;
		}

		// If user quota is not set, check if user is over global quota
		data.overQuota = totalSize > SETTINGS.usersStorageQuota;
		return data;
	} catch (error: any) {
		throw new Error(error);
	}
};
