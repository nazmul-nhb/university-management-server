import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { departmentValidations } from './department.validation';
import { departmentControllers } from './department.controllers';

const router = express.Router();

router.post(
	'/create',
	validateRequest(departmentValidations.creationSchema),
	departmentControllers.createDepartment,
);

router.get('/', departmentControllers.getAllDepartments);

router.get('/:id', departmentControllers.getSingleDepartment);

router.patch(
	'/:id',
	validateRequest(departmentValidations.updateSchema),
	departmentControllers.updateDepartment,
);

export const departmentRoutes = router;
