import express from 'express';
import { userControllers } from './user.controllers';

const router = express.Router();

router.post('/create-student', userControllers.createStudent);

export const userRoutes = router;
