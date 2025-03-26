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

export function getRealFirstLast(
	date1: Temporal.PlainDate | undefined,
	date2: Temporal.PlainDate | undefined,
): [Temporal.PlainDate | undefined, Temporal.PlainDate | undefined] {
	if (date1 === undefined && date2 === undefined) {
		return [undefined, undefined];
	}

	if (date2 === undefined || date1 === undefined) {
		return [date2 ?? date1, undefined];
	}

	if (Temporal.PlainDate.compare(date1, date2) > 0) {
		return [date2, date1];
	}

	return [date1, date2];
}
