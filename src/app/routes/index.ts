import { Router } from 'express';
import type { IRoute } from '../types/interfaces';
import { userRoutes } from '../modules/user/user.routes';
import { semesterRoutes } from '../modules/semester/semester.routes';
import { studentRoutes } from '../modules/student/student.routes';
import { facultyRoutes } from '../modules/faculty/faculty.routes';
import { departmentRoutes } from '../modules/department/department.routes';
import { courseRoutes } from '../modules/course/course.routes';
import { adminRoutes } from '../modules/admin/admin.routes';
import { teacherRoutes } from '../modules/teacher/teacher.routes';
import { registrationRoutes } from '../modules/registration/registration.routes';
import { offeredCourseRoutes } from '../modules/offeredCourse/offeredCourse.routes';
import { authRoutes } from '../modules/auth/auth.routes';

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
	{
		path: '/courses',
		route: courseRoutes,
	},
	{
		path: '/admins',
		route: adminRoutes,
	},
	{
		path: '/teachers',
		route: teacherRoutes,
	},
	{
		path: '/registrations',
		route: registrationRoutes,
	},
	{
		path: '/offered-courses',
		route: offeredCourseRoutes,
	},
	{
		path: '/auth',
		route: authRoutes,
	},
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
