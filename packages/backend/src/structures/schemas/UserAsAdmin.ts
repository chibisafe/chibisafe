import { z } from 'zod';

export const userAsAdminSchema = z
	.object({
		uuid: z.string().describe("The user's uuid."),
		username: z.string().describe("The user's username."),
		roles: z
			.array(
				z.object({
					name: z.string().describe("The role's name.")
				})
			)
			.describe("The user's roles."),
		enabled: z.boolean().describe("Whether the user's account is enabled or not."),
		createdAt: z.date().describe("The user's creation date."),
		editedAt: z.date().optional().describe("The user's last edit date.")
	})
	.describe('The user object.');
