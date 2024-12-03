import { Faculty } from './faculty.model';
import type { TFaculty } from './faculty.types';

const saveFacultyIntoDB = async (payload: TFaculty) => {
	const result = await Faculty.create(payload);
	return result;
};

const getAllFacultiesFromDB = async () => {
	const result = await Faculty.find();
	return result;
};

const getSingleFacultyFromDB = async (id: string) => {
	const result = await Faculty.findById(id);
	return result;
};

const updateFacultyInDB = async (id: string, payload: Partial<TFaculty>) => {
	const result = await Faculty.findOneAndUpdate({ _id: id }, payload, {
		new: true,
	});
	return result;
};

export const facultyServices = {
	saveFacultyIntoDB,
	getAllFacultiesFromDB,
	getSingleFacultyFromDB,
	updateFacultyInDB,
};
