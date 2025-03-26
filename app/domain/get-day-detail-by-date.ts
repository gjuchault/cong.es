import type { Day } from "./day";
import type { EmployeeSettings } from "./employee-settings";
import { type DayDetail, getDayDetails } from "./get-day-details";

export function getDayDetailByDate({
	calendar,
	employeeSettings,
}: { calendar: Day[]; employeeSettings: EmployeeSettings }): Map<
	string,
	DayDetail
> {
	const dayDetailByDate = new Map<string, DayDetail>();

	let lastKnownDayDetail: DayDetail | undefined = undefined;

	for (const day of calendar) {
		const dayDetail = getDayDetails(
			day.date,
			employeeSettings,
			lastKnownDayDetail,
		);

		dayDetailByDate.set(day.date.toString(), dayDetail);
		lastKnownDayDetail = dayDetail;
	}

	return dayDetailByDate;
}
