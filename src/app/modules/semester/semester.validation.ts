import { z } from 'zod';
import { months, semesterCodes, semesterNames } from './semester.constants';

const creationSchema = z.object({
	name: z.enum([...semesterNames] as [string, ...string[]]),
	year: z.string().length(4, "Year must be 4 digits!"),
	code: z.enum([...semesterCodes] as [string, ...string[]]),
	startMonth: z.enum([...months] as [string, ...string[]]),
	endMonth: z.enum([...months] as [string, ...string[]]),
});

const updateSchema = creationSchema.partial();

export const semesterValidations = {
	creationSchema,
	updateSchema,
};
