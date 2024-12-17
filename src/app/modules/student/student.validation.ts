import { z } from 'zod';
import { createPartialSchema } from '../../utilities/partialSchema';
import { userNameValidation } from '../user/user.validation';
import { bloodGroups, genders } from '../user/user.constants';
import type { TBloodGroup, TGender } from '../user/user.types';

const guardianValidationSchema = z.object({
	fatherName: z.string(),
	fatherOccupation: z.string(),
	fatherContactNo: z.string(),
	motherName: z.string(),
	motherOccupation: z.string(),
	motherContactNo: z.string(),
});

const localGuardianValidationSchema = z.object({
	name: z.string(),
	occupation: z.string(),
	contactNo: z.string(),
	address: z.string(),
});

export const creationSchema = z.object({
	password: z.string().max(20).optional(),
	student: z.object({
		name: userNameValidation,
		gender: z.enum(genders as [TGender, ...TGender[]]),
		dateOfBirth: z.string().optional(),
		email: z.string().email(),
		contactNo: z.string(),
		emergencyContactNo: z.string(),
		bloodGroup: z.enum(bloodGroups as [TBloodGroup, ...TBloodGroup[]]),
		presentAddress: z.string(),
		permanentAddress: z.string(),
		guardian: guardianValidationSchema,
		localGuardian: localGuardianValidationSchema,
		admissionSemester: z.string(),
		academicDepartment: z.string(),
		profileImg: z.string(),
	}),
});

const updateSchema = createPartialSchema(creationSchema);

export const studentValidations = {
	creationSchema,
	updateSchema,
};
