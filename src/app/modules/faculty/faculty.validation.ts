import { z } from 'zod';

const creationSchema = z.object({
	name: z.string({ message: 'Name for faculty is required!' }).min(2),
});

export const facultyValidation = { creationSchema };
