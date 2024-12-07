import { typeGuards } from './errorGuards';
import { Error as MongoError } from 'mongoose';
import { mongoErrors } from './mongoErrors';
import { handleZodErrors } from './zodErrors';
import { genericErrors } from './genericErrors';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';
import type { IErrorResponse } from '../types/interfaces';

/**
 * Processes an error of `unknown` type and returns a structured response.
 * @param error An error of `unknown` type.
 */
const processErrors = (error: unknown): IErrorResponse => {
	const stack = error instanceof Error ? error.stack : 'Stack Not Available!';

	// Zod Validation Error
	if (typeGuards.isZodError(error)) {
		return handleZodErrors(error, stack);
	}
	// MongoDB Duplicate Error
	else if (typeGuards.isMongoDuplicateError(error)) {
		return mongoErrors.handleDuplicateError(error, stack);
	}
	// Mongoose ValidationError
	else if (error instanceof MongoError.ValidationError) {
		return mongoErrors.handleValidationError(error, stack);
	}
	// Mongoose CastError
	else if (typeGuards.isCastError(error)) {
		return mongoErrors.handleCastError(
			error as MongoError.CastError,
			stack,
		);
	}
	// Express Body Parser Error
	else if (typeGuards.isParserError(error)) {
		return genericErrors.handleParserError(error, stack);
	}
	// Custom ErrorWithStatus
	else if (error instanceof ErrorWithStatus) {
		return genericErrors.handleErrorWithStatus(error, stack);
	}
	// General Error
	else if (error instanceof Error) {
		return genericErrors.handleGenericError(error, stack);
	}

	// Fallback for unknown errors
	return {
		statusCode: 500,
		name: 'Unknown Error!',
		errorSource: [
			{ path: 'unknown', message: 'An Unknown Error Occurred' },
		],
		stack,
	};
};

export default processErrors;
