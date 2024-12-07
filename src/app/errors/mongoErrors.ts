import type { Error as MongoError } from 'mongoose';
import type {
	IDuplicateError,
	IErrorResponse,
	IErrorSource,
} from '../types/interfaces';

/**
 * Processes Mongoose Validation Errors and returns a structured response.
 */
export const handleValidationError = (
	error: MongoError.ValidationError,
	stack?: string,
): IErrorResponse => {
	const errorSource: IErrorSource[] = Object.values(error.errors).map(
		(val: MongoError.ValidatorError | MongoError.CastError) => ({
			path: val.path,
			message: val.message,
		}),
	);

	return {
		statusCode: 400,
		name: error.name || 'Validation Error',
		errorSource,
		stack,
	};
};

/**
 * Processes Mongoose Cast Errors and returns a structured response.
 */
export const handleCastError = (
	error: MongoError.CastError,
	stack?: string,
): IErrorResponse => {
	return {
		statusCode: 400,
		name: `Invalid ObjectId: “${error.value}” for “${error.path}”`,
		errorSource: [
			{
				path: error.path,
				message: `Invalid ObjectId value: ${error.value}`,
			},
		],
		stack,
	};
};

export const handleDuplicateError = (
	error: IDuplicateError,
	stack?: string,
) => {
	const key = Object.keys(error.keyValue)[0];
	return {
		statusCode: 409,
		name: 'MongoDB Duplicate Error',
		errorSource: [
			{
				path: key,
				message: `Duplicate value for ${key}: ${error.keyValue[key]}`,
			},
		],
		stack,
	};
};

export const mongoErrors = {
	handleValidationError,
	handleCastError,
	handleDuplicateError,
};
