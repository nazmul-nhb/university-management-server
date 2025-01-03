import { startSession } from 'mongoose';
import { Student } from './student.model';
import { User } from '../user/user.model';
import type { TStudent } from './student.types';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { flattenPayload } from '../../utilities/flattenPayload';
import { QueryBuilder } from '../../classes/QueryBuilder';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
	const searchableFields = ['email', 'name.firstName', 'presentAddress'];

	const studentQuery = new QueryBuilder(
		Student.find()
			.populate('admissionSemester')
			.populate({
				path: 'academicDepartment',
				populate: {
					path: 'academicFaculty',
				},
			}),
		query,
	)
		.search(searchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();

	const result = await studentQuery.modelQuery;

	return result;
};

/**
 *
 * @param id The value for `id` field in student doc
 */
const getSingleStudentFromDB = async (id: string) => {
	const result = await Student.findOne({ id })
		.populate('admissionSemester')
		.populate({
			path: 'academicDepartment',
			populate: { path: 'academicFaculty' },
		});

	return result;
};

/**
 *
 * @param id The value for `id` field in student doc
 */
const updateStudentInDB = async (id: string, payload: Partial<TStudent>) => {
	const modifiedPayload = flattenPayload(payload);

	const result = await Student.findOneAndUpdate({ id }, modifiedPayload, {
		new: true,
		runValidators: true,
	});

	return result;
};

/**
 *
 * @param id The value for `id` field in student doc
 */
const deleteStudentFromDB = async (id: string) => {
	const session = await startSession();

	// ? Should start session outside try-catch block
	session.startTransaction();

	try {
		const deletedStudent = await Student.findOneAndUpdate(
			{ id },
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedStudent) {
			throw new ErrorWithStatus(
				'Delete Error',
				'Failed to delete student!',
				400,
				'student',
			);
		}

		const deletedUser = await User.findOneAndUpdate(
			{ id },
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedUser) {
			throw new ErrorWithStatus(
				'Delete Error',
				'Failed to delete user!',
				400,
				'student',
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
