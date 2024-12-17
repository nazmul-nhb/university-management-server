import bcrypt from 'bcrypt';
import type { TLoginUser } from './auth.types';
import { User } from '../user/user.model';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { createToken } from './auth.utilities';
import configs from '../../configs';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
	// checking if the user is exist
	const user = await User.checkUserExistenceByCustomId(payload.id);

	if (!user) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No user found with id: ${payload.id}!`,
			404,
			'user',
		);
	}
	// checking if the user is already deleted

	const isDeleted = user?.isDeleted;

	if (isDeleted) {
		throw new ErrorWithStatus(
			'User Deleted',
			`User with id: ${payload.id} is deleted!`,
			403,
			'user',
		);
	}

	// checking if the user is blocked

	const userStatus = user?.status;

	if (userStatus === 'blocked') {
		throw new ErrorWithStatus(
			'User Blocked',
			`User with id: ${payload.id} is blocked!`,
			403,
			'user',
		);
	}

	//checking if the password is correct

	const passwordMatched = await User.isPasswordMatched(
		payload?.password,
		user?.password,
	);

	if (!passwordMatched) {
		throw new ErrorWithStatus(
			'Not Matched Error',
			`Password did not match!`,
			403,
			'user',
		);
	}

	//create token and sent to the  client
	const jwtPayload = {
		userId: user.id,
		role: user.role,
	};

	const accessToken = createToken(
		jwtPayload,
		configs.accessSecret,
		configs.accessExpireTime,
	);

	const refreshToken = createToken(
		jwtPayload,
		configs.refreshSecret,
		configs.refreshExpireTime,
	);

	return {
		accessToken,
		refreshToken,
		needsPasswordChange: user?.needsPasswordChange,
	};
};

const changePassword = async (
	userData: JwtPayload,
	payload: { oldPassword: string; newPassword: string },
) => {
	// checking if the user is exist
	const user = await User.checkUserExistenceByCustomId(userData.userId);

	if (!user) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`User with id ${userData.userId} not found!`,
			404,
			'user',
		);
	}

	// checking if the user is already deleted
	if (user?.isDeleted) {
		throw new ErrorWithStatus(
			'User Deleted',
			`User with id ${user.id} is deleted!`,
			403,
			'user',
		);
	}

	// checking if the user is blocked
	if (user?.status === 'blocked') {
		throw new ErrorWithStatus(
			'Not Matched Error',
			`User with id ${user.id} is blocked!`,
			403,
			'user',
		);
	}

	const passwordMatched = await User.isPasswordMatched(
		payload.oldPassword,
		user?.password,
	);

	//checking if the password is correct
	if (!passwordMatched) {
		throw new ErrorWithStatus(
			'Not Matched Error',
			`Password did not match!`,
			403,
			'user',
		);
	}
	//hash new password
	const newHashedPassword = await bcrypt.hash(
		payload.newPassword,
		Number(configs.saltRounds),
	);

	await User.findOneAndUpdate(
		{
			id: userData.userId,
			role: userData.role,
		},
		{
			password: newHashedPassword,
			needsPasswordChange: false,
			passwordChangedAt: new Date(),
		},
	);

	return null;
};

const refreshToken = async (token: string) => {
	// checking if the given token is valid
	const decoded = jwt.verify(token, configs.refreshSecret) as JwtPayload;

	const { userId, iat } = decoded;

	// checking if the user is exist
	const user = await User.checkUserExistenceByCustomId(userId);

	if (!user) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`User with id ${userId} not found!`,
			404,
			'user',
		);
	}
	// checking if the user is already deleted
	const isDeleted = user?.isDeleted;

	if (isDeleted) {
		throw new ErrorWithStatus(
			'User Deleted',
			`User with id ${userId} is deleted!`,
			403,
			'user',
		);
	}

	// checking if the user is blocked
	const userStatus = user?.status;

	if (userStatus === 'blocked') {
		throw new ErrorWithStatus(
			'Not Matched Error',
			`User with id ${userId} is blocked!`,
			403,
			'user',
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
			`You're not authorized!`,
			403,
			'user',
		);
	}

	const jwtPayload = {
		userId: user.id,
		role: user.role,
	};

	const accessToken = createToken(
		jwtPayload,
		configs.accessSecret,
		configs.accessExpireTime,
	);

	return {
		accessToken,
	};
};

export const authServices = {
	loginUser,
	changePassword,
	refreshToken,
};
