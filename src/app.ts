import cors from 'cors';
import express from 'express';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import sendResponse from './app/utilities/sendResponse';
import type { Application, Request, Response } from 'express';
import { globalError, handleNotFound } from './app/middlewares/errorHandlers';

// Create an Express App
const app: Application = express();

// * Respect CORS Policy
app.use(cors());
// * Use Cookie Parser
app.use(cookieParser());
// * Use JSON Parser
app.use(express.json());

// TODO: Every place where ObjectId is used as type `string`, replace that `id: string` with `id: ObjectId`

// * Root/Test Route
app.get('/', (_req: Request, res: Response) => {
	sendResponse(res, 'N/A', 'get', null, 'Server is Running! 🏃');
});

// * Application Routes
app.use('/api', router);

// * Error handler for 404
app.use(handleNotFound);

// * Global Error Handler
app.use(globalError);

export default app;
