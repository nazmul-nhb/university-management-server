import express from 'express';
import { adminControllers } from './admin.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidations } from './admin.validation';

const router = express.Router();

router.get('/', adminControllers.getAllAdmins);

router.get('/:id', adminControllers.getSingleAdmin);

router.patch(
	'/:id',
	validateRequest(adminValidations.updateSchema),
	adminControllers.updateAdmin,
);

router.delete('/:id', adminControllers.deleteAdmin);

export const adminRoutes = router;
