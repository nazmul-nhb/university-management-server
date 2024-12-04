import cors from 'cors';
import express from 'express';
import type { Application, Request, Response } from 'express';
import {
	handleGlobalError,
	handleNotFound,
} from './app/middlewares/errorHandlers';
import router from './app/routes';
import sendResponse from './app/utilities/sendResponse';

const app: Application = express();

// * Respect CORS Policy
app.use(cors());
// * Use JSON Parser
app.use(express.json());

// TODO: Every places where ObjectId is used replaced that `id: string` with `id: ObjectId`

// * Root/Test Route
app.get('/', (_req: Request, res: Response) => {
	sendResponse(res, 200, 'Server is Running! 🏃');
});

// * Application Routes
app.use('/api', router);

// * Error handler for 404
app.use(handleNotFound);

// * Global Error Handler
app.use(handleGlobalError);

export default app;
