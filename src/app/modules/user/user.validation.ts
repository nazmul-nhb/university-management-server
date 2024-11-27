import { z } from 'zod';

const userCreationSchema = z.object({
	id: z
		.string({
			message: 'User ID is required!',
			// invalid_type_error: 'ID must be a string',
		})
		.trim()
		.min(6, { message: 'User ID must be at least 6 characters long!' }),

	password: z
		.string({
			message: 'Password is required!',
			// invalid_type_error: 'Password must be string',
		})
		.trim()
		.min(6, { message: 'Password must be at least 6 characters long!' })
		.max(20, { message: 'Password cannot be more than 20 characters!' }),

	needsPasswordChange: z
		.boolean()
		.optional()
		.default(true),

	role: z.enum(['student', 'faculty', 'admin'], {
		message: 'Role must be one of: student, faculty, admin!',
	}),

	status: z
		.enum(['in-progress', 'blocked'], {
			message: 'Status must be one of: in-progress, blocked!',
		})
		.optional()
		.default('in-progress'),

	isDeleted: z.boolean().optional().default(false),
});

const userUpdateSchema = userCreationSchema
	.partial()
	.omit({ id: true, role:true })
	.strict();

export const zodUser = { userCreationSchema, userUpdateSchema };
