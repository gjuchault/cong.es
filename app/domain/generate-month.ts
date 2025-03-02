import { Temporal } from "temporal-polyfill";
import type { Day, DaysOff } from "./day";
import { expandDaysOff } from "./expand-days-off";

function startOfWeek(date: Temporal.PlainDate): Temporal.PlainDate {
	return date.add({ days: -1 * (date.dayOfWeek - 1) });
}

function isInMonth(
	date: Temporal.PlainDate,
	yearMonth: Temporal.PlainYearMonth,
): boolean {
	return Temporal.PlainYearMonth.from(date).equals(yearMonth);
}

export function generateCalendar({
	bankHolidayNamePerPlainDateISO,
	yearMonth,
	daysOff,
}: {
	yearMonth: Temporal.PlainYearMonth;
	bankHolidayNamePerPlainDateISO: Map<string, string>;
	daysOff: DaysOff[]
}): Day[] {
	const startDate = yearMonth.toPlainDate({ day: 1 });

	const firstDate = startOfWeek(startDate);

	const rows: Day[][] = [];
	let startedMonth = false;
	let baseDaysToAdd = 0;

	const allExpandedDaysOffByDate = new Map(
		daysOff.flatMap((dayOff) => expandDaysOff(dayOff)).map((dayOff) => [
			dayOff.date.toString(),
			dayOff,
		]),
	);

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

			const events: Day["events"] = [];

			const bankHoliday = bankHolidayNamePerPlainDateISO.get(entry.toString());
			if (bankHoliday !== undefined) {
				events.push({
					date: entry,
					type: "bankHoliday",
					isStart: true,
					isEnd: true,
					label: bankHoliday,
					fromHalfOnly: false,
					toHalfOnly: false,
				})
			}

			const expandedDayOff = allExpandedDaysOffByDate.get(entry.toString());
			if (expandedDayOff !== undefined) {
				events.push({
					date: entry,
					type: expandedDayOff.type,
					isStart: expandedDayOff.isStart,
					isEnd: expandedDayOff.isEnd,
					label: expandedDayOff.label,
					fromHalfOnly: expandedDayOff.fromHalfOnly,
					toHalfOnly: expandedDayOff.toHalfOnly,
				})
			}


			row.push({
				date: entry,
				isCurrentMonth,
				isToday: entry.equals(Temporal.Now.plainDateISO()),
				events,
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
