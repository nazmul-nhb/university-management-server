import { Department } from './department.model';
import type { TDepartment } from './department.types';

const saveDepartmentInDB = async (payload: TDepartment) => {
	const result = await Department.create(payload);
	return result;
};

const getAllDepartmentsFromDB = async () => {
	const result = await Department.find().populate('academicFaculty');
	return result;
};

const getSingleDepartmentFromDB = async (id: string) => {
	const result = await Department.findById(id).populate('academicFaculty');
	return result;
};

const updateDepartmentInDB = async (
	id: string,
	payload: Partial<TDepartment>,
) => {
	const result = await Department.findOneAndUpdate({ _id: id }, payload, {
		new: true,
	});
	return result;
};

export const departmentServices = {
	saveDepartmentInDB,
	getAllDepartmentsFromDB,
	getSingleDepartmentFromDB,
	updateDepartmentInDB,
};
