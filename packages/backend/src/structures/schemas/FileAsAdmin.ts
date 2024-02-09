import { z } from 'zod';
import { fileAsUserSchema } from './FileAsUser.js';

const fileAsAdminExtendSchema = z
	.object({
		user: z
			.object({
				uuid: z.string().describe("The user's uuid."),
				username: z.string().describe("The user's username."),
				enabled: z.boolean().describe("Whether the user's account is enabled or not."),
				roles: z
					.array(
						z.object({
							name: z.string().describe("The role's name.")
						})
					)
					.describe("The user's roles."),
				createdAt: z.date().describe("The user's creation date.")
			})
			.nullable()
	})
	.describe('The file object.');

export const fileAsAdminSchema = fileAsUserSchema.extend(fileAsAdminExtendSchema.shape);
