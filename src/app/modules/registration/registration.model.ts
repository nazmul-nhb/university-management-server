import { Schema, model } from 'mongoose';
import { registrationStatus } from './registration.constants';
import type { TRegistration } from './registration.types';

const registrationSchema = new Schema<TRegistration>(
	{
		academicSemester: {
			type: Schema.Types.ObjectId,
			required: true,
			unique: true,
			ref: 'Semester',
		},
		status: {
			type: String,
			enum: registrationStatus,
			default: 'UPCOMING',
		},
		startDate: {
			type: String,
			required: true,
		},
		endDate: {
			type: String,
			required: true,
		},
		minCredit: {
			type: Number,
			default: 3,
		},
		maxCredit: {
			type: Number,
			default: 15,
		},
	},
	{
		timestamps: true,
	},
);

export const Registration = model<TRegistration>(
	'Registration',
	registrationSchema,
);
