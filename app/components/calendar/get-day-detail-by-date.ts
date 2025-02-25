import { type DayDetail, getDayDetails } from "~/domain/calculator";
import type { EmployeeSettings } from "~/domain/employee-settings";
import type { Day } from "./generate-month";

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
