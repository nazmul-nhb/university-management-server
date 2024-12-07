import chalk from 'chalk';
import processErrors from '../errors/processErrors';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import configs from '../configs';

/**
 * Middleware to Handle Route/Method Not Found Errors
 */
export const handleNotFound: RequestHandler = (req, _res, next) => {
	const error = new ErrorWithStatus(
		'Not Found Error',
		`Requested End-Point “${req.method}: ${req.url}” Not Found!`,
		404,
		req.url,
	);
	next(error);
};

/**
 * Middleware to Handle Global Errors
 */
export const globalError: ErrorRequestHandler = (error, _req, res, next) => {
	const { statusCode, name, errorSource, stack } = processErrors(error);

	// * Log error msg in the server console
	console.error(
		chalk.redBright(
			`🛑 Error: ${errorSource.map((err) => err.message).join('; ')}`,
		),
	);

	// console.error(error);

	// * Delegate to the default Express error handler
	// ? if the headers have already been sent to the client
	if (res.headersSent) {
		return next(error);
	}

	// * Send error response with status code
	if (configs.nodeEnvironment === 'development' && stack) {
		res.status(statusCode).json({
			success: false,
			message: name,
			errorSources: errorSource,
			stack,
		});
		return;
	} else {
		res.status(statusCode).json({
			success: false,
			message: name,
			errorSources: errorSource,
		});
	}
};
