import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { registrationControllers } from './registration.controllers';
import { registrationValidations } from './registration.validation';

const router = express.Router();

router.post(
	'/create',
	validateRequest(registrationValidations.creationSchema),
	registrationControllers.createRegistration,
);

router.get('/:id', registrationControllers.getSingleRegistration);

router.patch(
	'/:id',
	validateRequest(registrationValidations.updateSchema),
	registrationControllers.updateRegistration,
);

router.get('/:id', registrationControllers.getSingleRegistration);

router.delete('/:id', registrationControllers.deleteRegistration);

router.get('/', registrationControllers.getAllRegistrations);

export const registrationRoutes = router;
