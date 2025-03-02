import { expect, test } from "bun:test";
import { Temporal } from "temporal-polyfill";
import { bankHolidays } from "../helpers/bank-holidays";
import { getRttPerMonth } from "../rtt";

test("getRttAtDate()", () => {
	expect(
		getRttPerMonth(2025, {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nPerYear: 25,
			startDate: Temporal.PlainDate.from("2025-02-02"),
			roundingMethod: "double-digit",
		}),
	).toBe(0.67);
	expect(
		getRttPerMonth(2025, {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nPerYear: 25,
			startDate: Temporal.PlainDate.from("2024-02-02"),
			roundingMethod: "double-digit",
		}),
	).toBe(0.67);
	expect(
		getRttPerMonth(2024, {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nPerYear: 25,
			startDate: Temporal.PlainDate.from("2023-02-02"),
			roundingMethod: "double-digit",
		}),
	).toBe(0.75);
});
