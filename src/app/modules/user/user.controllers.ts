import type { NextFunction, Request, Response } from 'express';
import { userServices } from './user.services';

const createStudent = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
        const { password, student: studentData } = req.body;

        // console.log(req.body);

		const result = await userServices.saveStudentIntoDB(
			password,
			studentData,
		);

		res.status(201).json({
			success: true,
			message: 'Student is created successfully!',
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

export const userControllers = {
	createStudent,
};
