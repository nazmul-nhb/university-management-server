import { Schema, model } from 'mongoose';
import type { TOfferedCourse } from './offeredCourse.types';
import { Days } from './offeredCourse.constants';

const offeredCourseSchema = new Schema<TOfferedCourse>(
	{
		semesterRegistration: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Registration',
		},
		academicSemester: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Semester',
		},
		academicFaculty: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Faculty',
		},
		academicDepartment: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Department',
		},
		course: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Course',
		},
		teacher: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Teacher',
		},
		maxCapacity: {
			type: Number,
			required: true,
		},
		section: {
			type: Number,
			required: true,
		},
		days: [
			{
				type: String,
				enum: Days,
			},
		],
		startTime: {
			type: String,
			required: true,
		},
		endTime: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export const OfferedCourse = model<TOfferedCourse>(
	'OfferedCourse',
	offeredCourseSchema,
);
