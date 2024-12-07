import { Schema, model } from 'mongoose';
import type { TFaculty } from './faculty.types';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';

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

facultySchema.pre('findOneAndUpdate', async function (next) {
	const query = this.getQuery();
	const facultyExists = await Faculty.findOne(query);

	if (!facultyExists) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`'This faculty does not exist!'`,
			404,
			'faculty',
		);
	}

	next();
});

export const Faculty = model<TFaculty>('Faculty', facultySchema);
