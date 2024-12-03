import type { Types } from 'mongoose';

export type TDepartment = {
	name: string;
	academicFaculty: Types.ObjectId;
};
