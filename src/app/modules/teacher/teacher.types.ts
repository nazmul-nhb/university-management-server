import type { Model, Types } from 'mongoose';
import type { TBloodGroup, TGender } from '../user/user.types';
import type { TUserName } from '../user/user.types';

export type TTeacher = {
	id: string;
	user: Types.ObjectId;
	designation: string;
	name: TUserName;
	gender: TGender;
	dateOfBirth?: Date;
	email: string;
	contactNo: string;
	emergencyContactNo: string;
	bloodGroup?: TBloodGroup;
	presentAddress: string;
	permanentAddress: string;
	profileImg?: string;
	academicDepartment: Types.ObjectId;
	isDeleted: boolean;
};

export interface TeacherModel extends Model<TTeacher> {
	isUserExists(id: string): Promise<TTeacher | null>;
}
