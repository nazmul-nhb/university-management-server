import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { semesterNameCodeMapper } from './semester.constants';
import { Semester } from './semester.model';
import type { TSemester } from './semester.types';

const saveSemesterIntoDB = async (payload: TSemester) => {
	// Check semester name-code combination
	if (semesterNameCodeMapper[payload.name] !== payload.code) {
		throw new ErrorWithStatus(
			'InvalidSemester',
			'Invalid Semester Code!',
			422,
		);
	}

	// Create a semester
	const newSemester = await Semester.create(payload);

	return newSemester;
};

export const semesterServices = {
	saveSemesterIntoDB,
};
