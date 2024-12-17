import type { Response } from 'express';
import type { TCollection, TOperation, TResponseDetails } from '../types';

/**
 * Sends a formatted JSON response.
 *
 * @param res Response from Express.js from the specific controller.
 * @param collection The name of the collection (e.g., 'Student').
 * @param operation The operation type (e.g., 'create', 'get', 'update', 'delete').
 * @param data Optional data to include in the response.
 */
const sendResponse = <T>(
	res: Response,
	collection: TCollection,
	operation: TOperation,
	data?: T,
	customMessage?: string,
): void => {
	const { message, statusCode } = customMessage
		? { message: customMessage, statusCode: 200 }
		: generateResponse(collection, operation, data);

	const response = { success: true, message, ...(data && { data }) };

	res.status(statusCode).json(response);
};

/**
 * Generates message and status code based on the collection and operation type.
 *
 * @param collection The name of the collection (e.g., 'Student').
 * @param operation The operation type (e.g., 'create', 'get', 'update', 'delete').
 * @param data The data being operated upon.
 * @returns An object containing the formatted message and HTTP status code.
 */
const generateResponse = <T>(
	collection: TCollection,
	operation: TOperation,
	data?: T,
): TResponseDetails => {
	const isArray = Array.isArray(data);

	const regMessage =
		collection === 'Registration' ? 'Successfully Registered!' : '';

	let message = 'Operation Successful!',
		statusCode = 200;

	switch (operation) {
		case 'create':
			statusCode = 201;
			message = regMessage || `${collection} is created successfully!`;
			break;
		case 'get':
			message = isArray
				? `${collection}s are retrieved successfully!`
				: `${collection} is retrieved successfully!`;
			break;
		case 'update':
			message = `${collection} is updated successfully!`;
			break;
		case 'delete':
			message = `${collection} is deleted successfully!`;
			break;
		default:
			break;
	}

	return { message, statusCode };
};

export default sendResponse;
