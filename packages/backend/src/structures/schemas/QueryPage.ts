import { z } from 'zod';

export const queryPageSchema = z.coerce.number().optional().describe('The page number.');
