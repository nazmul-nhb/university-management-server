import { Student } from './student.model';
import type { TStudent } from './student.types';

const getAllStudentsFromDB = async () => {
	const result = await Student.find()
		.populate('admissionSemester')
		.populate({
			path: 'academicDepartment',
			populate: { path: 'academicFaculty' },
		});

	return result;
};

const getSingleStudentFromDB = async (id: string) => {
	const result = await Student.findById(id);
	return result;
};

const updateStudentInDB = async (id: string, payload: Partial<TStudent>) => {
	const result = await Student.findOneAndUpdate({ _id: id }, payload, {
		new: true,
	});

	return result;
};

export const studentServices = {
	getAllStudentsFromDB,
	getSingleStudentFromDB,
	updateStudentInDB,
};
