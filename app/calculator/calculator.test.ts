import { expect, test } from "bun:test";
import { getDayDetails } from "./calculator";
import { Temporal } from "temporal-polyfill";
import { bankHolidays } from "./helpers/bank-holidays";

test("getDayDetails", () => {
	expect(
		getDayDetails(Temporal.PlainDate.from("2025-04-01"), {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nOrNMinusOnePerYear: 25,
			startDate: Temporal.PlainDate.from("2025-02-02"),
		}),
	).toMatchObject({
		date: Temporal.PlainDate.from("2025-04-01"),
		rttAtDate: 7.5,
		nAtDate: expect.closeTo(4.11),
		nMinusOneAtDate: 0,

		rttDelta: 0,
		nDelta: 0,
		nMinusOneDelta: 0,
	});

	expect(
		getDayDetails(Temporal.PlainDate.from("2025-05-05"), {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nOrNMinusOnePerYear: 25,
			startDate: Temporal.PlainDate.from("2025-02-02"),
		}),
	).toMatchObject({
		date: Temporal.PlainDate.from("2025-04-01"),
		rttAtDate: 7.5,
		nAtDate: expect.closeTo(8.22),
		nMinusOneAtDate: 0,

		rttDelta: 0,
		nDelta: 0,
		nMinusOneDelta: 0,
	});

	expect(
		getDayDetails(Temporal.PlainDate.from("2025-05-31"), {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nOrNMinusOnePerYear: 25,
			startDate: Temporal.PlainDate.from("2025-02-02"),
		}),
	).toMatchObject({
		date: Temporal.PlainDate.from("2025-04-01"),
		rttAtDate: 7.5,
		nAtDate: 0,
		nMinusOneAtDate: expect.closeTo(8.22),

		rttDelta: 0,
		nDelta: expect.closeTo(-8.22),
		nMinusOneDelta: expect.closeTo(8.22),
	});
});
