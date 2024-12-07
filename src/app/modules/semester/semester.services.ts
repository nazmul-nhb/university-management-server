import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { semesterNameCodeMapper } from './semester.constants';
import { Semester } from './semester.model';
import type { TSemester } from './semester.types';

const saveSemesterIntoDB = async (payload: TSemester) => {
	// Check semester name-code combination
	if (semesterNameCodeMapper[payload.name] !== payload.code) {
		throw new ErrorWithStatus(
			'Invalid Match Error',
			'Invalid Semester Code!',
			422,
			'semester',
		);
	}

	// Create a semester
	const newSemester = await Semester.create(payload);

	return newSemester;
};

const getAllSemestersFromDB = async () => {
	const result = await Semester.find();
	return result;
};

const getSingleSemesterFromDB = async (id: string) => {
	const result = await Semester.findById(id);
	return result;
};

const updateSemesterInDB = async (id: string, payload: Partial<TSemester>) => {
	if (
		payload.name &&
		payload.code &&
		semesterNameCodeMapper[payload.name] !== payload.code
	) {
		throw new ErrorWithStatus(
			'Invalid Match Error',
			'Invalid Semester Code!',
			422,
			'semester',
		);
	}

	const result = await Semester.findOneAndUpdate({ _id: id }, payload, {
		new: true,
	});
	return result;
};

export const semesterServices = {
	saveSemesterIntoDB,
	getAllSemestersFromDB,
	getSingleSemesterFromDB,
	updateSemesterInDB,
};
