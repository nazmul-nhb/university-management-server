import type { TUserRole } from '../modules/user/user.types';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';
import configs from '../configs';
import catchAsync from '../utilities/catchAsync';
import { validateUser, verifyToken } from '../modules/auth/auth.utilities';

const auth = (...requiredRoles: TUserRole[]) => {
	return catchAsync(async (req, _res, next) => {
		const token = req.headers.authorization;

		// Verify token
		const decoded = verifyToken(configs.accessSecret, token);

		// Validate user
		await validateUser(decoded.userId, decoded.iat);

		if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
			throw new ErrorWithStatus(
				'Unauthorized Access',
				"You're not authorized",
				401,
				'auth',
			);
		}

		req.user = decoded;

		next();
	});
};

export default auth;
