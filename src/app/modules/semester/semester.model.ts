import { Schema, model } from 'mongoose';
import type { TSemester } from './semester.types';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { months, semesterCodes, semesterNames } from './semester.constants';

const semesterSchema = new Schema<TSemester>(
	{
		name: {
			type: String,
			required: true,
			enum: semesterNames,
		},
		year: {
			type: String,
			required: true,
		},
		code: {
			type: String,
			required: true,
			enum: semesterCodes,
		},
		startMonth: {
			type: String,
			required: true,
			enum: months,
		},
		endMonth: {
			type: String,
			required: true,
			enum: months,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

semesterSchema.pre('save', async function (next) {
	const semesterExists = await Semester.findOne({
		year: this.year,
		name: this.name,
	});

	if (semesterExists) {
		throw new ErrorWithStatus(
			'SemesterExists',
			`${this.name} Semester Already Exists for Year ${this.year}!`,
			409,
		);
	}

	next();
});

semesterSchema.pre('findOneAndUpdate', async function (next) {
	const query = this.getQuery();
	const semesterExists = await Semester.findOne(query);

	if (!semesterExists) {
		throw new ErrorWithStatus(
			'SemesterNotFound',
			`'This semester does not exist!'`,
			404,
		);
	}

	next();
});

export const Semester = model<TSemester>('Semester', semesterSchema);
