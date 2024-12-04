export class PayloadFlattener {
	/**
	 * The flattened payload, where nested objects are flattened to dot-notation keys.
	 */
	public flattenedPayload: Record<string, unknown>;

	/**
	 * Constructor that accepts a `payload` as object and flattens it (dot notation).
	 *
	 * @param payload - The object to be flattened.
	 */
	constructor(payload: Record<string, unknown>) {
		// Flatten the payload immediately when the object is instantiated
		this.flattenedPayload = this._flattenPayload(payload);
	}

	/**
	 * Recursively flattens an object, transforming nested structures into dot-notation keys.
	 *
	 * @param source - The object to be flattened.
	 * @param prefix - The prefix to prepend to each key. Used for nested objects.
	 * @returns A flattened version of the input object.
	 */
	private _flattenPayload(
		source: Record<string, unknown>,
		prefix: string = '',
	): Record<string, unknown> {
		const flattened: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(source)) {
			// Construct the dot-notation key
			const dotKey = prefix ? `${prefix}.${key}` : key;

			if (value && typeof value === 'object' && !Array.isArray(value)) {
				// Recursively process nested objects
				Object.assign(
					flattened,
					this._flattenPayload(
						value as Record<string, unknown>,
						dotKey,
					),
				);
			} else {
				// Directly assign non-object values
				flattened[dotKey] = value;
			}
		}

		return flattened;
	}
}
