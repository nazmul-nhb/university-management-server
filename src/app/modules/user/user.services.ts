import configs from '../../configs';
import { Student } from '../student/student.model';
import type { TStudent } from '../student/student.types';
import type { TUser } from './user.types';
import { User } from './user.model';
import { generateAdminId, generateStudentId } from './user.utilities';
import { startSession } from 'mongoose';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import type { TAdmin } from '../admin/admin.types';
import { Admin } from '../admin/admin.model';

const saveStudentInDB = async (
	password: string = configs.defaultPassword,
	payload: TStudent,
) => {
	const semesterId = payload.admissionSemester.toString();
	const departmentId = payload.academicDepartment.toString();

	const session = await startSession();

	// * Should start session outside try-catch block
	session.startTransaction();

	try {
		const studentId = await generateStudentId(semesterId, departmentId);

		// * create a user object
		const userData: Partial<TUser> = {
			password,
			role: 'student',
			id: studentId,
		};

		// * create a user
		const newUser = await User.create([userData], { session });

		if (!newUser[0]?._id) {
			throw new ErrorWithStatus(
				'Student Creation Error!',
				'Failed to create user!',
				422,
				'user',
			);
		}

		// Assign `id` and `_id` for the student payload
		payload.id = newUser[0].id;
		payload.user = newUser[0]._id;

		// * Create the Student document
		const newStudent = await Student.create([payload], { session });

		if (!newStudent[0]?.id) {
			throw new ErrorWithStatus(
				'Student Creation Error!',
				'Failed to create student!',
				422,
				'student',
			);
		}

		// * Commit the transaction
		await session.commitTransaction();
		session.endSession();

		return newStudent[0];
	} catch (error) {
		// * Rollback the transaction
		await session.abortTransaction();
		session.endSession();

		throw error;
	}
};

const saveAdminInDB = async (
	password: string = configs.defaultPassword,
	payload: TAdmin,
) => {
	const session = await startSession();

	session.startTransaction();

	try {
		const adminId = await generateAdminId();

		// * create a user object
		const userData: Partial<TUser> = {
			password,
			role: 'admin',
			id: adminId,
		};

		// create a user (transaction-1)
		const newUser = await User.create([userData], { session });

		if (!newUser[0]?._id) {
			throw new ErrorWithStatus(
				'Creation Error!',
				'Failed to create user!',
				422,
				'user',
			);
		}
		// set id , _id as user
		payload.id = newUser[0].id;
		payload.user = newUser[0]._id; //reference _id

		// create a admin (transaction-2)
		const newAdmin = await Admin.create([payload], { session });

		if (!newAdmin[0]?.id) {
			throw new ErrorWithStatus(
				'Admin Creation Error!',
				'Failed to create admin!',
				422,
				'admin',
			);
		}

		await session.commitTransaction();
		await session.endSession();

		return newAdmin[0];
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}
};

export const userServices = {
	saveStudentInDB,
	saveAdminInDB,
};
