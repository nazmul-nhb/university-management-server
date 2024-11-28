import configs from '../../configs';
import { Student } from '../student/student.model';
import type { TStudent } from '../student/student.types';
import type { TUser } from './user.types';
import { User } from './user.model';

const saveStudentIntoDB = async (
	password: string = configs.defaultPassword,
	studentData: TStudent,
) => {
	// create a user object
	const userData: Partial<TUser> = {};

	userData.password = password;

	//set student role
	userData.role = 'student';

	//set manually generated it
	userData.id = '2030100001';

	// create a user
	const newUser = await User.create(userData);

	//create a student
    if (newUser._id) {
        // console.log(studentData);
		// set id , _id as user
		studentData.id = newUser.id;
		studentData.user = newUser._id; //reference _id

		const newStudent = await Student.create(studentData);
		return newStudent;
	}
};

export const userServices = {
	saveStudentIntoDB,
};
