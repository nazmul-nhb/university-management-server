import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { semesterValidations } from './semester.validation';
import { semesterControllers } from './semester.controllers';

const router = express.Router();

router.post(
	'/create',
    validateRequest(semesterValidations.creationSchema),
    semesterControllers.createSemester
);

export const semesterRoutes = router;
