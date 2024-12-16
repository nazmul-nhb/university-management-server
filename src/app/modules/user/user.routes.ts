import express from 'express';
import { userControllers } from './user.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../student/student.validation';
import { adminValidations } from '../admin/admin.validation';

const router = express.Router();

router.post(
	'/create-student',
	validateRequest(studentValidations.creationSchema),
	userControllers.createStudent,
);

router.post(
	'/create-admin',
	validateRequest(adminValidations.creationSchema),
	userControllers.createAdmin,
);

export const userRoutes = router;
