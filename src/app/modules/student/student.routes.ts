import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { studentControllers } from './student.controllers';
import { studentValidations } from './student.validation';

const router = express.Router();

router.get('/', studentControllers.getAllStudents);

router.get('/:id', studentControllers.getSingleStudent);

router.patch(
	'/:id',
	validateRequest(studentValidations.updateSchema),
	studentControllers.updateStudent,
);

export const studentRoutes = router;
