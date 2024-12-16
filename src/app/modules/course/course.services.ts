import { startSession } from 'mongoose';
import { QueryBuilder } from '../../classes/QueryBuilder';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { courseSearchableFields } from './course.constants';
import type { TCourse, TCourseTeacher } from './course.types';
import { Course, CourseTeacher } from './course.model';

const saveCourseInDB = async (payload: TCourse) => {
	const result = await Course.create(payload);
	return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
	const courseQuery = new QueryBuilder(
		Course.find(),
		// .populate('preRequisiteCourses.course'),
		query,
	)
		.search(courseSearchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();

	const result = await courseQuery.modelQuery;
	return result;
};

const getSingleCourseFromDB = async (id: string) => {
	const result = await Course.findById(id).populate(
		'preRequisiteCourses.course',
	);
	return result;
};

const updateCourseInDB = async (id: string, payload: Partial<TCourse>) => {
	const { preRequisiteCourses, ...remainingCourseData } = payload;

	const session = await startSession();

	session.startTransaction();

	try {
		// * basic course info update
		const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
			id,
			remainingCourseData,
			{
				new: true,
				runValidators: true,
				session,
			},
		);

		if (!updatedBasicCourseInfo) {
			throw new ErrorWithStatus(
				'Course Update Error',
				'Failed to update course!',
				400,
				'course',
			);
		}

		// * check if there is any pre requisite courses to update
		if (preRequisiteCourses && preRequisiteCourses.length > 0) {
			// * filter out the deleted fields
			const deletedPreRequisites = preRequisiteCourses
				.filter((pre) => pre.course && pre.isDeleted)
				.map((pre) => pre.course);

			const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
				id,
				{
					$pull: {
						preRequisiteCourses: {
							course: { $in: deletedPreRequisites },
						},
					},
				},
				{
					new: true,
					runValidators: true,
					session,
				},
			);

			if (!deletedPreRequisiteCourses) {
				throw new ErrorWithStatus(
					'Course Delete Error',
					'Failed to delete course!',
					400,
					'course',
				);
			}

			// * filter out the new course fields
			const newPreRequisites = preRequisiteCourses?.filter(
				(pre) => pre.course && !pre.isDeleted,
			);

			const newPreRequisiteCourses = await Course.findByIdAndUpdate(
				id,
				{
					$addToSet: {
						preRequisiteCourses: { $each: newPreRequisites },
					},
				},
				{
					new: true,
					runValidators: true,
					session,
				},
			);

			if (!newPreRequisiteCourses) {
				throw new ErrorWithStatus(
					'Prerequisite Course Update Error',
					'Failed to update prerequisite course!',
					400,
					'prerequisite course',
				);
			}
		}

		await session.commitTransaction();
		await session.endSession();

		const result = await Course.findById(id).populate(
			'preRequisiteCourses.course',
		);

		return result;
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}
};

const deleteCourseFromDB = async (id: string) => {
	const result = await Course.findByIdAndUpdate(
		id,
		{ isDeleted: true },
		{
			new: true,
		},
	);
	return result;
};

const assignTeachersWithCourseInDB = async (
	id: string,
	payload: Partial<TCourseTeacher>,
) => {
	const result = await CourseTeacher.findByIdAndUpdate(
		id,
		{
			course: id,
			$addToSet: { teachers: { $each: payload } }, // ! Problem in this logic
		},
		{
			upsert: true,
			new: true,
		},
	);
	return result;
};

const removeTeachersFromCourseFromDB = async (
	id: string,
	payload: Partial<TCourseTeacher>,
) => {
	const result = await CourseTeacher.findByIdAndUpdate(
		id,
		{
			$pull: { teachers: { $in: payload } }, // ! Problem in this logic
		},
		{
			new: true,
		},
	);
	return result;
};

export const courseServices = {
	saveCourseInDB,
	getAllCoursesFromDB,
	getSingleCourseFromDB,
	updateCourseInDB,
	deleteCourseFromDB,
	assignTeachersWithCourseInDB,
	removeTeachersFromCourseFromDB,
};
