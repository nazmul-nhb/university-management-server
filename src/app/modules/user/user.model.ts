import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import configs from '../../configs';
import type { TUser } from './user.types';

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
		},
		needsPasswordChange: {
			type: Boolean,
			default: true,
		},
		role: {
			type: String,
			enum: ['student', 'faculty', 'admin'],
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
	this.password = await bcrypt.hash(
		this.password,
		Number(configs.saltRounds),
	);
	next();
});

// Set '' after saving password
userSchema.post('save', function (doc, next) {
	doc.password = '';
	next();
});

export const User = model<TUser>('User', userSchema);
