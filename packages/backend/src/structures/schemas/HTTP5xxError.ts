import { z } from 'zod';
import { responseMessageSchema } from './ResponseMessage.js';

export const http5xxErrorSchema = z.object({
	statusCode: z.number().describe('HTTP status code.'),
	error: z.string().describe('HTTP status description.'),
	message: responseMessageSchema
});
