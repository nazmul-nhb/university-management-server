import { z } from 'zod';
import { bloodGroups, genders } from '../user/user.constants';
import { createPartialSchema } from '../../utilities/partialSchema';
import { userNameValidation } from '../user/user.validation';
import type { TBloodGroup, TGender } from '../user/user.types';

export const creationSchema = z.object({
	password: z.string().max(20).optional(),
	admin: z.object({
		designation: z.string(),
		name: userNameValidation,
		gender: z.enum(genders as [TGender, ...TGender[]]),
		dateOfBirth: z.string().optional(),
		email: z.string().email(),
		contactNo: z.string(),
		emergencyContactNo: z.string(),
		bloodGroup: z.enum(bloodGroups as [TBloodGroup, ...TBloodGroup[]]),
		presentAddress: z.string(),
		permanentAddress: z.string(),
		profileImg: z.string(),
	}),
});

export const updateSchema = createPartialSchema(creationSchema);

export const adminValidations = { creationSchema, updateSchema };
