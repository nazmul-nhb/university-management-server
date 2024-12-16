import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { teacherControllers } from '../teacher/teacher.controllers';
import { teacherValidations } from './teacher.validation';

const router = express.Router();

router.get('/', teacherControllers.getAllTeachers);

router.get('/:id', teacherControllers.getSingleTeacher);

router.patch(
	'/:id',
	validateRequest(teacherValidations.updateSchema),
	teacherControllers.updateTeacher,
);

router.delete('/:id', teacherControllers.deleteTeacher);

export const teacherRoutes = router;
