export type RoundingMethod = "ceil-int" | "ceil-half" | "round-half";

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
