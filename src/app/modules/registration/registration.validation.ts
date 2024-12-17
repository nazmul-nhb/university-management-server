import { z } from 'zod';
import { registrationStatus } from './registration.constants';
import { createPartialSchema } from '../../utilities/partialSchema';

const creationSchema = z.object({
	academicSemester: z.string(),
	status: z.enum([...(registrationStatus as [string, ...string[]])]),
	startDate: z.string().datetime(),
	endDate: z.string().datetime(),
	minCredit: z.number(),
	maxCredit: z.number(),
});

const updateSchema = createPartialSchema(creationSchema);

export const registrationValidations = { creationSchema, updateSchema };
