import type { DaysOff, ExpandedDayOff } from "./day";
import { loopBetweenTwoDates } from "./helpers/loop-between-two-dates";

export function expandDaysOff(daysOff: DaysOff): ExpandedDayOff[] {
	const expandedDayOff: ExpandedDayOff[] = [];

	for (const day of loopBetweenTwoDates(daysOff.from, daysOff.to)) {
		const isStart = day.equals(daysOff.from);
		const isEnd = day.equals(daysOff.to);

		expandedDayOff.push({
			date: day,
			type: daysOff.type,
			isStart,
			isEnd,
			label: daysOff.name,
			fromHalfOnly: isStart && daysOff.fromHalfOnly,
			toHalfOnly: isEnd && daysOff.toHalfOnly,
		});
	}

	return expandedDayOff;
}
