import type { Temporal } from "temporal-polyfill";
import type { RttType } from "./rtt";
import type { DayOff } from "./day-off";
import type { RoundingMethod } from "./helpers/round";

export type EmployeeSettings = {
	rttType: RttType;
	startDate: Temporal.PlainDate;
	daysOff: DayOff[];
	nOrNMinusOnePerYear?: number;
	roundingMethod?: RoundingMethod;
};
