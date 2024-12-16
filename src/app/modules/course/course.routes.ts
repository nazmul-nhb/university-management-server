import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { courseControllers } from './course.controllers';
import { courseValidations } from './course.validation';

const router = express.Router();

router.post(
	'/create',
	validateRequest(courseValidations.creationSchema),
	courseControllers.createCourse,
);

router.get('/:id', courseControllers.getSingleCourse);

router.patch(
	'/:id',
	validateRequest(courseValidations.updateSchema),
	courseControllers.updateCourse,
);

router.delete('/:id', courseControllers.deleteCourse);

router.put(
	'/:id/assign-teachers',
	validateRequest(courseValidations.courseTeacherSchema),
	courseControllers.assignTeachersWithCourse,
);

router.delete(
	'/:id/remove-teachers',
	validateRequest(courseValidations.courseTeacherSchema),
	courseControllers.removeTeachersFromCourse,
);

router.get('/', courseControllers.getAllCourses);

export const courseRoutes = router;
