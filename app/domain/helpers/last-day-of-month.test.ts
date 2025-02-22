import { expect, test } from "bun:test";
import { getLastDayOfMonth } from "./last-day-of-month";
import { Temporal } from "temporal-polyfill";

test("getLastDayOfMonth()", () => {
	expect(
		getLastDayOfMonth(
			Temporal.PlainYearMonth.from({ year: 2021, month: 1 }),
		).toString(),
	).toBe("2021-01-31");
	expect(
		getLastDayOfMonth(
			Temporal.PlainYearMonth.from({ year: 2021, month: 2 }),
		).toString(),
	).toBe("2021-02-28");
	expect(
		getLastDayOfMonth(
			Temporal.PlainYearMonth.from({ year: 2022, month: 4 }),
		).toString(),
	).toBe("2022-04-30");
});
