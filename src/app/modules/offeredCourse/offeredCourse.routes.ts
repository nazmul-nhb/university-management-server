import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { offeredCourseControllers } from './offeredCourse.controllers';
import { offeredCourseValidations } from './offeredCourse.validation';

const router = express.Router();

router.get('/', offeredCourseControllers.getAllOfferedCourses);

router.get('/:id', offeredCourseControllers.getSingleOfferedCourses);

router.post(
	'/create',
	validateRequest(offeredCourseValidations.creationSchema),
	offeredCourseControllers.createOfferedCourse,
);

router.patch(
	'/:id',
	validateRequest(offeredCourseValidations.updateSchema),
	offeredCourseControllers.updateOfferedCourse,
);

router.delete('/:id', offeredCourseControllers.deleteOfferedCourseFromDB);

export const offeredCourseRoutes = router;
