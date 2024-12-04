import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { studentServices } from './student.services';

const getAllStudents = catchAsync(async (_req, res) => {
	const students = await studentServices.getAllStudentsFromDB();

	sendResponse(res, 200, 'Students are retrieved successfully', students);
});

const getSingleStudent = catchAsync(async (req, res) => {
	const student = await studentServices.getSingleStudentFromDB(req.params.id);

	if (!student) {
		throw new ErrorWithStatus(
			'StudentNotFound',
			`Student with id: ${req.params.id} not found!`,
			404,
		);
	}

	sendResponse(res, 200, 'Student is retrieved successfully', student);
});

const updateStudent = catchAsync(async (req, res) => {
	const student = await studentServices.updateStudentInDB(
		req.params.id,
		req.body,
	);

	if (!student) {
		throw new ErrorWithStatus(
			'StudentNotUpdatable',
			`Student with id: ${req.params.id} not found!`,
			404,
		);
	}

	sendResponse(res, 200, 'Student is updated successfully', student);
});

const deleteStudent = catchAsync(async (req, res) => {
	const result = await studentServices.deleteStudentFromDB(req.params.id);

	sendResponse(res, 200, 'Student is deleted successfully', result);
});

export const studentControllers = {
	getAllStudents,
	getSingleStudent,
	updateStudent,
	deleteStudent,
};
