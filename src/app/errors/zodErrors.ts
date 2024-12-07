import type { ZodError } from 'zod';
import { ZodIssueCode } from 'zod';
import type { IErrorResponse, IErrorSource } from '../types/interfaces';

/**
 * Processes Zod Validation Errors and returns a structured response.
 */
export const handleZodErrors = (
	error: ZodError,
	stack?: string,
): IErrorResponse => {
	const errorSource: IErrorSource[] = error.errors.map((zodIssue) => {
		const path = zodIssue.path.join('.');
		let message = zodIssue.message;

		switch (zodIssue.code) {
			case ZodIssueCode.invalid_type:
				message = `Expected ${zodIssue.expected} for “${path}” but received “${zodIssue.received}”!`;
				break;
			case ZodIssueCode.invalid_enum_value:
				message = `Invalid value for “${path}”. Expected one of: “${zodIssue.options.join(
					', ',
				)}” but received “${zodIssue.received}”!`;
				break;
			case ZodIssueCode.too_small:
				message = `Value for “${path}” is too small. Minimum: ${zodIssue.minimum}!`;
				break;
			case ZodIssueCode.too_big:
				message = `Value for “${path}” is too large. Maximum: ${zodIssue.maximum}!`;
				break;
			case ZodIssueCode.invalid_string:
				message = `Invalid string format for “${path}”. Expected ${zodIssue.validation}!`;
				break;
		}

		return { path, message };
	});

	return {
		statusCode: 400,
		name: 'Validation Error',
		errorSource,
		stack: error.stack || stack,
	};
};
