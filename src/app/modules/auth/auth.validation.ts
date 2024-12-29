import { z } from 'zod';

const loginSchema = z.object({
	id: z.string({ required_error: 'Id is required!' }),
	password: z.string({ required_error: 'Password is required!' }),
});

const changePasswordSchema = z.object({
	oldPassword: z.string({
		required_error: 'Old password is required!',
	}),
	newPassword: z.string({ required_error: 'Password is required' }),
});

const forgetPasswordSchema = z.object({
	id: z.string({
		required_error: 'User id is required!',
	}),
});

const resetPasswordSchema = z.object({
	id: z.string({
		required_error: 'User id is required!',
	}),
	newPassword: z.string({
		required_error: 'User password is required!',
	}),
});

export const authValidations = {
	loginSchema,
	changePasswordSchema,
	forgetPasswordSchema,
	resetPasswordSchema,
};
