import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { facultyServices } from './faculty.services';

const createFaculty = catchAsync(async (req, res) => {
	const result = await facultyServices.saveFacultyIntoDB(req.body);

	sendResponse(res, 'Faculty', 'create', result);
});

const getAllFaculties = catchAsync(async (_req, res) => {
	const result = await facultyServices.getAllFacultiesFromDB();

	sendResponse(res, 'Faculty', 'get', result);
});

const getSingleFaculty = catchAsync(async (req, res) => {
	const result = await facultyServices.getSingleFacultyFromDB(req.params.id);

	sendResponse(res, 'Faculty', 'get', result);
});

const updateFaculty = catchAsync(async (req, res) => {
	const result = await facultyServices.updateFacultyInDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 'Faculty', 'update', result);
});

export const facultyControllers = {
	createFaculty,
	getAllFaculties,
	getSingleFaculty,
	updateFaculty,
};
