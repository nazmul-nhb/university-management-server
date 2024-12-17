export type TCollection =
	| 'N/A'
	| 'User'
	| 'Student'
	| 'Teacher'
	| 'Admin'
	| 'Course'
	| 'Department'
	| 'Faculty'
	| 'Registration'
	| 'Semester';

export type TOperation = 'create' | 'get' | 'update' | 'delete';

export type TResponseDetails = { message: string; statusCode: number };
