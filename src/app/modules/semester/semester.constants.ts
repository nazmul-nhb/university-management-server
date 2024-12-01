import type {
	TMonth,
	TSemesterCode,
	TSemesterName,
	TSemesterNameCodeMapper,
} from './semester.types';

export const months: TMonth[] = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export const semesterNames: TSemesterName[] = ['Autumn', 'Summer', 'Fall'];

export const semesterCodes: TSemesterCode[] = ['01', '02', '03'];

export const semesterNameCodeMapper: TSemesterNameCodeMapper = {
	Autumn: '01',
	Summer: '02',
	Fall: '03',
};
