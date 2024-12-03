import type { Response } from 'express';

/**
 *
 * @param res Response from Express.js from the Specific Controller
 * @param statusCode HTTP Status Code
 * @param message Custom Message Message
 * @param data Optional Data to send
 */
const sendResponse = <T>(
	res: Response,
	statusCode: number,
	message: string,
	data?: T,
): void => {
	const success = statusCode >= 200 && statusCode < 300;

	const response = { success, message, ...(data && { data }) };

	res.status(statusCode).json(response);
};

export default sendResponse;
