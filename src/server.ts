import app from './app';
import chalk from 'chalk';
import configs from './app/configs';

const bootStrap = async () => {
	try {
		// Connect to DB
		await configs.connectDB();

		// Listen to the Server
		app.listen(configs.port, () => {
			console.info(
				chalk.yellowBright(
					`👂 Server is Listening on Port: ${configs.port}`,
				),
			);
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(chalk.red(`🚫 Error Occurred: ${error.message}`));
		} else {
			console.error(chalk.red('🛑 Unknown Error Occurred!'));
		}
	}
};

bootStrap().catch(console.dir);
