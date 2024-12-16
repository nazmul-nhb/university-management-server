import { z } from 'zod';
import { userNameValidation } from '../user/user.validation';
import { bloodGroups, genders } from '../user/user.constants';
import type { TBloodGroup, TGender } from '../user/user.types';
import { createPartialSchema } from '../../utilities/partialSchema';

export const creationSchema = z.object({
	password: z.string().max(20),
	teacher: z.object({
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
		academicDepartment: z.string(),
		profileImg: z.string(),
	}),
});

const updateSchema = createPartialSchema(creationSchema);

export const teacherValidations = { creationSchema, updateSchema };
