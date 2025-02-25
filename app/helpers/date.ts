import { Temporal } from "temporal-polyfill";

export function isDateBetween(
	date: Temporal.PlainDate,
	left: Temporal.PlainDate,
	right: Temporal.PlainDate,
): boolean {
	if (Temporal.PlainDate.compare(left, right) > 0) {
		return isDateBetween(date, right, left);
	}

	return (
		Temporal.PlainDate.compare(left, date) <= 0 &&
		Temporal.PlainDate.compare(date, right) <= 0
	);
}
