import chalk from 'chalk';
import parseError from '../utilities/parseError';
import sendResponse from '../utilities/sendResponse';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';
import type { ErrorRequestHandler, RequestHandler } from 'express';

/**
 * Middleware to Handle Route/Method Not Found Errors
 */
export const handleNotFound: RequestHandler = (req, _res, next) => {
	const error = new ErrorWithStatus(
		'NotFoundError',
		`Requested End-Point “${req.method}: ${req.url}” Not Found!`,
		404,
	);
	next(error);
};

/**
 * Middleware to Handle Global Errors
 */
export const handleGlobalError: ErrorRequestHandler = (
	error: unknown,
	_req,
	res,
	next,
) => {
	const { errorMessage, statusCode } = parseError(error);

	// * Log error msg in the server console
	console.error(chalk.redBright(`🛑 Error: ${errorMessage}`));

	// console.error(error);

	// * Delegate to the default Express error handler
	// ? if the headers have already been sent to the client
	if (res.headersSent) {
		return next(error);
	}

	// * Send error response with status code
	sendResponse(res, statusCode, errorMessage);
};
