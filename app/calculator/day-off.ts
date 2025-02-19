import type { Temporal } from "temporal-polyfill";

export type DayOff = {
	date: Temporal.PlainDate;
	type: "bank-holiday" | "n-1" | "n" | "rtt";
	name: string;
};
