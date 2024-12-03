import { Schema, model } from 'mongoose';
import type { TFaculty } from './faculty.types';

const facultySchema = new Schema<TFaculty>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const Faculty = model<TFaculty>('Faculty', facultySchema);
