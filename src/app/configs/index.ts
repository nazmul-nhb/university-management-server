import path from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const mongoUri = process.env.MONGO_URI as string;

/**
 * Connect to MongoDB using Mongoose
 */
export const connectDB = async (): Promise<void> => {
	try {
		// Throw error if there is no connection string
		if (!mongoUri) {
			throw new Error('MongoDB URI is Not Defined!');
		}

		await mongoose.connect(mongoUri);

		console.info(chalk.cyanBright('🔗 MongoDB is Connected!'));

		// Listen for established connection
		mongoose.connection.on('connected', () => {
			console.info(chalk.cyanBright('🔗 MongoDB is Connected!'));
		});

		// Listen for connection errors
		mongoose.connection.on('error', (err) => {
			console.error(
				chalk.red(`⛔ MongoDB Connection Error: ${err.message}`),
			);
		});

		// Optional: Listen for disconnection
		mongoose.connection.on('disconnected', () => {
			console.error(chalk.red('⛔ MongoDB is Disconnected!'));
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(chalk.red(`🚫 MongoDB Error: ${error.message}`));
		} else {
			console.error(chalk.red('🛑 Unknown Error Occurred!'));
		}
	}
};

export default {
	connectDB,
	port: process.env.PORT || 4242,
	NODE_ENV: process.env.NODE_ENV as string,
	nodeEnvironment: process.env.NODE_ENV as string,
	saltRounds: Number(process.env.SALT_ROUNDS as string),
	defaultPassword: process.env.DEFAULT_PASSWORD as string,
	accessSecret: process.env.JWT_ACCESS_SECRET as string,
	accessExpireTime: process.env.JWT_ACCESS_EXPIRES_IN as string,
	refreshSecret: process.env.JWT_REFRESH_SECRET as string,
	refreshExpireTime: process.env.JWT_REFRESH_EXPIRES_IN as string,
	resetPasswordLink: process.env.RESET_PASSWORD_LINK,
};
