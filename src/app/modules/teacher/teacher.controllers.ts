import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { teacherServices } from './teacher.services';

const getSingleTeacher = catchAsync(async (req, res) => {
	const result = await teacherServices.getSingleTeacherFromDB(req.params.id);

	sendResponse(res, 'Teacher', 'get', result);
});

const getAllTeachers = catchAsync(async (req, res) => {
	const result = await teacherServices.getAllTeachersFromDB(req.query);

	sendResponse(res, 'Teacher', 'get', result);
});

const updateTeacher = catchAsync(async (req, res) => {
	const result = await teacherServices.updateTeacherInDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 'Teacher', 'update', result);
});

const deleteTeacher = catchAsync(async (req, res) => {
	const result = await teacherServices.deleteTeacherFromDB(req.params.id);

	sendResponse(res, 'Teacher', 'delete', result);
});

export const teacherControllers = {
	getAllTeachers,
	getSingleTeacher,
	deleteTeacher,
	updateTeacher,
};
