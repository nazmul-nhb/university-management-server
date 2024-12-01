import chalk from 'chalk';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import progressEstimator from 'progress-estimator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up progress-estimator cache
const estimator = progressEstimator({ storagePath: join(__dirname, '.estimator') });

(async () => {
    const startTime = performance.now();

    try {
        await estimator(
            execa('rimraf', ['dist']).then(() => execa('tsc', [], { stdio: 'inherit' })),
            chalk.yellow('Building Your Express Application...')
        );

        const endTime = performance.now();

        const buildTime = ((endTime - startTime) / 1000).toFixed(2);

        console.info(chalk.green(`✓ Application was built in ${chalk.redBright(buildTime)} seconds!`));
    } catch (error) {
        console.error(chalk.red('🛑 Build Failed!'), error);
        process.exit(1);
    }
})();
