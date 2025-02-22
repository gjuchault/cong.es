import { Temporal } from "temporal-polyfill";

export function weekendsDays(year: number): number {
	let date = Temporal.PlainDate.from({ year, month: 1, day: 1 });
	let weekends = 0;
	while (date.year === year) {
		if (date.dayOfWeek === 6 || date.dayOfWeek === 7) {
			weekends += 1;
		}

		date = date.add({ days: 1 });
	}

	return weekends;
}
