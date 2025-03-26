import type { Temporal } from "temporal-polyfill";
import { bankHolidays as rawBankHolidays } from "./helpers/bank-holidays";
import { loopBetweenTwoDates } from "./helpers/loop-between-two-dates";

const bankHolidays = new Set(
	rawBankHolidays.map(({ from }) => from.toString()),
);

export function getWorkingDays({
	from,
	to,
	startHalf,
	stopHalf,
}: {
	from: Temporal.PlainDate;
	to: Temporal.PlainDate;
	startHalf: boolean;
	stopHalf: boolean;
}): number {
	let workingDays = 0;

	for (const day of loopBetweenTwoDates(from, to)) {
		if (bankHolidays.has(day.toString())) {
			continue;
		}

		if (day.dayOfWeek !== 6 && day.dayOfWeek !== 7) {
			if (startHalf && day.equals(from)) {
				workingDays += 0.5;
				continue;
			}

			if (stopHalf && day.equals(to)) {
				workingDays += 0.5;
				continue;
			}

			workingDays += 1;
		}
	}

	return workingDays;
}
