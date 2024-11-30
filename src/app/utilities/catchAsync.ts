import type { RequestHandler, Request, Response, NextFunction } from 'express';

const catchAsync = (asyncFn: RequestHandler) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await asyncFn(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};

export default catchAsync;
