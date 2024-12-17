// import { startSession } from 'mongoose';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { QueryBuilder } from '../../classes/QueryBuilder';
import { Semester } from '../semester/semester.model';
import { RegistrationStatus } from './registration.constants';
import { Registration } from './registration.model';
import type { TRegistration } from './registration.types';

const saveRegistrationInDB = async (payload: TRegistration) => {
	/**
	 * * Steps
	 * Step1: Check if there any registered semester that is already 'UPCOMING'|'ONGOING'
	 * Step2: Check if the semester exists
	 * Step3: Check if the semester is already registered!
	 * Step4: Create the semester registration
	 */

	const academicSemester = payload?.academicSemester;

	//check if there any registered semester that is already 'UPCOMING'|'ONGOING'
	const isThereAnyUpcomingOrOngoingSemester = await Registration.findOne({
		$or: [
			{ status: RegistrationStatus.UPCOMING },
			{ status: RegistrationStatus.ONGOING },
		],
	});

	if (isThereAnyUpcomingOrOngoingSemester) {
		throw new ErrorWithStatus(
			'Duplicate Error',
			`There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester!`,
			409,
			'registration',
		);
	}
	// check if the semester is exist
	const isAcademicSemesterExists = await Semester.findById(academicSemester);

	if (!isAcademicSemesterExists) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Specified semester not found!`,
			400,
			'registration',
		);
	}

	// check if the semester is already registered!
	const isRegistrationExists = await Registration.findOne({
		academicSemester,
	});

	if (isRegistrationExists) {
		throw new ErrorWithStatus(
			'Duplicate Error',
			`Already registered this semester!`,
			409,
			'registration',
		);
	}

	const result = await Registration.create(payload);

	return result;
};

const getAllRegistrationsFromDB = async (query: Record<string, unknown>) => {
	const registrationQuery = new QueryBuilder(
		Registration.find().populate('academicSemester'),
		query,
	)
		.filter()
		.sort()
		.paginate()
		.fields();

	const result = await registrationQuery.modelQuery;
	return result;
};

const getSingleRegistrationsFromDB = async (id: string) => {
	const result = await Registration.findById(id);

	return result;
};

const updateRegistrationIntoDB = async (
	id: string,
	payload: Partial<TRegistration>,
) => {
	/**
	 * Step1: Check if the semester is exist
	 * Step2: Check if the requested registered semester is exists
	 * Step3: If the requested semester registration is ended, we will not update anything
	 * Step4: If the requested semester registration is 'UPCOMING', we will let update everything.
	 * Step5: If the requested semester registration is 'ONGOING', we will not update anything  except status to 'ENDED'
	 * Step6: If the requested semester registration is 'ENDED' , we will not update anything
	 *
	 * UPCOMING --> ONGOING --> ENDED
	 *
	 */

	// check if the requested registered semester is exists
	// check if the semester is already registered!
	const isRegistrationExists = await Registration.findById(id);

	if (!isRegistrationExists) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`Specified semester not found!`,
			404,
			'registration',
		);
	}

	//if the requested semester registration is ended , we will not update anything
	const currentSemesterStatus = isRegistrationExists?.status;
	const requestedStatus = payload?.status;

	if (currentSemesterStatus === RegistrationStatus.ENDED) {
		throw new ErrorWithStatus(
			'Duplicate Error',
			`This semester is already ${currentSemesterStatus}`,
			409,
			'registration',
		);
	}

	// UPCOMING --> ONGOING --> ENDED
	if (
		currentSemesterStatus === RegistrationStatus.UPCOMING &&
		requestedStatus === RegistrationStatus.ENDED
	) {
		throw new ErrorWithStatus(
			'Forbidden Action',
			`You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
			403,
			'registration',
		);
	}

	if (
		currentSemesterStatus === RegistrationStatus.ONGOING &&
		requestedStatus === RegistrationStatus.UPCOMING
	) {
		throw new ErrorWithStatus(
			'Forbidden Action',
			`You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
			403,
			'registration',
		);
	}

	const result = await Registration.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: true,
	});

	return result;
};

// const deleteRegistrationFromDB = async (id: string) => {
// 	/**
//   * Step1: Delete associated offered courses.
//   * Step2: Delete semester registration when the status is
//   'UPCOMING'.
//   **/

// 	// checking if the semester registration is exist
// 	const isRegistrationExists = await Registration.findById(id);

// 	if (!isRegistrationExists) {
// 		throw new ErrorWithStatus(
// 			'Not Found Error',
// 			`Specified semester not found!`,
// 			404,
// 			'registration',
// 		);
// 	}

// 	// checking if the status is still "UPCOMING"
// 	const semesterRegistrationStatus = isRegistrationExists.status;

//     if (semesterRegistrationStatus !== 'UPCOMING') {
//         throw new ErrorWithStatus(
// 			'Forbidden Action',
// 			`You can not update as the registered semester is ${semesterRegistrationStatus}`,
// 			403,
// 			'registration',
// 		);
// 	}

// 	const session = await startSession();

// 	//deleting associated offered courses

// 	try {
// 		session.startTransaction();

// 		const deletedOfferedCourse = await OfferedCourse.deleteMany(
// 			{
// 				semesterRegistration: id,
// 			},
// 			{
// 				session,
// 			},
// 		);

// 		if (!deletedOfferedCourse) {
// 			throw new AppError(
// 				httpStatus.BAD_REQUEST,
// 				'Failed to delete semester registration !',
// 			);
// 		}

// 		const deletedSemisterRegistration =
// 			await Registration.findByIdAndDelete(id, {
// 				session,
// 				new: true,
// 			});

// 		if (!deletedSemisterRegistration) {
// 			throw new AppError(
// 				httpStatus.BAD_REQUEST,
// 				'Failed to delete semester registration !',
// 			);
// 		}

// 		await session.commitTransaction();
// 		await session.endSession();

// 		return null;
// 	} catch (err: any) {
// 		await session.abortTransaction();
// 		await session.endSession();
// 		throw new Error(err);
// 	}
// };

export const registrationServices = {
	saveRegistrationInDB,
	getAllRegistrationsFromDB,
	getSingleRegistrationsFromDB,
	updateRegistrationIntoDB,
	// deleteRegistrationFromDB,
};
