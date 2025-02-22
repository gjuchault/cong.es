import { Temporal } from "temporal-polyfill";
import rawBankHolidays from "../../../static-data/bank-holidays.json";
import type { DayOff } from "../day-off";

export const bankHolidays = rawBankHolidays.map(
	([date, name]) =>
		({
			date: Temporal.PlainDate.from(date),
			type: "bank-holiday",
			name,
		}) satisfies DayOff,
);
