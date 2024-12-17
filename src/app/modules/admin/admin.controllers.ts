import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { adminServices } from './admin.services';

const getSingleAdmin = catchAsync(async (req, res) => {
	const result = await adminServices.getSingleAdminFromDB(req.params.id);

	sendResponse(res, 'Admin', 'get', result);
});

const getAllAdmins = catchAsync(async (req, res) => {
	const result = await adminServices.getAllAdminsFromDB(req.query);

	sendResponse(res, 'Admin', 'get', result);
});

const updateAdmin = catchAsync(async (req, res) => {
	const result = await adminServices.updateAdminInDB(req.params.id, req.body);

	sendResponse(res, 'Admin', 'update', result);
});

const deleteAdmin = catchAsync(async (req, res) => {
	const result = await adminServices.deleteAdminFromDB(req.params.id);

	sendResponse(res, 'Admin', 'delete', result);
});

export const adminControllers = {
	getAllAdmins,
	getSingleAdmin,
	deleteAdmin,
	updateAdmin,
};
