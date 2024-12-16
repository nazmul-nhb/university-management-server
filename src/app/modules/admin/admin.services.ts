import mongoose from 'mongoose';
import { QueryBuilder } from '../../classes/QueryBuilder';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { userSearchableFields } from '../user/user.constants';
import { User } from '../user/user.model';
import type { TAdmin } from './admin.types';
import { Admin } from './admin.model';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
	const adminQuery = new QueryBuilder(Admin.find(), query)
		.search(userSearchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();

	const result = await adminQuery.modelQuery;
	return result;
};

const getSingleAdminFromDB = async (id: string) => {
	const result = await Admin.findById(id);
	return result;
};

const updateAdminInDB = async (id: string, payload: Partial<TAdmin>) => {
	const { name, ...remainingAdminData } = payload;

	const modifiedUpdatedData: Record<string, unknown> = {
		...remainingAdminData,
	};

	if (name && Object.keys(name).length) {
		for (const [key, value] of Object.entries(name)) {
			modifiedUpdatedData[`name.${key}`] = value;
		}
	}

	const result = await Admin.findByIdAndUpdate({ id }, modifiedUpdatedData, {
		new: true,
		runValidators: true,
	});
	return result;
};

const deleteAdminFromDB = async (id: string) => {
	const session = await mongoose.startSession();

	session.startTransaction();

	try {
		const deletedAdmin = await Admin.findByIdAndUpdate(
			id,
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedAdmin) {
			throw new ErrorWithStatus(
				'Delete Admin Error',
				'Failed to delete admin',
				400,
				'admin',
			);
		}

		// get user _id from deletedAdmin
		const userId = deletedAdmin.user;

		const deletedUser = await User.findOneAndUpdate(
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

		return deletedAdmin;
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}
};

export const adminServices = {
	getAllAdminsFromDB,
	getSingleAdminFromDB,
	updateAdminInDB,
	deleteAdminFromDB,
};
