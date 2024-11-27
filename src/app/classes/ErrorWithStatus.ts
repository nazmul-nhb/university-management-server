/**
 * Create an instance of `Error` with custom properties
 *
 * @param name Error name
 * @param message Error message
 * @param status HTTP status code
 */
export class ErrorWithStatus extends Error {
	constructor(
		public name: string,
		public message: string,
		public status: number,
	) {
		super(message);
		this.name = name;
		this.status = status;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
