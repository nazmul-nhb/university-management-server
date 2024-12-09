import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { studentServices } from './student.services';

const getAllStudents = catchAsync(async (req, res) => {
	const students = await studentServices.getAllStudentsFromDB(req.query);

	sendResponse(res, 200, 'Students are retrieved successfully', students);
});

const getSingleStudent = catchAsync(async (req, res) => {
	const student = await studentServices.getSingleStudentFromDB(req.params.id);

	if (!student) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Student with id: ${req.params.id} not found!`,
			404,
			'student',
		);
	}

	sendResponse(res, 200, 'Student is retrieved successfully', student);
});

const updateStudent = catchAsync(async (req, res) => {
	const student = await studentServices.updateStudentInDB(
		req.params.id,
		req.body.student,
	);

	if (!student) {
		throw new ErrorWithStatus(
			'Not Updatable Error',
			`Student with id: ${req.params.id} not found!`,
			404,
			'student',
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
