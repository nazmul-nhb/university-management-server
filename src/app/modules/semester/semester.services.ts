import { Semester } from './semester.model';
import type { TSemester } from './semester.types';

const saveSemesterIntoDB = async (payload: TSemester) => {
	// create a semester
	const newSemester = await Semester.create(payload);

	return newSemester;
};

export const semesterServices = {
	saveSemesterIntoDB,
};
