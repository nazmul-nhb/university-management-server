import { Student } from '../student/student.model';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { semesterServices } from '../semester/semester.services';
import { departmentServices } from '../department/department.services';

const findLastStudentId = async (semesterId: string, departmentId: string) => {
	const lastStudent = await Student.findOne(
		{ admissionSemester: semesterId, academicDepartment: departmentId },
		{ id: 1, _id: 0 },
	)
		.sort({ createdAt: -1 })
		.lean();

	/**
	 * * All Fixed!
	 * ? This design has a serious flaw! What if a student admits into a new semester or in another dept. or both? - * Fixed
	 * ? The ID will still be an increment of the previous id, no matter which semester. - * Fixed
	 * ? Each semester should have started with 0001 id for each department. - * Fixed
	 * ? Operation should be run in Student Collection when department model is created! - * Fixed
	 * ? New Issue : ID should have department code at the beginning - * Fixed
	 * ! Or Each Department should have separate collection to avoid conflict
	 */

	return lastStudent?.id ? lastStudent.id.substring(9) : null;
};

export const generateStudentId = async (
	semesterId: string,
	departmentId: string,
) => {
	// Find academic semester & department info
	const [semester, department] = await Promise.all([
		semesterServices.getSingleSemesterFromDB(semesterId),
		departmentServices.getSingleDepartmentFromDB(departmentId),
	]);

	// Throw Error when no Admission Semester id found
	if (!semester) {
		throw new ErrorWithStatus(
			'SemesterNotFound',
			`No Semester Matched with ${semesterId}`,
			404,
		);
	}

	const { year, code } = semester;

	const lastId = (await findLastStudentId(semesterId, departmentId)) || '0';

	const incrementedId = (Number(lastId) + 1).toString().padStart(4, '0');

	/**
	 * ? Serious Issue : ID must have department code included. - * Fixed
	 * ? Otherwise there will be conflict with IDs of students from different departments. - * Fixed
	 */

	const newId = `${department?.code}${year}${code}${incrementedId}`;

	return newId;
};
