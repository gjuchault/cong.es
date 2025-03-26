import { z } from "zod";
import { safe } from "./safe";

export const roundingMethodSchema = z.union([
	z.literal("ceil-int"),
	z.literal("ceil-half"),
	z.literal("round-half"),
	z.literal("double-digit"),
]);
export type RoundingMethod = z.infer<typeof roundingMethodSchema>;

export function round(
	input: number,
	roundingMethodOrUndefined?: RoundingMethod,
): number {
	const roundingMethod = roundingMethodOrUndefined ?? "ceil-half";

	let value: number;

	switch (roundingMethod) {
		case "ceil-int":
			value = Math.ceil(input);
			break;
		case "ceil-half":
			value = Math.ceil(input * 2) / 2;
			break;
		case "round-half":
			value = Math.round(input * 2) / 2;
			break;
		case "double-digit":
			value = Math.round(input * 100) / 100;
			break;
		default:
			throw new Error(
				`Unknown rounding method: ${roundingMethod satisfies never}`,
			);
	}

	return safe(value);
}
