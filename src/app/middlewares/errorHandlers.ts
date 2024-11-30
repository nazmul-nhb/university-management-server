import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';
import parseError from '../utilities/parseError';
import sendResponse from '../utilities/sendResponse';

export const handleNotFound: RequestHandler = (req, _res, next) => {
	const error = new ErrorWithStatus(
		'NotFoundError',
		`Requested End-Point “${req.method}: ${req.url}” Not Found!`,
		404,
	);
	next(error);
};

export const handleGlobalError: ErrorRequestHandler = (
	error: unknown,
	_req,
	res,
	next,
) => {
	const { errorMessage, statusCode } = parseError(error);

	// Log error msg in the server console
	console.error(`🛑 Error: ${errorMessage}`);

	// console.error(error);

	// Delegate to the default Express error handler
	// if the headers have already been sent to the client
	if (res.headersSent) {
		return next(error);
	}

	// Send error response with status code
	sendResponse(res, statusCode, false, errorMessage);
};
