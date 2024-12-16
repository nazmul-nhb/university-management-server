import { z } from 'zod';
import { bloodGroups, genders } from './admin.constants';
import { createPartialSchema } from '../../utilities/partialSchema';

const userNameValidation = z.object({
	firstName: z.string().min(1).max(20),
	middleName: z.string().max(20),
	lastName: z.string().max(20),
});

export const creationSchema = z.object({
	password: z.string().max(20),
	admin: z.object({
		designation: z.string(),
		name: userNameValidation,
		gender: z.enum([...genders] as [string, ...string[]]),
		dateOfBirth: z.string().optional(),
		email: z.string().email(),
		contactNo: z.string(),
		emergencyContactNo: z.string(),
		bloodGroup: z.enum([...bloodGroups] as [string, ...string[]]),
		presentAddress: z.string(),
		permanentAddress: z.string(),
		profileImg: z.string(),
	}),
});

export const updateSchema = createPartialSchema(creationSchema);

export const adminValidations = { creationSchema, updateSchema };
