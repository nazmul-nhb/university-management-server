import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import configs from '../../configs';
import type { TUser, UserModel } from './user.types';

const userSchema = new Schema<TUser>(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: 0,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		needsPasswordChange: {
			type: Boolean,
			default: true,
		},
		passwordChangedAt: {
			type: Date,
		},
		role: {
			type: String,
			enum: ['student', 'teacher', 'admin'],
		},
		status: {
			type: String,
			enum: ['in-progress', 'blocked'],
			default: 'in-progress',
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

// Pre Save Middleware/Hook (prehook)
userSchema.pre('save', async function (next) {
	// hash password and save into DB
	this.password = await bcrypt.hash(this.password, configs.saltRounds);
	next();
});

// Set '' after saving password
userSchema.post('save', function (doc, next) {
	doc.password = '';
	next();
});

userSchema.statics.checkUserExistenceByCustomId = async function (id: string) {
	return await User.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
	rawPassword: string,
	hashedPassword: string,
) {
	return await bcrypt.compare(rawPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
	passwordChangedTimestamp: Date,
	jwtIssuedTimestamp: number,
) {
	const passwordChangedTime =
		new Date(passwordChangedTimestamp).getTime() / 1000;
	return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
