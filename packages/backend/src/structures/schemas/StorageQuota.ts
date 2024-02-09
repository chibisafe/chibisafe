import { z } from 'zod';

export const storageQuotaSchema = z
	.object({
		used: z.number().describe("The user's used storage space."),
		quota: z.number().describe("The user's storage quota."),
		overQuota: z.boolean().describe('Whether the user is over quota.')
	})
	.describe("The user's storage quota.");
