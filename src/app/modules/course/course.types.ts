import type { Types } from 'mongoose';

export type TPreRequisiteCourses = {
	course: Types.ObjectId;
	isDeleted: boolean;
};

export type TCourse = {
	title: string;
	prefix: string;
	code: number;
	credits: number;
	isDeleted?: boolean;
	preRequisiteCourses: [TPreRequisiteCourses]; // ! Problem in this logic of array type
};

export type TCourseTeacher = {
	course: Types.ObjectId;
	teachers: [Types.ObjectId]; // ! Problem in this logic of array type
};
