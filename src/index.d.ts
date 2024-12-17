import type { IJwtPayload } from './app/types/interfaces';

declare global {
	namespace Express {
		interface Request {
			user: IJwtPayload;
		}
	}
}
