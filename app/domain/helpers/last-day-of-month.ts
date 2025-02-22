import { Temporal } from "temporal-polyfill";

export function getLastDayOfMonth(
	date: Temporal.PlainYearMonth,
): Temporal.PlainDate {
	return Temporal.PlainDate.from({
		year: date.year,
		month: date.month + 1,
		day: 1,
	}).subtract({ days: 1 });
}
