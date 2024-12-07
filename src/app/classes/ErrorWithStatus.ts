/**
 * Create an instance of `Error` with custom properties
 *
 * @param name Error name
 * @param message Error message
 * @param status HTTP status code
 * @param path Path where the error occurred
 */
export class ErrorWithStatus extends Error {
	constructor(
		public name: string,
		public message: string,
		public status: number,
		public path: string = '',
	) {
		super(message);
		this.name = name;
		this.status = status;
		this.path = path;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
