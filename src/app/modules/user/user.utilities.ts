import { Student } from '../student/student.model';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { semesterServices } from '../semester/semester.services';
import { departmentServices } from '../department/department.services';

export const generateStudentId = async (
	semesterId: string,
	departmentId: string,
) => {
	// Find semester & department info
	const [semester, department] = await Promise.all([
		semesterServices.getSingleSemesterFromDB(semesterId),
		departmentServices.getSingleDepartmentFromDB(departmentId),
	]);

	if (!semester) {
		throw new ErrorWithStatus(
			'SemesterNotFound',
			`No Semester Matched with ${semesterId}`,
			404,
		);
	}

	if (!department) {
		throw new ErrorWithStatus(
			'DepartmentNotFound',
			`No Department Matched with ${departmentId}`,
			404,
		);
	}

	const { year, code } = semester;

	const currentCount = await Student.countByDept(semesterId, departmentId);

	const nextId = (currentCount + 1).toString().padStart(4, '0');

	return `${department?.code}${year}${code}${nextId}`;
};
