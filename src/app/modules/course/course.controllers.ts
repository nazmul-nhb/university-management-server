import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { courseServices } from './course.services';

const createCourse = catchAsync(async (req, res) => {
	const result = await courseServices.saveCourseInDB(req.body);

	sendResponse(res, 'Course', 'create', result);
});

const getAllCourses = catchAsync(async (req, res) => {
	const result = await courseServices.getAllCoursesFromDB(req.query);

	sendResponse(res, 'Course', 'get', result);
});

const getSingleCourse = catchAsync(async (req, res) => {
	const result = await courseServices.getSingleCourseFromDB(req.params.id);

	sendResponse(res, 'Course', 'get', result);
});

const updateCourse = catchAsync(async (req, res) => {
	const result = await courseServices.updateCourseInDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 'Course', 'update', result);
});

const deleteCourse = catchAsync(async (req, res) => {
	const result = await courseServices.deleteCourseFromDB(req.params.id);

	sendResponse(res, 'Course', 'delete', result);
});

const assignTeachersWithCourse = catchAsync(async (req, res) => {
	const result = await courseServices.assignTeachersWithCourseInDB(
		req.params.id,
		req.body,
	);

	sendResponse(
		res,
		'Course',
		'update',
		result,
		'Teachers assigned successfully!',
	);
});

const removeTeachersFromCourse = catchAsync(async (req, res) => {
	const result = await courseServices.removeTeachersFromCourseFromDB(
		req.params.id,
		req.body,
	);

	sendResponse(
		res,
		'Course',
		'update',
		result,
		'Teachers removed successfully!',
	);
});

export const courseControllers = {
	createCourse,
	getSingleCourse,
	getAllCourses,
	updateCourse,
	deleteCourse,
	assignTeachersWithCourse,
	removeTeachersFromCourse,
};
