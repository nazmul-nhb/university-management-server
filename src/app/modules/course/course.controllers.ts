import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { courseServices } from './course.services';

const createCourse = catchAsync(async (req, res) => {
	const result = await courseServices.saveCourseInDB(req.body);

	sendResponse(res, 201, 'Course is created successfully!', result);
});

const getAllCourses = catchAsync(async (req, res) => {
	const result = await courseServices.getAllCoursesFromDB(req.query);

	sendResponse(res, 200, 'Courses are retrieved successfully', result);
});

const getSingleCourse = catchAsync(async (req, res) => {
	const result = await courseServices.getSingleCourseFromDB(req.params.id);

	sendResponse(res, 200, 'Course is retrieved successfully!', result);
});

const updateCourse = catchAsync(async (req, res) => {
	const result = await courseServices.updateCourseInDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 200, 'Course is updated successfully!', result);
});

const deleteCourse = catchAsync(async (req, res) => {
	const result = await courseServices.deleteCourseFromDB(req.params.id);

	sendResponse(res, 200, 'Course is deleted successfully!', result);
});

const assignTeachersWithCourse = catchAsync(async (req, res) => {
	const result = await courseServices.assignTeachersWithCourseInDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 200, 'Faculties assigned successfully!', result);
});

const removeTeachersFromCourse = catchAsync(async (req, res) => {
	const result = await courseServices.removeTeachersFromCourseFromDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 200, 'Faculties removed  successfully!', result);
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
