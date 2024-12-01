import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { semesterRoutes } from '../modules/semester/semester.routes';
import type { IRoute } from '../types/interfaces';

const router = Router();

const routes: IRoute[] = [
	{
		path: '/users',
		route: userRoutes,
	},
	{
		path: '/semesters',
		route: semesterRoutes,
	},
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
