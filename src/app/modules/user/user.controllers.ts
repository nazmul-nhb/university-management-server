import { userServices } from './user.services';
import sendResponse from '../../utilities/sendResponse';
import catchAsync from '../../utilities/catchAsync';

const createStudent = catchAsync(async (req, res) => {
	const { password, student } = req.body;

	const newStudent = await userServices.saveStudentIntoDB(password, student);

	sendResponse(res, 201, 'Student is created successfully!', newStudent);
});

export const userControllers = {
	createStudent,
};
