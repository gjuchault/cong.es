import { Temporal } from "temporal-polyfill";

export function isDateBetweenIncl(
	date: Temporal.PlainDate,
	left: Temporal.PlainDate,
	right: Temporal.PlainDate,
): boolean {
	if (Temporal.PlainDate.compare(left, right) > 0) {
		return isDateBetweenIncl(date, right, left);
	}

	return (
		Temporal.PlainDate.compare(left, date) <= 0 &&
		Temporal.PlainDate.compare(date, right) <= 0
	);
}

export function isDate(input: string): boolean {
	try {
		return Temporal.PlainDate.from(input).toString() === input;
	} catch {
		return false;
	}
}
