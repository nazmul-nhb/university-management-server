import { z } from 'zod';
import { months, semesterCodes, semesterNames } from './semester.constants';
import type { TMonth, TSemesterCode, TSemesterName } from './semester.types';

const creationSchema = z.object({
	name: z.enum(semesterNames as [TSemesterName, ...TSemesterName[]]),
	year: z.string().length(4, 'Year must be 4 digits!'),
	code: z.enum(semesterCodes as [TSemesterCode, ...TSemesterCode[]]),
	startMonth: z.enum(months as [TMonth, ...TMonth[]]),
	endMonth: z.enum(months as [TMonth, ...TMonth[]]),
});

const updateSchema = creationSchema.partial();

export const semesterValidations = {
	creationSchema,
	updateSchema,
};
