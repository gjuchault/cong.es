import { Temporal } from "temporal-polyfill";
import { z } from "zod";

export const dayOffSchema = z.object({
	date: z.string().transform((value) => Temporal.PlainDate.from(value)),
	type: z.union([
		z.literal("bank-holiday"),
		z.literal("n-1"),
		z.literal("n"),
		z.literal("rtt"),
	]),
	name: z.string(),
});

export type DayOff = z.infer<typeof dayOffSchema>;
