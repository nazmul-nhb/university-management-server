import { z } from 'zod';
import type { AnyZodObject } from 'zod';

/**
 * Recursively makes all fields, including nested fields, optional in a Zod schema.
 *
 * @param schema - A Zod object schema to transform into a partial schema.
 * @returns A new Zod schema with all fields (including nested fields) made optional.
 */
export const createPartialSchema = (schema: AnyZodObject): AnyZodObject => {
	const shape = schema.shape;
	const partialShape: Record<string, z.ZodTypeAny> = {};

	for (const key in shape) {
		const field = shape[key];
		if (field instanceof z.ZodObject) {
			// Recursively make nested objects partial and optional
			partialShape[key] = createPartialSchema(field).optional();
		} else {
			// For other fields, just make them optional
			partialShape[key] = field.optional();
		}
	}

	return z.object(partialShape).partial();
};
