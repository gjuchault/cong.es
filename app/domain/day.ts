import { Temporal } from "temporal-polyfill";
import { z } from "zod";
import type { BadgeProps } from "~/components/catalyst/badge";

export const daysOffSchema = z.object({
	from: z.string().transform((value) => Temporal.PlainDate.from(value)),
	to: z.string().transform((value) => Temporal.PlainDate.from(value)),
	fromHalfOnly: z.boolean().default(false),
	toHalfOnly: z.boolean().default(false),
	type: z.union([
		z.literal("bankHoliday"),
		z.literal("nMinusOne"),
		z.literal("n"),
		z.literal("rtt"),
	]),
	name: z.string(),
});

export type DaysOff = z.infer<typeof daysOffSchema>;

export interface ExpandedDayOff {
	type: DaysOff["type"];
	date: Temporal.PlainDate
	isStart: boolean;
	isEnd: boolean;
	label: string;
	fromHalfOnly: boolean;
	toHalfOnly: boolean;
}

export interface Day {
	date: Temporal.PlainDate;
	isCurrentMonth: boolean;
	isToday: boolean;
	events: ExpandedDayOff[];
}

export const dayOffTypeColor: Record<DaysOff["type"], BadgeProps["color"]> = {
	"bankHoliday": "blue",
	"nMinusOne": "indigo",
	"n": "emerald",
	"rtt": "yellow",
}
