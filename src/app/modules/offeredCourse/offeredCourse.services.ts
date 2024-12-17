import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { QueryBuilder } from '../../classes/QueryBuilder';
import { Course } from '../course/course.model';
import { Department } from '../department/department.model';
import { Faculty } from '../faculty/faculty.model';
import { Registration } from '../registration/registration.model';
import { Teacher } from '../teacher/teacher.model';
import { OfferedCourse } from './offeredCourse.model';
import type { TOfferedCourse } from './offeredCourse.types';
import { hasTimeConflict } from './offeredCourse.utilities';

const saveOfferedCourseInDB = async (payload: TOfferedCourse) => {
	const {
		semesterRegistration,
		academicFaculty,
		academicDepartment,
		course,
		section,
		teacher,
		days,
		startTime,
		endTime,
	} = payload;

	/**
	 * Step 1: check if the semester registration id is exists!
	 * Step 2: check if the academic teacher id is exists!
	 * Step 3: check if the academic department id is exists!
	 * Step 4: check if the course id is exists!
	 * Step 5: check if the teacher id is exists!
	 * Step 6: check if the department is belong to the teacher
	 * Step 7: check if the same offered course same section in same registered semester exists
	 * Step 8: get the schedules of the faculties
	 * Step 9: check if the teacher is available at that time. If not then throw error
	 * Step 10: create the offered course
	 */

	//check if the semester registration id is exists!
	const existingRegistration =
		await Registration.findById(semesterRegistration);

	if (!existingRegistration) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Semester registration not found!`,
			404,
			'registration',
		);
	}

	const academicSemester = existingRegistration.academicSemester;

	const existingFaculty = await Faculty.findById(academicFaculty);

	if (!existingFaculty) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Academic faculty not found!`,
			404,
			'faculty',
		);
	}

	const existingDepartment = await Department.findById(academicDepartment);

	if (!existingDepartment) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Academic faculty not found!`,
			404,
			'faculty',
		);
	}

	const existingCourse = await Course.findById(course);

	if (!existingCourse) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Course not found!`,
			404,
			'course',
		);
	}

	const teacherExists = await Teacher.findById(teacher);

	if (!teacherExists) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Teacher not found!`,
			404,
			'teacher',
		);
	}

	// check if the department is belong to the teacher
	const departmentBelongsToFaculty = await Department.findOne({
		_id: academicDepartment,
		academicFaculty,
	});

	if (!departmentBelongsToFaculty) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`${existingDepartment.name} does not belong to ${existingFaculty.name}`,
			400,
			'department',
		);
	}

	// check if the same offered course same section in same registered semester exists

	const alreadyOfferedCourse = await OfferedCourse.findOne({
		semesterRegistration,
		course,
		section,
	});

	if (alreadyOfferedCourse) {
		throw new ErrorWithStatus(
			'Duplicate Error',
			`Offered course with same section already exists!`,
			409,
			'offered-course',
		);
	}

	// get the schedules of the faculties
	const assignedSchedules = await OfferedCourse.find({
		semesterRegistration,
		teacher,
		days: { $in: days },
	}).select('days startTime endTime');

	const newSchedule = {
		days,
		startTime,
		endTime,
	};

	if (hasTimeConflict(assignedSchedules, newSchedule)) {
		throw new ErrorWithStatus(
			'Not Available',
			`This teacher is not available at specified time! Choose other time or day!`,
			409,
			'offered-course',
		);
	}

	const result = await OfferedCourse.create({
		...payload,
		academicSemester,
	});
	return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
	const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
		.filter()
		.sort()
		.paginate()
		.fields();

	const result = await offeredCourseQuery.modelQuery;
	return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
	const offeredCourse = await OfferedCourse.findById(id);

	if (!offeredCourse) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Offered Course not found!`,
			404,
			'offered-course',
		);
	}

	return offeredCourse;
};

const updateOfferedCourseInDB = async (
	id: string,
	payload: Pick<TOfferedCourse, 'teacher' | 'days' | 'startTime' | 'endTime'>,
) => {
	/**
	 * Step 1: check if the offered course exists
	 * Step 2: check if the teacher exists
	 * Step 3: check if the semester registration status is upcoming
	 * Step 4: check if the teacher is available at that time. If not then throw error
	 * Step 5: update the offered course
	 */
	const { teacher, days, startTime, endTime } = payload;

	const offeredCourse = await OfferedCourse.findById(id);

	if (!offeredCourse) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Offered Course not found!`,
			404,
			'offered-course',
		);
	}

	const teacherExists = await Teacher.findById(teacher);

	if (!teacherExists) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Teacher not found`,
			404,
			'teacher',
		);
	}

	const semesterRegistration = offeredCourse.semesterRegistration;
	// get the schedules of the faculties

	// Checking the status of the semester registration
	const semesterRegistrationStatus =
		await Registration.findById(semesterRegistration);

	if (semesterRegistrationStatus?.status !== 'UPCOMING') {
		throw new ErrorWithStatus(
			'Forbidden Action',
			`You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
			403,
			'registration',
		);
	}

	// check if the teacher is available at that time.
	const assignedSchedules = await OfferedCourse.find({
		semesterRegistration,
		teacher,
		days: { $in: days },
	}).select('days startTime endTime');

	const newSchedule = {
		days,
		startTime,
		endTime,
	};

	if (hasTimeConflict(assignedSchedules, newSchedule)) {
		throw new ErrorWithStatus(
			'Not Available',
			`This teacher is not available at specified time! Choose other time or day!`,
			409,
			'offered-course',
		);
	}

	const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
		new: true,
	});

	return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
	/**
	 * Step 1: check if the offered course exists
	 * Step 2: check if the semester registration status is upcoming
	 * Step 3: delete the offered course
	 */
	const offeredCourseExists = await OfferedCourse.findById(id);

	if (!offeredCourseExists) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Offered Course not found`,
			404,
			'offered-course',
		);
	}

	const semesterRegistration = offeredCourseExists.semesterRegistration;

	const semesterRegistrationStatus =
		await Registration.findById(semesterRegistration).select('status');

	if (semesterRegistrationStatus?.status !== 'UPCOMING') {
		throw new ErrorWithStatus(
			'Forbidden Action',
			`Offered course cannot be update, because the semester ${semesterRegistrationStatus}!`,
			403,
			'offered-course',
		);
	}

	const result = await OfferedCourse.findByIdAndDelete(id);

	return result;
};

export const offeredCourseServices = {
	saveOfferedCourseInDB,
	getAllOfferedCoursesFromDB,
	getSingleOfferedCourseFromDB,
	updateOfferedCourseInDB,
	deleteOfferedCourseFromDB,
};
