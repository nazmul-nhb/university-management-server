import { MongooseError } from 'mongoose';
import type { CastError } from 'mongoose';
import type {
	IDuplicateError,
	IParserError,
	INestedError,
} from '../types/interfaces';

/**
 * Type guard to check if an error is a MongoDB Duplicate Error.
 */
export const isMongoDuplicateError = (
	error: unknown,
): error is IDuplicateError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as IDuplicateError).code === 11000
	);
};

/**
 * Type guard to check if an error is a Mongoose CastError.
 *
 * @param error An unknown error object.
 * @returns True if the error is a Mongoose CastError, false otherwise.
 */
export const isCastError = (error: unknown): error is CastError => {
	// Check for direct CastError
	if (
		error &&
		typeof error === 'object' &&
		'name' in error &&
		error.name === 'CastError'
	) {
		return true;
	}

	// Check if the error is a ValidationError containing CastError(s)
	if (
		error &&
		typeof error === 'object' &&
		'errors' in error &&
		error instanceof MongooseError
	) {
		const errors = (error as INestedError).errors;
		return Object.values(errors).some(
			(nestedError) =>
				typeof nestedError === 'object' &&
				nestedError !== null &&
				'name' in nestedError &&
				nestedError.name === 'CastError',
		);
	}

	return false;
};

/**
 * Type guard to check if an error is an Express Body Parser Error.
 */
export const isParserError = (error: unknown): error is IParserError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'type' in error &&
		(error as IParserError).type === 'entity.parse.failed'
	);
};

export const typeGuards = { isCastError, isMongoDuplicateError, isParserError };
