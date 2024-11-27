import type { z } from 'zod';
import type { zodUser } from './user.validation';

export type TUser = z.infer<typeof zodUser.userCreationSchema>;
export type TUpdateUser = z.infer<typeof zodUser.userUpdateSchema>;
