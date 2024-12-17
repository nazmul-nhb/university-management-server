import type { Types } from 'mongoose';

export type TRegistration = {
	academicSemester: Types.ObjectId;
	status: 'UPCOMING' | 'ONGOING' | 'ENDED';
	startDate: string;
	endDate: string;
	minCredit: number;
	maxCredit: number;
};
