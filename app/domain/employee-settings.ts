import { Temporal } from "temporal-polyfill";
import { rttTypeSchema } from "./rtt";
import { dayOffSchema } from "./day-off";
import { roundingMethodSchema } from "./helpers/round";
import { z } from "zod";
import { bankHolidays } from "./helpers/bank-holidays";

export const employeeSettingsSchema = z.object({
	rttType: rttTypeSchema,
	startDate: z.string().transform((value) => Temporal.PlainDate.from(value)),
	daysOff: z.array(dayOffSchema),
	nPerYear: z.number().int().safe().gt(8).default(25),
	roundingMethod: roundingMethodSchema.default("ceil-half"),
});

export type EmployeeSettings = z.infer<typeof employeeSettingsSchema>;

export const defaultSettings = {
	daysOff: bankHolidays,
	rttType: "218j/an",
	startDate: Temporal.Now.plainDateISO().with({ month: 1, day: 1 }),
	nPerYear: 25,
	roundingMethod: "ceil-half",
} satisfies EmployeeSettings;
