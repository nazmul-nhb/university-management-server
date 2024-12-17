import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { offeredCourseServices } from './offeredCourse.services';

const createOfferedCourse = catchAsync(async (req, res) => {
	const result = await offeredCourseServices.saveOfferedCourseInDB(req.body);

	sendResponse(
		res,
		'Offered course',
		'create',
		result,
		'Successfully offered course!',
	);
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
	const result = await offeredCourseServices.getAllOfferedCoursesFromDB(
		req.query,
	);

	sendResponse(res, 'Offered course', 'get', result);
});

const getSingleOfferedCourses = catchAsync(async (req, res) => {
	const result = await offeredCourseServices.getSingleOfferedCourseFromDB(
		req.params.id,
	);

	sendResponse(res, 'Offered course', 'get', result);
});

const updateOfferedCourse = catchAsync(async (req, res) => {
	const result = await offeredCourseServices.updateOfferedCourseInDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 'Offered course', 'update', result);
});

const deleteOfferedCourseFromDB = catchAsync(async (req, res) => {
	const result = await offeredCourseServices.deleteOfferedCourseFromDB(
		req.params.id,
	);

	sendResponse(res, 'Offered course', 'get', result);
});

export const offeredCourseControllers = {
	createOfferedCourse,
	getAllOfferedCourses,
	getSingleOfferedCourses,
	updateOfferedCourse,
	deleteOfferedCourseFromDB,
};
