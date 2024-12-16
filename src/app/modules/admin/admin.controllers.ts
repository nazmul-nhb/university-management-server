import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { adminServices } from './admin.services';

const getSingleAdmin = catchAsync(async (req, res) => {
	const result = await adminServices.getSingleAdminFromDB(req.params.id);

	sendResponse(res, 200, 'Admin is retrieved successfully!', result);
});

const getAllAdmins = catchAsync(async (req, res) => {
	const result = await adminServices.getAllAdminsFromDB(req.query);

	sendResponse(res, 200, 'Admins are retrieved successfully!', result);
});

const updateAdmin = catchAsync(async (req, res) => {
	const result = await adminServices.updateAdminInDB(req.params.id, req.body);

	sendResponse(res, 200, 'Admin is updated successfully!', result);
});

const deleteAdmin = catchAsync(async (req, res) => {
	const result = await adminServices.deleteAdminFromDB(req.params.id);

	sendResponse(res, 200, 'Admin is deleted successfully!', result);
});

export const adminControllers = {
	getAllAdmins,
	getSingleAdmin,
	deleteAdmin,
	updateAdmin,
};
