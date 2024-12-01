import sendResponse from '../../utilities/sendResponse';
import catchAsync from '../../utilities/catchAsync';
import { semesterServices } from './semester.services';

const createSemester = catchAsync(async (req, res) => {

	const newSemester = await semesterServices.saveSemesterIntoDB(req.body);

	sendResponse(
		res,
		201,
		true,
		'Academic semester is created successfully!',
		newSemester,
	);
});

export const semesterControllers = {
	createSemester,
};
