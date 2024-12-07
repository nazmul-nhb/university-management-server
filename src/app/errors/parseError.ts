import mongoose from 'mongoose';
import {
	isCastError,
	isMongoDuplicateError,
	isParserError,
	isZodError,
} from './errorGuards';
import { handleZodErrors } from './zodError';
import { handleValidationError, handleCastError } from './mongoErrors';
import { handleGenericError, handleParserError } from './genericErrors';
import type { IErrorResponse } from '../types/interfaces';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';

/**
 * Processes an error of `unknown` type and returns a structured response.
 */
const parseError = (error: unknown): IErrorResponse => {
	const stack = error instanceof Error ? error.stack : 'Not Available';

	// Zod Validation Error
	if (isZodError(error)) {
		return handleZodErrors(error, stack);
	}
	// MongoDB Duplicate Error
	else if (isMongoDuplicateError(error)) {
		const key = Object.keys(error.keyValue)[0];
		return {
			statusCode: 409,
			name: `Duplicate: ${key} with “${error.keyValue[key]}” already exists!`,
			errorSource: [
				{
					path: key,
					message: `Duplicate value for ${key}: ${error.keyValue[key]}`,
				},
			],
			stack,
		};
	}
	// Mongoose ValidationError
	else if (error instanceof mongoose.Error.ValidationError) {
		return handleValidationError(error, stack);
	}
	// Mongoose CastError
	else if (isCastError(error)) {
		return handleCastError(error as mongoose.Error.CastError, stack);
	}
	// Express Body Parser Error
	else if (isParserError(error)) {
		return handleParserError(error, stack);
	} else if (error instanceof ErrorWithStatus) {
		return {
			statusCode: error.status,
			name: error.name,
			errorSource: [
				{
					path: error.path,
					message: error.message,
				},
			],
			stack: error.stack || 'No stack trace available',
		};
	}
	// General Error
	else if (error instanceof Error) {
		return handleGenericError(error, stack);
	}

	// Fallback for unknown errors
	return {
		statusCode: 500,
		name: 'An unknown error occurred!',
		errorSource: [],
		stack,
	};
};

export default parseError;
