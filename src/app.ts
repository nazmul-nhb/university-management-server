import cors from 'cors';
import express from 'express';
import utilities from './app/utilities';
import type { Application, NextFunction, Request, Response } from 'express';
import { ErrorWithStatus } from './app/classes/ErrorWithStatus';

const app: Application = express();

// Respect CORS Policy
app.use(cors());
// Use JSON Parser
app.use(express.json());

// Root/Test Route
app.get('/', (_req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: 'Server is Running! 🏃',
	});
});

// Application Routes

// Error handler for 404
app.use((req: Request, _res: Response, next: NextFunction) => {
	const error = new ErrorWithStatus(
		'NotFoundError',
		`Requested End-Point “${req.method}: ${req.url}” Not Found!`,
		404,
	);
	next(error);
});

// Global Error Handler
app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
	const { processErrorMsgs, parseStatusCode } = utilities;

	// Log error msg in the server console
	console.error(`🛑 Error: ${processErrorMsgs(error)}`);

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
});

export default app;
