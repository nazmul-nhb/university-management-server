import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { semesterValidations } from './semester.validation';
import { semesterControllers } from './semester.controllers';

const router = express.Router();

router.post(
	'/create',
	validateRequest(semesterValidations.creationSchema),
	semesterControllers.createSemester,
);

router.get('/', semesterControllers.getAllSemesters);

router.get('/:id', semesterControllers.getSingleSemester);

router.patch(
	'/:id',
	validateRequest(semesterValidations.updateSchema),
	semesterControllers.updateSemester,
);

export const semesterRoutes = router;
