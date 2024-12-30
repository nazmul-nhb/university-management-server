export type TUserLogin = { id: string; password: string };

export type TChangePassword = { oldPassword: string; newPassword: string };

export type TResetPayload = { id: string; newPassword: string };

export type TLoginResponse = {
	accessToken: string;
	refreshToken: string;
	needsPasswordChange: boolean;
};

export type TokenResponse = { accessToken: string };
