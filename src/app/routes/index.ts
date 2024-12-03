import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { semesterRoutes } from '../modules/semester/semester.routes';
import type { IRoute } from '../types/interfaces';
import { studentRoutes } from '../modules/student/student.routes';
import { facultyRoutes } from '../modules/faculty/faculty.routes';
import { departmentRoutes } from '../modules/department/department.routes';

const router = Router();

const routes: IRoute[] = [
	{
		path: '/users',
		route: userRoutes,
	},
	{
		path: '/students',
		route: studentRoutes,
	},
	{
		path: '/semesters',
		route: semesterRoutes,
	},
	{
		path: '/faculties',
		route: facultyRoutes,
	},
	{
		path: '/departments',
		route: departmentRoutes,
	},
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
