import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { departmentServices } from './department.services';

const createDepartment = catchAsync(async (req, res) => {
	const result = await departmentServices.saveDepartmentInDB(req.body);

	sendResponse(res, 'Department', 'create', result);
});

const getAllDepartments = catchAsync(async (_req, res) => {
	const result = await departmentServices.getAllDepartmentsFromDB();

	sendResponse(res, 'Department', 'get', result);
});

const getSingleDepartment = catchAsync(async (req, res) => {
	const result = await departmentServices.getSingleDepartmentFromDB(
		req.params.id,
	);

	sendResponse(res, 'Department', 'get', result);
});

const updateDepartment = catchAsync(async (req, res) => {
	const result = await departmentServices.updateDepartmentInDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 'Department', 'update', result);
});

export const departmentControllers = {
	createDepartment,
	getAllDepartments,
	getSingleDepartment,
	updateDepartment,
};
