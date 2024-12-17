import sendResponse from '../../utilities/sendResponse';
import catchAsync from '../../utilities/catchAsync';
import { semesterServices } from './semester.services';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';

const createSemester = catchAsync(async (req, res) => {
	const newSemester = await semesterServices.saveSemesterIntoDB(req.body);

	sendResponse(res, 'Semester', 'get', newSemester);
});

const getAllSemesters = catchAsync(async (_req, res) => {
	const semesters = await semesterServices.getAllSemestersFromDB();

	sendResponse(res, 'Semester', 'get', semesters);
});

const getSingleSemester = catchAsync(async (req, res) => {
	const semester = await semesterServices.getSingleSemesterFromDB(
		req.params.id,
	);

	if (!semester) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Semester with id: ${req.params.id} not found!`,
			404,
			'semester',
		);
	}

	sendResponse(res, 'Semester', 'get', semester);
});

const updateSemester = catchAsync(async (req, res) => {
	const semester = await semesterServices.updateSemesterInDB(
		req.params.id,
		req.body,
	);

	if (!semester) {
		throw new ErrorWithStatus(
			'Not Updatable Error',
			`Semester with id: ${req.params.id} not found!`,
			404,
			'semester',
		);
	}

	sendResponse(res, 'Semester', 'update', semester);
});

export const semesterControllers = {
	createSemester,
	getAllSemesters,
	getSingleSemester,
	updateSemester,
};
