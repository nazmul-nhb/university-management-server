import configs from '../../configs';
import { Student } from '../student/student.model';
import type { TStudent } from '../student/student.types';
import type { TUser } from './user.types';
import { User } from './user.model';
import { generateStudentId } from './user.utilities';
import { startSession } from 'mongoose';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';

const saveStudentIntoDB = async (
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
				'Creation Error!',
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

export const userServices = {
	saveStudentIntoDB,
};
