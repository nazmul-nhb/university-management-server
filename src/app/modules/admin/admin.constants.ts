import type { TBloodGroup, TGender } from "../../types";

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

export const adminSearchableFields = [
	'email',
	'id',
	'contactNo',
	'emergencyContactNo',
	'name.firstName',
	'name.lastName',
	'name.middleName',
];
