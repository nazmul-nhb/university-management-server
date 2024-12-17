import type { Model } from 'mongoose';
import type { USER_ROLE } from './user.constants';

export type TUser = {
	id: string;
	password: string;
	needsPasswordChange: boolean;
	passwordChangedAt?: Date;
	role: 'admin' | 'student' | 'teacher';
	status: 'in-progress' | 'blocked';
	isDeleted: boolean;
};

export type TUserName = {
	firstName: string;
	middleName: string;
	lastName: string;
};

export type TGender = 'male' | 'female' | 'other';

export type TBloodGroup =
	| 'A+'
	| 'A-'
	| 'B+'
	| 'B-'
	| 'AB+'
	| 'AB-'
	| 'O+'
	| 'O-';

export interface UserModel extends Model<TUser> {
	checkUserExistenceByCustomId(id: string): Promise<TUser>;

	isPasswordMatched(
		rawPassword: string,
		hashedPassword: string,
	): Promise<boolean>;

	isJWTIssuedBeforePasswordChanged(
		passwordChangeTimestamp: Date,
		jwtIssuedTimestamp: number,
	): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
