import type { Model, Types } from 'mongoose';
import type { TBloodGroup, TGender } from '../../types';

export type TUserName = {
	firstName: string;
	middleName: string;
	lastName: string;
};

export type TAdmin = {
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
	isDeleted: boolean;
};

export interface AdminModel extends Model<TAdmin> {
	doesUserExist(id: string): Promise<TAdmin | null>;
}
