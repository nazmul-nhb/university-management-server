import { Schema, model } from 'mongoose';
import type {
	StudentModel,
	TGuardian,
	TLocalGuardian,
	TStudent,
} from './student.types';
import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
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

const guardianSchema = new Schema<TGuardian>({
	fatherName: {
		type: String,
		trim: true,
		required: [true, 'Father Name is required'],
	},
	fatherOccupation: {
		type: String,
		trim: true,
		required: [true, 'Father occupation is required'],
	},
	fatherContactNo: {
		type: String,
		required: [true, 'Father Contact No is required'],
	},
	motherName: {
		type: String,
		required: [true, 'Mother Name is required'],
	},
	motherOccupation: {
		type: String,
		required: [true, 'Mother occupation is required'],
	},
	motherContactNo: {
		type: String,
		required: [true, 'Mother Contact No is required'],
	},
});

const localGuardianSchema = new Schema<TLocalGuardian>({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	occupation: {
		type: String,
		required: [true, 'Occupation is required'],
	},
	contactNo: {
		type: String,
		required: [true, 'Contact number is required'],
	},
	address: {
		type: String,
		required: [true, 'Address is required'],
	},
});

const studentSchema = new Schema<TStudent, StudentModel>(
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
		name: {
			type: userNameSchema,
			required: [true, 'Name is required'],
		},
		gender: {
			type: String,
			enum: {
				values: ['male', 'female', 'other'],
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
				values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
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
		guardian: {
			type: guardianSchema,
			required: [true, 'Guardian information is required'],
		},
		localGuardian: {
			type: localGuardianSchema,
			required: [true, 'Local guardian information is required'],
		},
		profileImg: { type: String },
		academicDepartment: {
			type: Schema.Types.ObjectId,
			ref: 'Department',
		},
		admissionSemester: {
			type: Schema.Types.ObjectId,
			ref: 'Semester',
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: {
			virtuals: true,
		},
	},
);

// virtual
studentSchema.virtual('fullName').get(function () {
	return (
		this?.name?.firstName + this?.name?.middleName + this?.name?.lastName
	);
});

// Query Middleware
studentSchema.pre('find', function (next) {
	this.find({ isDeleted: { $ne: true } });
	next();
});

studentSchema.pre('findOne', function (next) {
	this.find({ isDeleted: { $ne: true } });
	next();
});

studentSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
	next();
});

//creating a custom static method
studentSchema.statics.doesUserExist = async function (id: string) {
	const existingUser = await Student.findOne({ id });
	return existingUser;
};

studentSchema.statics.countByDept = async function (semesterId, departmentId) {
	const studentCount = await Student.countDocuments({
		admissionSemester: semesterId,
		academicDepartment: departmentId,
	});

	return studentCount;

	/**
	 * * All Fixed!
	 * ? This design has a serious flaw! What if a student admits into a new semester or in another dept. or both? - * Fixed
	 * ? The ID will still be an increment of the previous id, no matter which semester. - * Fixed
	 * ? Each semester should have started with 0001 id for each department. - * Fixed
	 * ? Operation should be run in Student Collection when department model is created! - * Fixed
	 * ? New Issue : ID should have department code at the beginning - * Fixed
	 * ! Or Each Department should have separate collection to avoid conflict
	 *
	 * ? Serious Issue : ID must have department code included. - * Fixed
	 * ? Otherwise there will be conflict with IDs of students from different departments. - * Fixed
	 */
};

studentSchema.pre('findOneAndUpdate', async function (next) {
	const query = this.getQuery();
	const studentExists = await Student.findOne(query);

	if (!studentExists) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`'This student does not exist!'`,
			404,
			'student',
		);
	}

	next();
});

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
