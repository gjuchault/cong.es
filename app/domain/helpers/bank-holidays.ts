import { Temporal } from "temporal-polyfill";
import rawBankHolidays from "../../../static-data/bank-holidays.json";
import type { DaysOff } from "../day";

export const bankHolidays = rawBankHolidays.map(
	([date, name]) =>
		({
			from: Temporal.PlainDate.from(date),
			to: Temporal.PlainDate.from(date),
			fromHalfOnly: false,
			toHalfOnly: false,
			type: "bankHoliday",
			name,
		}) satisfies DaysOff,
);
