import type { Document } from 'mongoose';
import type { TSemester } from '../semester/semester.types';
import { User } from './user.model';

const findLastStudentId = async () => {
	const lastStudent = await User.findOne(
		{
			role: 'student',
		},
		{
			id: 1,
			_id: 0,
		},
	)
		.sort({
			createdAt: -1,
		})
		.lean();

	//! This design has a serious flaw! What if a student admits into a new semester? The ID will still be an increment of the previous id, no matter which semester. Eah semester should have started with 0001 id for each department

	//203001   0001
	return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};

export const generateStudentId = async (payload: TSemester & Document) => {
	// first time 0000
	//0001  => 1
	const currentId = (await findLastStudentId()) || '0';

	let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

	incrementId = `${payload.year}${payload.code}${incrementId}`;

	return incrementId;
};
