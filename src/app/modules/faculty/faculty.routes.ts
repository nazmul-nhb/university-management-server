import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';
import { facultyControllers } from './faculty.controllers';

const router = express.Router();

router.post(
	'/create',
	validateRequest(facultyValidations.creationSchema),
	facultyControllers.createFaculty,
);

router.get('/', facultyControllers.getAllFaculties);

router.get('/:id', facultyControllers.getSingleFaculty);

router.patch(
	'/:id',
	validateRequest(facultyValidations.updateSchema),
	facultyControllers.updateFaculty,
);

export const facultyRoutes = router;
