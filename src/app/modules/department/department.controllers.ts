import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { departmentServices } from './department.services';

const createDepartment = catchAsync(async (req, res) => {
	const result = await departmentServices.saveDepartmentInDB(req.body);

	sendResponse(res, 201, 'Department is created successfully', result);
});

const getAllDepartments = catchAsync(async (_req, res) => {
	const result = await departmentServices.getAllDepartmentsFromDB();

	sendResponse(res, 200, 'Departments are retrieved successfully', result);
});

const getSingleDepartment = catchAsync(async (req, res) => {
	const result = await departmentServices.getSingleDepartmentFromDB(
		req.params.id,
	);

	sendResponse(res, 200, 'Department is retrieved successfully', result);
});

const updateDepartment = catchAsync(async (req, res) => {
	const result = await departmentServices.updateDepartmentInDB(
		req.params.id,
		req.body,
	);

	sendResponse(res, 200, 'Department is updated successfully', result);
});

export const departmentControllers = {
	createDepartment,
	getAllDepartments,
	getSingleDepartment,
	updateDepartment,
};
