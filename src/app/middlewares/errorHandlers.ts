import type { NextFunction, Request, Response } from 'express';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';
import utilities from '../utilities';

export const handleGlobalError = (
	error: unknown,
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { processErrorMsgs, parseStatusCode } = utilities;

	// Log error msg in the server console
	console.error(`🛑 Error: ${processErrorMsgs(error)}`);

	// console.error(error);

	// Delegate to the default Express error handler
	// if the headers have already been sent to the client
	if (res.headersSent) {
		return next(error);
	}

	// Send error response with status code
	res.status(parseStatusCode(error)).json({
		success: false,
		message: processErrorMsgs(error),
	});
};

export const handleNotFound = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	const error = new ErrorWithStatus(
		'NotFoundError',
		`Requested End-Point “${req.method}: ${req.url}” Not Found!`,
		404,
	);
	next(error);
};
