import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { authControllers } from './auth.controllers';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();

router.post(
	'/login',
	validateRequest(authValidations.loginSchema),
	authControllers.loginUser,
);

router.post(
	'/change-password',
	auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.student),
	validateRequest(authValidations.changePasswordSchema),
	authControllers.changePassword,
);

router.post(
	'/refresh-token',
	validateRequest(authValidations.refreshTokenSchema),
	authControllers.refreshToken,
);

export const authRoutes = router;
