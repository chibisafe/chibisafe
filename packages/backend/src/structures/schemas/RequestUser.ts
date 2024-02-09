import { z } from 'zod';

export const requestUserSchema = z
	.object({
		uuid: z.string().describe("The user's UUID."),
		username: z.string().describe("The user's username."),
		roles: z
			.array(
				z.object({
					name: z.string().describe("The role's name.")
				})
			)
			.describe("The user's roles."),
		apiKey: z.string().nullable().describe("The user's API key."),
		passwordEditedAt: z.date().nullable().describe("The date and time the user's password was last edited.")
	})
	.describe('The user object.');
