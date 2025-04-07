import { expect, test } from "bun:test";
import { Temporal } from "temporal-polyfill";
import { getDayDetails } from "../get-day-details";
import { bankHolidays } from "../helpers/bank-holidays";

test("getDayDetails", () => {
	expect(
		getDayDetails(Temporal.PlainDate.from("2025-04-01"), {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nPerYear: 25,
			startDate: Temporal.PlainDate.from("2025-02-02"),
			roundingMethod: "ceil-half",
		}),
	).toMatchObject({
		date: Temporal.PlainDate.from("2025-04-01"),
		rttAtDate: 2,
		nAtDate: expect.closeTo(4.17),
		nMinusOneAtDate: 0,

		rttDelta: 0,
		nDelta: 0,
		nMinusOneDelta: 0,
	});

	expect(
		getDayDetails(Temporal.PlainDate.from("2025-05-05"), {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nPerYear: 25,
			startDate: Temporal.PlainDate.from("2025-02-02"),
			roundingMethod: "ceil-half",
		}),
	).toMatchObject({
		date: Temporal.PlainDate.from("2025-04-01"),
		rttAtDate: 4,
		nAtDate: expect.closeTo(8.33),
		nMinusOneAtDate: 0,

		rttDelta: 0,
		nDelta: 0,
		nMinusOneDelta: 0,
	});

	expect(
		getDayDetails(Temporal.PlainDate.from("2025-05-31"), {
			rttType: "218j/an",
			daysOff: bankHolidays,
			nPerYear: 25,
			startDate: Temporal.PlainDate.from("2025-02-02"),
			roundingMethod: "ceil-half",
		}),
	).toMatchObject({
		date: Temporal.PlainDate.from("2025-04-01"),
		rttAtDate: 4,
		nAtDate: 0,
		nMinusOneAtDate: expect.closeTo(8.33),

		rttDelta: 0,
		nDelta: expect.closeTo(-8.33),
		nMinusOneDelta: expect.closeTo(8.33),
	});

	const firstDate = getDayDetails(Temporal.PlainDate.from("2025-02-01"), {
		rttType: "218j/an",
		daysOff: bankHolidays,
		nPerYear: 25,
		startDate: Temporal.PlainDate.from("2025-02-01"),
		roundingMethod: "ceil-half",
	});

	expect(structuredClone(firstDate)).toMatchObject({
		date: Temporal.PlainDate.from("2025-02-02"),
		rttAtDate: 1,
		nAtDate: expect.closeTo(2.08),
		nMinusOneAtDate: 0,

		rttDelta: expect.closeTo(1),
		nDelta: expect.closeTo(2.08),
		nMinusOneDelta: 0,
	});

	expect(
		getDayDetails(
			Temporal.PlainDate.from("2025-02-02"),
			{
				rttType: "218j/an",
				daysOff: bankHolidays,
				nPerYear: 25,
				startDate: Temporal.PlainDate.from("2025-02-01"),
				roundingMethod: "ceil-half",
			},
			firstDate,
		),
	).toMatchObject({
		date: Temporal.PlainDate.from("2025-02-02"),
		rttAtDate: 1,
		nAtDate: expect.closeTo(2.08),
		nMinusOneAtDate: 0,

		rttDelta: 0,
		nDelta: 0,
		nMinusOneDelta: 0,
	});

	expect(
		getDayDetails(
			Temporal.PlainDate.from("2025-09-01"),
			{
				rttType: "218j/an",
				daysOff: [
					...bankHolidays,
					{
						from: Temporal.PlainDate.from("2025-08-01"),
						to: Temporal.PlainDate.from("2025-08-02"),
						fromHalfOnly: false,
						toHalfOnly: false,
						type: "rtt",
						name: "Test",
					},
					{
						from: Temporal.PlainDate.from("2025-08-02"),
						to: Temporal.PlainDate.from("2025-08-03"),
						fromHalfOnly: false,
						toHalfOnly: false,
						type: "n",
						name: "Test",
					},
					{
						from: Temporal.PlainDate.from("2025-08-03"),
						to: Temporal.PlainDate.from("2025-08-04"),
						fromHalfOnly: false,
						toHalfOnly: false,
						type: "nMinusOne",
						name: "Test",
					},
				],
				nPerYear: 25,
				startDate: Temporal.PlainDate.from("2025-01-01"),
				roundingMethod: "ceil-half",
			},
			firstDate,
		),
	).toMatchObject({
		date: Temporal.PlainDate.from("2025-09-01"),
		rttAtDate: 7,
		nAtDate: expect.closeTo(6.25),
		nMinusOneAtDate: expect.closeTo(7.33),

		rttDelta: 0,
		nDelta: 0,
		nMinusOneDelta: 0,
	});
});
