import { Temporal } from "temporal-polyfill";
import { z } from "zod";
import type { DaysOff, ExpandedDayOff } from "./day";
import type { EmployeeSettings } from "./employee-settings";
import { round } from "./helpers/round";
import { weekendsDays } from "./helpers/weekends";
import { expandDaysOff } from "./expand-days-off";
import { bankHolidays } from "./helpers/bank-holidays";

export const rttTypeSchema = z.union([
	z.literal("no-rtt"),
	z.literal("35.5h/w"),
	z.literal("36h/w"),
	z.literal("36.5h/w"),
	z.literal("37h/w"),
	z.literal("37.5h/w"),
	z.literal("38h/w"),
	z.literal("38.5h/w"),
	z.literal("218j/an"),
]);

export type RttType = z.infer<typeof rttTypeSchema>;

function isDayOffImpactingRtt(year: number, dayOff: Pick<DaysOff, "from" | "type">): boolean {
	if (dayOff.from.year !== year) {
		return false;
	}

	// N and N-1 are counting, as a total bucket, not as individual days that were
	// took off
	if (dayOff.type !== "bankHoliday") {
		return false;
	}

	if (dayOff.from.dayOfWeek === 6 || dayOff.from.dayOfWeek === 7) {
		return false;
	}

	return true;
}

export function getRttPerMonth(
	year: number,
	{
		rttType,
		startDate,
		daysOff,
		nPerYear = 25,
		roundingMethod,
	}: EmployeeSettings,
): number {
	let rttPerYear = 0;

	const daysInYear = new Temporal.PlainDate(year, 1, 1).daysInYear;

	const weekends = weekendsDays(year);
	const workedDays =
		daysInYear -
		weekends -
		nPerYear -
		bankHolidays.filter((dayOff) => isDayOffImpactingRtt(year, dayOff)).length;
	const regularWorkTime = 35;

	switch (rttType) {
		case "35.5h/w":
			rttPerYear = workedDays * (35.5 - regularWorkTime);
			break;
		case "36h/w":
			rttPerYear = workedDays * (36 - regularWorkTime);
			break;
		case "36.5h/w":
			rttPerYear = workedDays * (36.5 - regularWorkTime);
			break;
		case "37h/w":
			rttPerYear = workedDays * (37 - regularWorkTime);
			break;
		case "37.5h/w":
			rttPerYear = workedDays * (37.5 - regularWorkTime);
			break;
		case "38h/w":
			rttPerYear = workedDays * (38 - regularWorkTime);
			break;
		case "38.5h/w":
			rttPerYear = workedDays * (38.5 - regularWorkTime);
			break;
		case "218j/an":
			rttPerYear = workedDays - 218;
			break;
		case "no-rtt":
			break;
		default:
			throw new Error(`Unknown RTT type: ${rttType satisfies never}`);
	}

	// Apparently, 218j/an is not impacted by pro-rata
	if (startDate.year === year && rttType !== "218j/an") {
		const proRata =
			(startDate.daysInYear - startDate.dayOfYear) / startDate.daysInYear;
		return round((rttPerYear * proRata) / 12, roundingMethod);
	}


	return round(rttPerYear / 12, roundingMethod);
}
