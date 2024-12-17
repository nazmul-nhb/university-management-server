import jwt from 'jsonwebtoken';
import type { IJwtPayload } from '../../types/interfaces';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { User } from '../user/user.model';

export const createToken = (
	jwtPayload: IJwtPayload,
	secret: string,
	expiresIn: string,
) => {
	return jwt.sign(jwtPayload, secret, {
		expiresIn,
	});
};

export const verifyToken = (secret: string, token?: string): IJwtPayload => {
	if (!token) {
		throw new ErrorWithStatus(
			'Unauthorized Access',
			"You're not authorized",
			401,
			'auth',
		);
	}

	try {
		return jwt.verify(token, secret) as IJwtPayload;
	} catch (_error) {
		throw new ErrorWithStatus(
			'Invalid Token',
			'The provided token is invalid or expired',
			401,
			'auth',
		);
	}
};

// Function to validate a user's existence and status
export const validateUser = async (userId: string, iat?: number) => {
	const user = await User.checkUserExistenceByCustomId(userId);

	if (!user) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`User with id ${userId} not found!`,
			404,
			'user',
		);
	}

	if (user.isDeleted) {
		throw new ErrorWithStatus(
			'User Deleted',
			`User with id ${userId} is deleted!`,
			403,
			'user',
		);
	}

	if (user.status === 'blocked') {
		throw new ErrorWithStatus(
			'User Blocked',
			`User with id ${userId} is blocked!`,
			403,
			'user',
		);
	}

	if (
		user.passwordChangedAt &&
		User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat ?? 0)
	) {
		throw new ErrorWithStatus(
			'Unauthorized Access',
			"You're not authorized",
			401,
			'user',
		);
	}

	return user;
};
