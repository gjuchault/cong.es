import { expect, test } from "bun:test";
import { Temporal } from "temporal-polyfill";
import { getRttPerYear, shouldBumpRtt } from "./rtt";
import { bankHolidays } from "./helpers/bank-holidays";

test("getRttAtDate()", () => {
	expect(
		getRttPerYear(2025, {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nOrNMinusOnePerYear: 25,
			startDate: Temporal.PlainDate.from("2025-02-02"),
		}),
	).toBe(7.5);
	expect(
		getRttPerYear(2025, {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nOrNMinusOnePerYear: 25,
			startDate: Temporal.PlainDate.from("2024-02-02"),
		}),
	).toBe(8);
	expect(
		getRttPerYear(2024, {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nOrNMinusOnePerYear: 25,
			startDate: Temporal.PlainDate.from("2023-02-02"),
		}),
	).toBe(9);
});

test("shouldBumpRtt()", () => {
	expect(
		shouldBumpRtt(Temporal.PlainDate.from("2025-04-01"), {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nOrNMinusOnePerYear: 25,
			startDate: Temporal.PlainDate.from("2024-02-02"),
		}),
	).toBe(false);

	expect(
		shouldBumpRtt(Temporal.PlainDate.from("2025-02-03"), {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nOrNMinusOnePerYear: 25,
			startDate: Temporal.PlainDate.from("2025-02-03"),
		}),
	).toBe(true);
	expect(
		shouldBumpRtt(Temporal.PlainDate.from("2025-01-01"), {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nOrNMinusOnePerYear: 25,
			startDate: Temporal.PlainDate.from("2024-02-02"),
		}),
	).toBe(true);
});
