import sendResponse from '../../utilities/sendResponse';
import catchAsync from '../../utilities/catchAsync';
import { semesterServices } from './semester.services';

const createSemester = catchAsync(async (req, res) => {
	const newSemester = await semesterServices.saveSemesterIntoDB(req.body);

	sendResponse(
		res,
		201,
		true,
		'Academic semester is created successfully!',
		newSemester,
	);
});

const getAllSemesters = catchAsync(async (_req, res) => {
	const semesters = await semesterServices.getAllSemestersFromDB();

	sendResponse(
		res,
		200,
		true,
		'Academic semesters are retrieved successfully',
		semesters,
	);
});

const getSingleSemester = catchAsync(async (req, res) => {
	const semester = await semesterServices.getSingleSemesterFromDB(
		req.params.id,
	);

	sendResponse(
		res,
		200,
		true,
		'Academic semester is retrieved successfully',
		semester,
	);
});

const updateSemester = catchAsync(async (req, res) => {
	const semester = await semesterServices.updateSemesterInDB(
		req.params.id,
		req.body,
	);
	sendResponse(
		res,
		200,
		true,
		'Academic semester is updated successfully',
		semester,
	);
});

export const semesterControllers = {
	createSemester,
	getAllSemesters,
	getSingleSemester,
	updateSemester,
};
