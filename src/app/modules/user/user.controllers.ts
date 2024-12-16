import { userServices } from './user.services';
import sendResponse from '../../utilities/sendResponse';
import catchAsync from '../../utilities/catchAsync';

const createStudent = catchAsync(async (req, res) => {
	const { password, student } = req.body;

	const newStudent = await userServices.saveStudentInDB(password, student);

	sendResponse(res, 201, 'Student is created successfully!', newStudent);
});

const createAdmin = catchAsync(async (req, res) => {
	const { password, admin } = req.body;

	const newAdmin = await userServices.saveAdminInDB(password, admin);

	sendResponse(res, 201, 'Student is created successfully!', newAdmin);
});

const createTeacher = catchAsync(async (req, res) => {
	const { password, teacher } = req.body;

	const newTeacher = await userServices.saveTeacherInDB(password, teacher);

	sendResponse(res, 201, 'Student is created successfully!', newTeacher);
});

export const userControllers = { createStudent, createAdmin, createTeacher };
