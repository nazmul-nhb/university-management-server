import configs from '../../configs';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { authServices } from './auth.services';

const loginUser = catchAsync(async (req, res) => {
	const result = await authServices.loginUser(req.body);
	const { refreshToken, accessToken, needsPasswordChange } = result;

	res.cookie('refreshToken', refreshToken, {
		secure: configs.NODE_ENV === 'production',
		httpOnly: true,
	});

	sendResponse(
		res,
		'User',
		'create',
		{ accessToken, needsPasswordChange },
		'User logged in successfully!',
	);
});

const changePassword = catchAsync(async (req, res) => {
	const { ...passwordData } = req.body;

	const result = await authServices.changePassword(req.user, passwordData);

	sendResponse(
		res,
		'User',
		'create',
		result,
		'Password is updated successfully!',
	);
});

const refreshToken = catchAsync(async (req, res) => {
	const { refreshToken } = req.cookies;

	const result = await authServices.refreshToken(refreshToken);

	sendResponse(
		res,
		'User',
		'create',
		result,
		'Refresh Token is retrieved successfully!',
	);
});

export const authControllers = {
	loginUser,
	changePassword,
	refreshToken,
};
