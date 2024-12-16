import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { teacherServices } from './teacher.services';

const getSingleTeacher = catchAsync(async (req, res) => {
	const result = await teacherServices.getSingleTeacherFromDB(req.params.id);

	sendResponse(res, 200, 'Teacher is retrieved successfully!', result);
});

const getAllTeachers = catchAsync(async (req, res) => {
	const result = await teacherServices.getAllTeachersFromDB(req.query);

	sendResponse(res, 200, 'Teachers are retrieved successfully!', result);
});

const updateTeacher = catchAsync(async (req, res) => {
	const result = await teacherServices.updateTeacherInDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 200, 'Teacher is updated successfully!', result);
});

const deleteTeacher = catchAsync(async (req, res) => {
	const result = await teacherServices.deleteTeacherFromDB(req.params.id);

	sendResponse(res, 200, 'Teacher is deleted successfully!', result);
});

export const teacherControllers = {
	getAllTeachers,
	getSingleTeacher,
	deleteTeacher,
	updateTeacher,
};
