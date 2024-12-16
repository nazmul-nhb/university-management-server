import { z } from 'zod';

export const userNameValidation = z.object({
	firstName: z
		.string()
		.min(1)
		.max(20)
		.refine((value) => /^[A-Z]/.test(value), {
			message: 'First Name must start with a capital letter',
		}),
	middleName: z.string().max(20),
	lastName: z.string().max(20),
});

const creationSchema = z.object({
	password: z
		.string()
		.trim()
		.min(6, { message: 'Password must be at least 6 characters long!' })
		.max(20, { message: 'Password cannot be more than 20 characters!' })
		.optional(),
});

export const userValidations = { creationSchema };
