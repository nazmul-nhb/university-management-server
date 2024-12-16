import { Student } from '../student/student.model';
import { Semester } from '../semester/semester.model';
import { Department } from '../department/department.model';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { User } from './user.model';

export const generateStudentId = async (
	semesterId: string,
	departmentId: string,
) => {
	// Find semester & department info & student count from specific department
	const [semester, department, studentCount] = await Promise.all([
		Semester.findById(semesterId).select('year code -_id').lean(),
		Department.findById(departmentId).select('code -_id').lean(),
		Student.countDocuments({
			admissionSemester: semesterId,
			academicDepartment: departmentId,
		}),
	]);

	if (!semester) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No Semester Matched with ${semesterId}`,
			404,
			'semester',
		);
	}

	if (!department) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No Department Matched with ${departmentId}`,
			404,
			'department',
		);
	}

	const { year, code: semesterCode } = semester;
	const { code: departmentCode } = department;

	const nextId = (studentCount + 1).toString().padStart(4, '0');

	return `${departmentCode}${year}${semesterCode}${nextId}`;
};

export const findLastAdminId = async () => {
	const lastAdmin = await User.findOne(
		{
			role: 'admin',
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

	return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
	let currentId = (0).toString();
	const lastAdminId = await findLastAdminId();

	if (lastAdminId) {
		currentId = lastAdminId.substring(2);
	}

	let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

	incrementId = `A-${incrementId}`;
	return incrementId;
};