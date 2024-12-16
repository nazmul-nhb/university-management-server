import { startSession } from 'mongoose';
import { QueryBuilder } from '../../classes/QueryBuilder';
import { Teacher } from './teacher.model';
import { userSearchableFields } from '../user/user.constants';
import type { TTeacher } from './teacher.types';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { User } from '../user/user.model';

const getAllTeachersFromDB = async (query: Record<string, unknown>) => {
	const teacherQuery = new QueryBuilder(
		Teacher.find().populate('academicDepartment'),
		query,
	)
		.search(userSearchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();

	const result = await teacherQuery.modelQuery;
	return result;
};

const getSingleTeacherFromDB = async (id: string) => {
	const result = await Teacher.findById(id).populate('academicDepartment');

	return result;
};

const updateTeacherInDB = async (id: string, payload: Partial<TTeacher>) => {
	const { name, ...remainingTeacherData } = payload;

	const modifiedUpdatedData: Record<string, unknown> = {
		...remainingTeacherData,
	};

	if (name && Object.keys(name).length) {
		for (const [key, value] of Object.entries(name)) {
			modifiedUpdatedData[`name.${key}`] = value;
		}
	}

	const result = await Teacher.findByIdAndUpdate(id, modifiedUpdatedData, {
		new: true,
		runValidators: true,
	});
	return result;
};

const deleteTeacherFromDB = async (id: string) => {
	const session = await startSession();

	session.startTransaction();

	try {
		const deletedTeacher = await Teacher.findByIdAndUpdate(
			id,
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedTeacher) {
			throw new ErrorWithStatus(
				'Delete Teacher Error',
				'Failed to delete teacher',
				400,
				'teacher',
			);
		}

		// get user _id from deletedTeacher
		const userId = deletedTeacher.user;

		const deletedUser = await User.findByIdAndUpdate(
			userId,
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedUser) {
			throw new ErrorWithStatus(
				'Delete User Error',
				'Failed to delete user',
				400,
				'user',
			);
		}

		await session.commitTransaction();
		await session.endSession();

		return deletedTeacher;
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}
};

export const teacherServices = {
	getAllTeachersFromDB,
	getSingleTeacherFromDB,
	updateTeacherInDB,
	deleteTeacherFromDB,
};
