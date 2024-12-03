import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { facultyServices } from './faculty.services';

const createFaculty = catchAsync(async (req, res) => {
	const result = await facultyServices.saveFacultyIntoDB(req.body);

	sendResponse(res, 201, 'Faculty is created successfully', result);
});

const getAllFaculties = catchAsync(async (_req, res) => {
	const result = await facultyServices.getAllFacultiesFromDB();

	sendResponse(res, 200, 'Faculties are retrieved successfully', result);
});

const getSingleFaculty = catchAsync(async (req, res) => {
	const result = await facultyServices.getSingleFacultyFromDB(req.params.id);

	sendResponse(res, 200, 'Faculty is retrieved successfully', result);
});

const updateFaculty = catchAsync(async (req, res) => {
	const result = await facultyServices.updateFacultyInDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 200, 'Faculty is updated successfully', result);
});

export const facultyControllers = {
	createFaculty,
	getAllFaculties,
	getSingleFaculty,
	updateFaculty,
};
