import cors from 'cors';
import express from 'express';
import type { Application, Request, Response } from 'express';
import { globalError, handleNotFound } from './app/middlewares/errorHandlers';
import router from './app/routes';
import sendResponse from './app/utilities/sendResponse';

// Create an Express App
const app: Application = express();

// * Respect CORS Policy
app.use(cors());

// * Use JSON Parser
app.use(express.json());

// TODO: Every place where ObjectId is used as type `string`, replace that `id: string` with `id: ObjectId`

// * Root/Test Route
app.get('/', (_req: Request, res: Response) => {
	sendResponse(res, 'N/A', 'get', 'Server is Running! 🏃');
});

// * Application Routes
app.use('/api', router);

// * Error handler for 404
app.use(handleNotFound);

// * Global Error Handler
app.use(globalError);

export default app;
