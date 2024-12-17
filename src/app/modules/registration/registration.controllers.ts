import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { registrationServices } from './registration.services';

const createRegistration = catchAsync(async (req, res) => {
	const result = await registrationServices.saveRegistrationInDB(req.body);

	sendResponse(res, 'Registration', 'create', result);
});

const getAllRegistrations = catchAsync(async (req, res) => {
	const result = await registrationServices.getAllRegistrationsFromDB(
		req.query,
	);

	sendResponse(res, 'Registration', 'get', result);
});

const getSingleRegistration = catchAsync(async (req, res) => {
	const result = await registrationServices.getSingleRegistrationsFromDB(
		req.params.id,
	);

	sendResponse(res, 'Registration', 'get', result);
});

const updateRegistration = catchAsync(async (req, res) => {
	const result = await registrationServices.updateRegistrationIntoDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 'Registration', 'update', result);
});

// const deleteRegistration = catchAsync(async (req, res) => {
// 	const result = await registrationServices.deleteRegistrationFromDB(
// 		req.params.id,
// 	);

// 	sendResponse(res, 'Registration', 'delete', result);
// });

export const registrationControllers = {
	createRegistration,
	getAllRegistrations,
	getSingleRegistration,
	updateRegistration,
	// deleteRegistration,
};
