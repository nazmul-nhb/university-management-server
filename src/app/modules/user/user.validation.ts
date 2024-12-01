import { z } from 'zod';

const creationSchema = z.object({
	password: z
		.string()
		.trim()
		.min(6, { message: 'Password must be at least 6 characters long!' })
		.max(20, { message: 'Password cannot be more than 20 characters!' })
		.optional(),
});

export const userValidations = { creationSchema };
