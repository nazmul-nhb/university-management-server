import { Schema, model } from 'mongoose';
import type { TeacherModel, TTeacher } from './teacher.types';
import { bloodGroups, genders } from '../user/user.constants';
import type { TUserName } from '../user/user.types';

const userNameSchema = new Schema<TUserName>({
	firstName: {
		type: String,
		required: [true, 'First Name is required'],
		trim: true,
		maxlength: [20, 'Name can not be more than 20 characters'],
	},
	middleName: {
		type: String,
		trim: true,
	},
	lastName: {
		type: String,
		trim: true,
		required: [true, 'Last Name is required'],
		maxlength: [20, 'Name can not be more than 20 characters'],
	},
});

const teacherSchema = new Schema<TTeacher, TeacherModel>(
	{
		id: {
			type: String,
			required: [true, 'ID is required'],
			unique: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			required: [true, 'User id is required'],
			unique: true,
			ref: 'User',
		},
		designation: {
			type: String,
			required: [true, 'Designation is required'],
		},
		name: {
			type: userNameSchema,
			required: [true, 'Name is required'],
		},
		gender: {
			type: String,
			enum: {
				values: genders,
				message: '{VALUE} is not a valid gender',
			},
			required: [true, 'Gender is required'],
		},
		dateOfBirth: { type: Date },
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		contactNo: {
			type: String,
			required: [true, 'Contact number is required'],
		},
		emergencyContactNo: {
			type: String,
			required: [true, 'Emergency contact number is required'],
		},
		bloodGroup: {
			type: String,
			enum: {
				values: bloodGroups,
				message: '{VALUE} is not a valid blood group',
			},
		},
		presentAddress: {
			type: String,
			required: [true, 'Present address is required'],
		},
		permanentAddress: {
			type: String,
			required: [true, 'Permanent address is required'],
		},
		profileImg: { type: String },
		academicDepartment: {
			type: Schema.Types.ObjectId,
			required: [true, 'User id is required'],
			ref: 'User',
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
	},
);

// generating full name
teacherSchema.virtual('fullName').get(function () {
	return (
		this?.name?.firstName +
		'' +
		this?.name?.middleName +
		'' +
		this?.name?.lastName
	);
});

// filter out deleted documents
teacherSchema.pre('find', function (next) {
	this.find({ isDeleted: { $ne: true } });
	next();
});

teacherSchema.pre('findOne', function (next) {
	this.find({ isDeleted: { $ne: true } });
	next();
});

teacherSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
	next();
});

//checking if user is already exist!
teacherSchema.statics.doesUserExist = async function (id: string) {
	const existingUser = await Teacher.findOne({ id });
	return existingUser;
};

export const Teacher = model<TTeacher, TeacherModel>('Teacher', teacherSchema);
