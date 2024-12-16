import type { TBloodGroup, TGender } from './user.types';

export const genders: TGender[] = ['male', 'female', 'other'];

export const bloodGroups: TBloodGroup[] = [
	'A+',
	'A-',
	'B+',
	'B-',
	'AB+',
	'AB-',
	'O+',
	'O-',
];

export const userSearchableFields = [
	'email',
	'id',
	'contactNo',
	'emergencyContactNo',
	'name.firstName',
	'name.lastName',
	'name.middleName',
];
