type GObject = Record<string, unknown>;

/**
 * Flattens a nested object into a dot notation format for MongoDB updates.
 *
 * @param source - The `object` to flatten.
 * @returns A `flattened object` with dot notation keys.
 */
export const flattenPayload = (source: GObject): GObject => {
	/**
	 * Recursively flattens an object, transforming nested structures into dot-notation keys.
	 *
	 * @param source - The `object` to be flattened.
	 * @param prefix - The prefix to prepend to each key. Used for nested objects.
	 * @returns A flattened version of the input object.
	 */
	const _flattenPayload = (source: GObject, prefix: string = ''): GObject => {
		const flattened: GObject = {};

		for (const [key, value] of Object.entries(source)) {
			// Construct the dot-notation key
			const dotKey = prefix ? `${prefix}.${key}` : key;

			if (value && typeof value === 'object' && !Array.isArray(value)) {
				// Recursively process nested objects
				Object.assign(
					flattened,
					_flattenPayload(value as GObject, dotKey),
				);
			} else {
				// Directly assign non-object values
				flattened[dotKey] = value;
			}
		}

		return flattened;
	};

	// Call the recursive function with an empty prefix initially
	return _flattenPayload(source);
};
