import { startSession } from 'mongoose';
import { Student } from './student.model';
import type { TStudent } from './student.types';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { User } from '../user/user.model';

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
	const result = await Student.findById(id) // TODO: Find by generated ID
		.populate('admissionSemester')
		.populate({
			path: 'academicDepartment',
			populate: { path: 'academicFaculty' },
		});

	return result;
};

const updateStudentInDB = async (id: string, payload: Partial<TStudent>) => {
	const result = await Student.findOneAndUpdate({ _id: id }, payload, {
		new: true,
		upsert: true,
	});

	return result;
};

/**
 *
 * @param id `user` id that is linked with user
 */
const deleteStudentFromDB = async (id: string) => {
	const session = await startSession();

	// * Should start session outside try-catch block
	session.startTransaction();

	try {
		const deletedStudent = await Student.findOneAndUpdate(
			{ user: id },
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedStudent) {
			throw new ErrorWithStatus(
				'CannotDelete',
				'Failed to delete student!',
				400,
			);
		}

		const deletedUser = await User.findOneAndUpdate(
			{ _id: id },
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedUser) {
			throw new ErrorWithStatus(
				'CannotDelete',
				'Failed to delete user!',
				400,
			);
		}

		await session.commitTransaction();
		await session.endSession();

		return deletedStudent;
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}
};

export const studentServices = {
	getAllStudentsFromDB,
	getSingleStudentFromDB,
	updateStudentInDB,
	deleteStudentFromDB,
};
