import type { RequestHandler } from 'express';
import { userServices } from './user.services';
import sendResponse from '../../utilities/sendResponse';
import catchAsync from '../../utilities/catchAsync';

const createStudent: RequestHandler = catchAsync(async (req, res, _next) => {
	const { password, student: studentData } = req.body;

	const newStudent = await userServices.saveStudentIntoDB(
		password,
		studentData,
	);

	sendResponse(
		res,
		201,
		true,
		'Student is created successfully!',
		newStudent,
	);
});

export const userControllers = {
	createStudent,
};
