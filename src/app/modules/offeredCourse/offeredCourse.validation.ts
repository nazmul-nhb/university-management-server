import { z } from 'zod';
import { Days } from './offeredCourse.constants';
import type { TDays } from './offeredCourse.types';
import { createPartialSchema } from '../../utilities/partialSchema';

const timeStringSchema = z
	.string()
	.refine((time) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
		message: 'Invalid time format, expected "HH:MM" in 24 hours format',
	});

const isValidTime = (start: string, end: string) => {
	// startTime : 10:30  => 1970-01-01T10:30
	// endTime : 12:30  =>  1970-01-01T12:30
	const startTime = new Date(`1970-01-01T${start}:00`);
	const endTime = new Date(`1970-01-01T${end}:00`);
	return endTime > startTime;
};

const primarySchema = z.object({
	semesterRegistration: z.string(),
	academicFaculty: z.string(),
	academicDepartment: z.string(),
	course: z.string(),
	faculty: z.string(),
	section: z.number(),
	maxCapacity: z.number(),
	days: z.array(z.enum([...Days] as [TDays, ...TDays[]])),
	startTime: timeStringSchema, // HH: MM   00-23: 00-59
	endTime: timeStringSchema,
});

const creationSchema = primarySchema.refine(
	({ startTime, endTime }) => isValidTime(startTime, endTime),
	{ message: 'End time cannot be earlier than start time!' },
);

const updateSchema = createPartialSchema(primarySchema).refine(
	({ startTime, endTime }) => isValidTime(startTime, endTime),
	{ message: 'End time cannot be earlier than start time!' },
);

export const offeredCourseValidations = {
	creationSchema,
	updateSchema,
};
