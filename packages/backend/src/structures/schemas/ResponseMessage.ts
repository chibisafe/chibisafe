import { z } from 'zod';

export const responseMessageSchema = z.string().describe('A message describing the result of the request.');
