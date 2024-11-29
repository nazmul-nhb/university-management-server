import type { NextFunction, Request, Response } from 'express';
import { userServices } from './user.services';
import sendResponse from '../../utilities/sendResponse';

const createStudent = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { password, student: studentData } = req.body;

		const newStudent = await userServices.saveStudentIntoDB(
			password,
			studentData,
		);

		sendResponse(
			res,
			201,
			true,
			'Student is created successfully!',
			newStudent,
		);
	} catch (err) {
		next(err);
	}
};

export const userControllers = {
	createStudent,
};
