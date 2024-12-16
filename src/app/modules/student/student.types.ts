import type { Model, Types } from 'mongoose';
import type { TBloodGroup, TGender, TUserName } from '../user/user.types';

export type TGuardian = {
	fatherName: string;
	fatherOccupation: string;
	fatherContactNo: string;
	motherName: string;
	motherOccupation: string;
	motherContactNo: string;
};

export type TLocalGuardian = {
	name: string;
	occupation: string;
	contactNo: string;
	address: string;
};

export type TStudent = {
	id: string;
	user: Types.ObjectId;
	name: TUserName;
	gender: TGender;
	dateOfBirth?: Date;
	email: string;
	contactNo: string;
	emergencyContactNo: string;
	bloodGroup?: TBloodGroup;
	presentAddress: string;
	permanentAddress: string;
	guardian: TGuardian;
	localGuardian: TLocalGuardian;
	profileImg?: string;
	academicDepartment: Types.ObjectId;
	admissionSemester: Types.ObjectId;
	isDeleted: boolean;
};

//for creating static

export interface StudentModel extends Model<TStudent> {
	doesUserExist(id: string): Promise<TStudent | null>;
}

export interface StudentModel extends Model<TStudent> {
	countByDept(semesterId: string, departmentId: string): Promise<number>;
}
