import { Temporal } from "temporal-polyfill";
import { z } from "zod";
import { daysOffSchema } from "./day";
import { roundingMethodSchema } from "./helpers/round";
import { rttTypeSchema } from "./rtt";

export const startDateSchema = z.string().transform((value) => Temporal.PlainDate.from(value));
export const nPerYearSchema = z.number().int().safe().gt(8);

export const employeeSettingsSchema = z.object({
	rttType: rttTypeSchema,
	startDate: startDateSchema,
	daysOff: z.array(daysOffSchema),
	nPerYear: nPerYearSchema.default(25),
	roundingMethod: roundingMethodSchema.default("ceil-half"),
});

export type EmployeeSettings = z.infer<typeof employeeSettingsSchema>;

export const defaultSettings = {
	daysOff: [],
	rttType: "218j/an",
	startDate: Temporal.Now.plainDateISO().with({ month: 1, day: 1 }),
	nPerYear: 25,
	roundingMethod: "ceil-half",
} satisfies EmployeeSettings;
