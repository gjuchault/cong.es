import { Temporal } from "temporal-polyfill";
import type { EmployeeSettings } from "./employee-settings";
import { getRttPerYear, shouldBumpRtt } from "./rtt";
import { getLastDayOfMonth } from "./helpers/last-day-of-month";
import { loopBetweenTwoDates } from "./helpers/loop-between-two-dates";

export interface DayDetail {
	date: Temporal.PlainDate;

	// Δ
	rttDelta: number;
	nDelta: number;
	nMinusOneDelta: number;

	// Σ
	rttAtDate: number;
	nAtDate: number;
	nMinusOneAtDate: number;
}

function getEmployeeStartDayDetails(
	employeeSettings: EmployeeSettings,
): DayDetail {
	return {
		date: employeeSettings.startDate,
		rttDelta: 0,
		nDelta: 0,
		nMinusOneDelta: 0,

		rttAtDate: 0,
		nAtDate: 0,
		nMinusOneAtDate: 0,
	};
}

export function getDayDetails(
	date: Temporal.PlainDate,
	employeeSettings: EmployeeSettings,
	lastKnownStatus?: DayDetail,
): DayDetail {
	if (Temporal.PlainDate.compare(date, employeeSettings.startDate) < 0) {
		return {
			...getEmployeeStartDayDetails(employeeSettings),
			date,
		};
	}

	const lastStatus =
		lastKnownStatus ?? getEmployeeStartDayDetails(employeeSettings);
	const isFirstDateAlreadyPopulated = lastKnownStatus !== undefined;

	const nDaysOffPer30days =
		((employeeSettings.nPerYear ?? 25) / date.daysInYear) * 30;

	let rttAtDateIterator = lastStatus.rttAtDate;
	let nAtDateIterator = lastStatus.nAtDate;
	let nMinusOneAtDateIterator = lastStatus.nMinusOneAtDate;

	for (const newDay of loopBetweenTwoDates(lastStatus.date, date)) {
		if (isFirstDateAlreadyPopulated && newDay.equals(lastStatus.date)) {
			continue;
		}

		let rttDelta = 0;
		let nDelta = 0;
		let nMinusOneDelta = 0;

		if (shouldBumpRtt(newDay, employeeSettings)) {
			const rttPerYear = getRttPerYear(newDay.year, employeeSettings);

			// TODO: minus rtt stock lost
			rttDelta += rttPerYear;
		}

		if (newDay.since(employeeSettings.startDate).days % 30 === 0) {
			nDelta += nDaysOffPer30days;
		}

		if (
			newDay.equals(
				getLastDayOfMonth(new Temporal.PlainYearMonth(newDay.year, 5)),
			)
		) {
			nMinusOneDelta =
				// reset actual n-1
				-1 * nMinusOneAtDateIterator +
				// add N
				nAtDateIterator;
			nDelta = -1 * nAtDateIterator; // stock.n
		}

		rttAtDateIterator += rttDelta;
		nAtDateIterator += nDelta;
		nMinusOneAtDateIterator += nMinusOneDelta;

		if (newDay.equals(date)) {
			return {
				date,

				rttDelta: rttDelta,
				nDelta: nDelta,
				nMinusOneDelta: nMinusOneDelta,

				rttAtDate: rttAtDateIterator,
				nAtDate: nAtDateIterator,
				nMinusOneAtDate: nMinusOneAtDateIterator,
			};
		}
	}

	throw new Error("should not happen");
}
