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

const refreshTokenSchema = z.object({
	cookies: z.object({
		refreshToken: z.string({
			required_error: 'Refresh token is required!',
		}),
	}),
});

export const authValidations = {
	loginSchema,
	changePasswordSchema,
	refreshTokenSchema,
};
