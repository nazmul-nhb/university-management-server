import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { studentServices } from './student.services';

const getAllStudents = catchAsync(async (req, res) => {
	const students = await studentServices.getAllStudentsFromDB(req.query);

	sendResponse(res, 'Student', 'get', students);
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

	sendResponse(res, 'Student', 'get', student);
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

	sendResponse(res, 'Student', 'update', student);
});

const deleteStudent = catchAsync(async (req, res) => {
	const student = await studentServices.deleteStudentFromDB(req.params.id);

	sendResponse(res, 'Student', 'delete', student);
});

export const studentControllers = {
	getAllStudents,
	getSingleStudent,
	updateStudent,
	deleteStudent,
};
