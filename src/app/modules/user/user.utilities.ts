// import { User } from './user.model';
import { semesterServices } from '../semester/semester.services';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { Student } from '../student/student.model';

const findLastStudentId = async (semesterId: string) => {
	const lastStudent = await Student.findOne(
		{ admissionSemester: semesterId },
		{ id: 1, _id: 0 },
	)
		.sort({ createdAt: -1 })
		.lean();

	/**
	 * ! This design has a serious flaw! What if a student admits into a new semester? - * Fixed
	 * ! The ID will still be an increment of the previous id, no matter which semester. - * Fixed
	 * ! Each semester should have started with 0001 id for each department. - * Fixed
	 * ! Operation should be run in Student Collection when department model is created! - * Done
	 * * Partially Fixed!
	 * TODO: Need to Modify after department is added
	 */

	return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};

export const generateStudentId = async (semesterId: string) => {
	// Find academic semester info
	const admissionSemester =
		await semesterServices.getSingleSemesterFromDB(semesterId);

	// Throw Error when no Admission Semester id found
	if (!admissionSemester) {
		throw new ErrorWithStatus(
			'SemesterNotFound',
			`No Semester Matched with ${semesterId}`,
			404,
		);
	}

	const { year, code } = admissionSemester;

	const currentId = (await findLastStudentId(semesterId)) || '0';

	const incrementedId = (Number(currentId) + 1).toString().padStart(4, '0');

	const finalId = `${year}${code}${incrementedId}`;

	return finalId;
};
