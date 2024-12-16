export type TUser = {
	id: string;
	password: string;
	needsPasswordChange: boolean;
	role: 'admin' | 'student' | 'faculty';
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
