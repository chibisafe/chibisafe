import { z } from 'zod';

export const queryLimitSchema = z.coerce.number().optional().describe('The amount of items per page.');
