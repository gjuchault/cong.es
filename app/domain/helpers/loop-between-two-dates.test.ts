import { expect, test } from "bun:test";
import { Temporal } from "temporal-polyfill";
import { loopBetweenTwoDates } from "./loop-between-two-dates";

test("loopBetweenTwoDates()", () => {
	const start = Temporal.PlainDate.from("2022-01-25");
	const end = Temporal.PlainDate.from("2022-02-04");

	const output = [];

	for (const day of loopBetweenTwoDates(start, end)) {
		output.push(day.toString());
	}

	expect(output.join(",")).toBe(
		[
			"2022-01-25",
			"2022-01-26",
			"2022-01-27",
			"2022-01-28",
			"2022-01-29",
			"2022-01-30",
			"2022-01-31",
			"2022-02-01",
			"2022-02-02",
			"2022-02-03",
			"2022-02-04",
		].join(","),
	);
});
