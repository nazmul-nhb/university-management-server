import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userControllers } from './user.controllers';
import { studentValidations } from '../student/student.validation';
import { adminValidations } from '../admin/admin.validation';
import { teacherValidations } from '../teacher/teacher.validation';

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

router.post(
	'/create-teacher',
	validateRequest(teacherValidations.creationSchema),
	userControllers.createTeacher,
);

export const userRoutes = router;
