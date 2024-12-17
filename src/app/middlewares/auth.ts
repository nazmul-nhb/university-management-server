import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';
import configs from '../configs';
import type { TUserRole } from '../modules/user/user.types';
import catchAsync from '../utilities/catchAsync';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
	return catchAsync(async (req, _res, next) => {
		const token = req.headers.authorization;

		// checking if the token is missing
		if (!token) {
			throw new ErrorWithStatus(
				'Unauthorized Access',
				"You're not authorized",
				401,
				'auth',
			);
		}

		// checking if the given token is valid
		const decoded = jwt.verify(token, configs.accessSecret) as JwtPayload;

		const { role, userId, iat } = decoded;

		// checking if the user is exist
		const user = await User.checkUserExistenceByCustomId(userId);

		if (!user) {
			throw new ErrorWithStatus(
				'Not Found Error',
				`User with id ${userId} not found!`,
				404,
				'auth',
			);
		}
		// checking if the user is already deleted

		const isDeleted = user?.isDeleted;

		if (isDeleted) {
			throw new ErrorWithStatus(
				'User Deleted',
				`User with id ${userId} is deleted!`,
				403,
				'auth',
			);
		}

		// checking if the user is blocked
		const userStatus = user?.status;

		if (userStatus === 'blocked') {
			throw new ErrorWithStatus(
				'Not Matched Error',
				`User with id ${userId} is blocked!`,
				403,
				'auth',
			);
		}

		if (
			user.passwordChangedAt &&
			User.isJWTIssuedBeforePasswordChanged(
				user.passwordChangedAt,
				iat as number,
			)
		) {
			throw new ErrorWithStatus(
				'Unauthorized Access',
				"You're not authorized",
				401,
				'auth',
			);
		}

		if (requiredRoles && !requiredRoles.includes(role)) {
			throw new ErrorWithStatus(
				'Unauthorized Access',
				"You're not authorized",
				401,
				'auth',
			);
		}

		req.user = decoded as JwtPayload;
		next();
	});
};

export default auth;
