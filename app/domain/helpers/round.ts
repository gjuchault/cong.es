import { z } from "zod";

export const roundingMethodSchema = z.union([
	z.literal("ceil-int"),
	z.literal("ceil-half"),
	z.literal("round-half"),
]);
export type RoundingMethod = z.infer<typeof roundingMethodSchema>;

export function round(
	input: number,
	roundingMethodOrUndefined?: RoundingMethod,
): number {
	const roundingMethod = roundingMethodOrUndefined ?? "ceil-half";

	switch (roundingMethod) {
		case "ceil-int":
			return Math.ceil(input);
		case "ceil-half":
			return Math.ceil(input * 2) / 2;
		case "round-half":
			return Math.round(input * 2) / 2;
	}
}
