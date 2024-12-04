// import { User } from './user.model';
import { semesterServices } from '../semester/semester.services';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { Student } from '../student/student.model';

const findLastStudentId = async (semesterId: string, departmentId: string) => {
	const lastStudent = await Student.findOne(
		{ admissionSemester: semesterId, academicDepartment: departmentId },
		{ id: 1, _id: 0 },
	)
		.sort({ createdAt: -1 })
		.lean();

	/**
	 * * All Fixed!
	 * ! This design has a serious flaw! What if a student admits into a new semester? - * Fixed
	 * ! The ID will still be an increment of the previous id, no matter which semester. - * Fixed
	 * ! Each semester should have started with 0001 id for each department. - * Fixed
	 * ! Operation should be run in Student Collection when department model is created! - * Fixed
	 * ? New Issue : ID should have department code at the beginning
	 * ? Or Each Department should have separate collection to avoid conflict
	 */

	return lastStudent?.id ? lastStudent.id.substring(6) : null;
};

export const generateStudentId = async (
	semesterId: string,
	departmentId: string,
) => {
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

	const currentId =
		(await findLastStudentId(semesterId, departmentId)) || '0';

	const incrementedId = (Number(currentId) + 1).toString().padStart(4, '0');

	// ! Serious Issue : ID must have department code included.
	// ! Otherwise there will be conflict with IDs of students from different departments.
	const finalId = `${year}${code}${incrementedId}`;

	return finalId;
};
