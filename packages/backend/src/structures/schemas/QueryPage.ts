import { z } from 'zod';

export const queryPageSchema = z.number().min(1).optional().describe('The page number.');
