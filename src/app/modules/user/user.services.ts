import configs from '../../configs';
import { Student } from '../student/student.model';
import type { TStudent } from '../student/student.types';
import type { TUser } from './user.types';
import { User } from './user.model';
import { generateStudentId } from './user.utilities';
import { semesterServices } from '../semester/semester.services';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';

const saveStudentIntoDB = async (
	password: string = configs.defaultPassword,
	payload: TStudent,
) => {
	// create a user object
	const userData: Partial<TUser> = {};

	userData.password = password;

	//set student role
	userData.role = 'student';

	// find academic semester info
	const admissionSemester = await semesterServices.getSingleSemesterFromDB(
		payload.admissionSemester.toString(),
	);

	//set  generated id
	if (!admissionSemester) {
		throw new ErrorWithStatus(
			'SemesterNotFound',
			`No Semester Matched with ${payload.admissionSemester}`,
			404,
		);
	}

	userData.id = await generateStudentId(admissionSemester);

	// create a user
	const newUser = await User.create(userData);

	//create a student
	if (newUser._id) {
		// console.log(payload);
		// set id , _id as user
		payload.id = newUser.id;
		payload.user = newUser._id; //reference _id

		const newStudent = await Student.create(payload);
		return newStudent;
	}
};

export const userServices = {
	saveStudentIntoDB,
};
