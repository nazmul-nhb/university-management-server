import { z } from 'zod';
import { createPartialSchema } from '../../utilities/partialSchema';

const preRequisiteCourseCreation = z.object({
	course: z.string(),
	isDeleted: z.boolean().optional(),
});

const creationSchema = z.object({
	title: z.string(),
	prefix: z.string(),
	code: z.number(),
	credits: z.number(),
	preRequisiteCourses: z.array(preRequisiteCourseCreation).optional(),
	isDeleted: z.boolean().optional(),
});

const updateSchema = createPartialSchema(creationSchema);

const courseTeacherSchema = z.object({
	teachers: z.array(z.string()),
});

export const courseValidations = {
	creationSchema,
	updateSchema,
	courseTeacherSchema,
};
