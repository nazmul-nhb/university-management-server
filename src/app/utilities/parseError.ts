import { ZodError, ZodIssueCode } from 'zod';
import type { IDuplicateError, IParserError } from '../types/interfaces';
import type { CastError } from 'mongoose';
import { MongooseError } from 'mongoose';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';

type GenericError = { errorMessage: string; statusCode: number };

/**
 * Type guard to check if an error is a MongoDB Duplicate Error.
 */
const isMongoDuplicateError = (error: unknown): error is IDuplicateError => {
	return (
		'code' in (error as IDuplicateError) &&
		(error as IDuplicateError).code === 11000
	);
};

/**
 * Type guard to check if an error is a CastError from Mongoose.
 */
const isCastError = (error: unknown): error is CastError => {
	return (
		error instanceof MongooseError &&
		(error as CastError).kind === 'ObjectId'
	);
};

/**
 * Type guard to check if an error is an Express Body Parser Error.
 */
const isParserError = (error: unknown): error is IParserError => {
	return (
		'type' in (error as IParserError) &&
		(error as IParserError).type === 'entity.parse.failed'
	);
};

/**
 * Type guard to check if an error is a ZodError.
 */
const isZodError = (error: unknown): error is ZodError => {
	return error instanceof ZodError;
};

/**
 * Processes a Zod validation error and returns a formatted error message.
 *
 * @param error A ZodError instance.
 * @returns A formatted error message string.
 */
const processZodErrors = (error: ZodError): string => {
	return error.errors
		.map((err) => {
			switch (err.code) {
				case ZodIssueCode.invalid_type:
					return `Expected ${err.expected} for “${err.path.join('.')}” but received ${err.received}!`;
				case ZodIssueCode.invalid_enum_value:
					return `Invalid value for “${err.path.join('.')}”. Expected one of ${err.options.join(
						', ',
					)} but received ${err.received}.`;
				case ZodIssueCode.too_small:
					return `Value at “${err.path.join('.')}” is too small. Minimum: ${err.minimum}.`;
				case ZodIssueCode.too_big:
					return `Value at “${err.path.join('.')}” is too large. Maximum: ${err.maximum}.`;
				case ZodIssueCode.invalid_string:
					return `Invalid string format at “${err.path.join('.')}”. Expected ${err.validation}.`;
				default:
					return `${err.path.join('.')}: ${err.message}`;
			}
		})
		.join('; ');
};

/**
 * Processes an error of `unknown` type and returns both the error message and status code.
 *
 * @param error An error of `unknown` type.
 * @returns An object containing the error message and the corresponding status code.
 */
const parseError = (error: unknown): GenericError => {
	let errorMessage = 'Unexpected Error Occurred!';
	let statusCode = 500;

	// Check for Zod Validation Error
	if (isZodError(error)) {
		errorMessage = processZodErrors(error);
		statusCode = 400;
	}
	// Check for MongoDB Duplicate Error
	else if (isMongoDuplicateError(error)) {
		const path = Object.keys(error.keyValue)[0];
		errorMessage = `Duplicate: ${path} with “${error.keyValue[path]}” already exists!`;
		statusCode = 409;
	}
	// Check for Mongoose Cast Error (ObjectId issues)
	else if (isCastError(error)) {
		errorMessage = `Invalid ObjectId: ${error.value}`;
		statusCode = 400;
	}
	// Check for Express Body Parser Error
	else if (isParserError(error)) {
		errorMessage = 'Invalid JSON Payload!';
		statusCode = 400;
	}
	// Check for custom ErrorWithStatus
	else if (error instanceof ErrorWithStatus) {
		errorMessage = error.message;
		statusCode = error.status;
	}
	// General error handler
	else if (error instanceof Error) {
		errorMessage = error.message;
	} else {
		errorMessage = 'Unexpected Error Occurred!';
	}

	return { errorMessage, statusCode };
};

export default parseError;
