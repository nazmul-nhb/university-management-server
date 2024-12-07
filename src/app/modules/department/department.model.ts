import { Schema, model } from 'mongoose';
import type { TDepartment } from './department.types';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';

const departmentSchema = new Schema<TDepartment>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		code: {
			type: String,
			required: true,
			uppercase: true,
			unique: true,
		},
		academicFaculty: {
			type: Schema.Types.ObjectId,
			ref: 'Faculty',
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

departmentSchema.pre('save', async function (next) {
	const departmentExists = await Department.findOne({
		name: this.name,
	});

	if (departmentExists) {
		throw new ErrorWithStatus(
			'Duplicate Error',
			`${this.name} already exists!`,
			409,
			'department',
		);
	}

	next();
});

departmentSchema.pre('findOneAndUpdate', async function (next) {
	const query = this.getQuery();
	const departmentExists = await Department.findOne(query);

	if (!departmentExists) {
		throw new ErrorWithStatus(
			'Not Found Error',
			'This department does not exist!',
			404,
			'department',
		);
	}

	next();
});

export const Department = model<TDepartment>('Department', departmentSchema);
