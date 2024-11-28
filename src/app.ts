import cors from 'cors';
import express from 'express';
import type { Application, Request, Response } from 'express';
import {
	handleGlobalError,
	handleNotFound,
} from './app/middlewares/errorHandlers';
import router from './app/routes';

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
app.use('/api', router);

// Error handler for 404
app.use(handleNotFound);

// Global Error Handler
app.use(handleGlobalError);

export default app;
