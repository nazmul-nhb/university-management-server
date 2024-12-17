import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject, ZodEffects } from 'zod';

/**
 * Middleware to validate the request body using a Zod schema.
 * @param schema A Zod validation schema/effects to validate the request body.
 * @returns An asynchronous Express middleware function.
 */
const validateRequest = (schema: AnyZodObject | ZodEffects<AnyZodObject>) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req.body);
			next();
		} catch (error) {
			next(error);
		}
	};
};

export default validateRequest;
