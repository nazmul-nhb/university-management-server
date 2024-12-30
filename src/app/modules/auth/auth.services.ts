import bcrypt from 'bcrypt';
import type {
	TResetPayload,
	TChangePassword,
	TLoginResponse,
	TokenResponse,
	TUserLogin,
} from './auth.types';
import { User } from '../user/user.model';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import type { IJwtPayload } from '../../types/interfaces';
import { createToken, validateUser, verifyToken } from './auth.utilities';
import configs from '../../configs';
import { sendEmail } from '../../utilities/sendEmail';

const loginUser = async (payload: TUserLogin): Promise<TLoginResponse> => {
	// checking if the user is exist
	const user = await validateUser(payload.id);

	// checking if the password is correct
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

	// create token and sent to the  client
	const jwtPayload: IJwtPayload = {
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
	userData: IJwtPayload,
	payload: TChangePassword,
): Promise<null> => {
	// checking if the user is exist
	const user = await validateUser(userData.userId);

	const passwordMatched = await User.isPasswordMatched(
		payload.oldPassword,
		user?.password,
	);

	// checking if the password is correct
	if (!passwordMatched) {
		throw new ErrorWithStatus(
			'Not Matched Error',
			`Password did not match!`,
			403,
			'user',
		);
	}
	// hash new password
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

const refreshToken = async (token: string): Promise<TokenResponse> => {
	// checking if the given token is valid
	const decoded = verifyToken(token, configs.refreshSecret);
	const user = await validateUser(decoded.userId, decoded.iat);

	const jwtPayload = {
		userId: user.id,
		role: user.role,
	};

	const accessToken = createToken(
		jwtPayload,
		configs.accessSecret,
		configs.accessExpireTime,
	);

	return { accessToken };
};

const forgetPassword = async (userId: string) => {
	const user = await validateUser(userId);

	const jwtPayload = {
		userId: user.id,
		role: user.role,
	};

	const resetToken = createToken(jwtPayload, configs.accessSecret, '10m');

	const resetUILink = `${configs.resetPasswordLink}?id=${user.id}&token=${resetToken} `;

	sendEmail(user.email, resetUILink);
};

const resetPassword = async (payload: TResetPayload, token: string) => {
	// checking if the user is exist
	const user = await validateUser(payload.id);

	const decoded = verifyToken(configs.accessSecret, token);

	if (user.id !== decoded.userId) {
		throw new ErrorWithStatus(
			'Forbidden Access',
			'You are forbidden!',
			403,
			'auth',
		);
	}

	// hash new password
	const newHashedPassword = await bcrypt.hash(
		payload.newPassword,
		Number(configs.saltRounds),
	);

	await User.findOneAndUpdate(
		{ id: decoded.userId, role: decoded.role },
		{
			password: newHashedPassword,
			needsPasswordChange: false,
			passwordChangedAt: new Date(),
		},
	);
};

export const authServices = {
	loginUser,
	changePassword,
	refreshToken,
	forgetPassword,
	resetPassword,
};
