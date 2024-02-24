import { z } from 'zod';

export const booleanSchema = z
	.enum(['0', '1', 'true', 'false'])
	.catch('false')
	// eslint-disable-next-line eqeqeq
	.transform(value => value == 'true' || value == '1');
