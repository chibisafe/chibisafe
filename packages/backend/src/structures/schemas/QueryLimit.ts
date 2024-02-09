import { z } from 'zod';

export const queryLimitSchema = z.number().min(1).max(500).optional().describe('The amount of items per page.');
