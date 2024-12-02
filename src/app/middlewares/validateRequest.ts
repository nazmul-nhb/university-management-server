import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';

/**
 *
 * @param schema A zod validation schema
 * @returns A promise
 */
const validateRequest = (schema: AnyZodObject) => {
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
