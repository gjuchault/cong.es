import { Temporal } from "temporal-polyfill";
import type { DayOff } from "~/domain/day-off";

export interface Day {
	date: Temporal.PlainDate;
	isCurrentMonth: boolean;
	isToday: boolean;
	isSelected: boolean;
	events: DayOff[];
}

export function startOfWeek(date: Temporal.PlainDate): Temporal.PlainDate {
	return date.add({ days: -1 * (date.dayOfWeek - 1) });
}

export function isInMonth(
	date: Temporal.PlainDate,
	yearMonth: Temporal.PlainYearMonth,
): boolean {
	return Temporal.PlainYearMonth.from(date).equals(yearMonth);
}

export function generateCalendar({
	bankHolidayNamePerPlainDateISO,
	yearMonth,
	selectedDay,
}: {
	yearMonth: Temporal.PlainYearMonth;
	bankHolidayNamePerPlainDateISO: Map<string, string>;
	selectedDay?: Temporal.PlainDate;
}): Day[] {
	const startDate = yearMonth.toPlainDate({ day: 1 });

	const firstDate = startOfWeek(startDate);

	const rows: Day[][] = [];
	let startedMonth = false;
	let baseDaysToAdd = 0;

	while (true) {
		const row: Day[] = [];
		let wentOverMonth = false;

		for (let j = 0; j < 7; j++) {
			const entry = firstDate.add({ days: baseDaysToAdd });
			const isCurrentMonth = isInMonth(entry, yearMonth);

			if (isCurrentMonth) {
				startedMonth = true;
			}

			if (isCurrentMonth === false && startedMonth) {
				wentOverMonth = true;
			}

			const bankHoliday = bankHolidayNamePerPlainDateISO.get(entry.toString());

			row.push({
				date: entry,
				isCurrentMonth,
				isSelected: selectedDay !== undefined && entry.equals(selectedDay),
				isToday: entry.equals(Temporal.Now.plainDateISO()),
				events: [
					...(bankHoliday
						? [
								{
									date: entry,
									type: "bank-holiday",
									name: bankHoliday,
								} satisfies DayOff,
							]
						: []),
				],
			});

			baseDaysToAdd += 1;
		}

		rows.push(row);

		if (wentOverMonth) {
			break;
		}
	}

	if (rows.at(-1)?.every((day) => day.isCurrentMonth === false)) {
		return rows.slice(0, -1).flat();
	}

	return rows.flat();
}
