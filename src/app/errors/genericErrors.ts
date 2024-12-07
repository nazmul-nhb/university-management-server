import type { ErrorWithStatus } from '../classes/ErrorWithStatus';
import type { IErrorResponse, IParserError } from '../types/interfaces';

export const handleErrorWithStatus = (
	error: ErrorWithStatus,
	stack?: string,
) => {
	return {
		statusCode: error.status,
		name: error.name,
		errorSource: [
			{
				path: error.path || 'unknown',
				message: error.message,
			},
		],
		stack,
	};
};

/**
 * Processes general Error objects.
 */
export const handleGenericError = (
	error: Error,
	stack?: string,
): IErrorResponse => {
	return {
		statusCode: 500,
		name: error.name || 'Unexpected Error!',
		errorSource: [
			{
				path: 'unknown',
				message: error.message,
			},
		],
		stack,
	};
};

/**
 * Processes Express Body Parser Errors.
 */
export const handleParserError = (
	_error: IParserError,
	stack?: string,
): IErrorResponse => {
	return {
		statusCode: 400,
		name: 'Invalid JSON Payload!',
		errorSource: [
			{
				path: 'req.body',
				message: 'The provided JSON payload is invalid.',
			},
		],
		stack,
	};
};

export const genericErrors = {
	handleErrorWithStatus,
	handleGenericError,
	handleParserError,
};
