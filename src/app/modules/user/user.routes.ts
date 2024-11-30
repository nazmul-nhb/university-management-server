import express from 'express';
import { userControllers } from './user.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../student/student.validation';

const router = express.Router();

router.post(
	'/create-student',
	validateRequest(studentValidations.creationSchema),
	userControllers.createStudent,
);

export const userRoutes = router;
