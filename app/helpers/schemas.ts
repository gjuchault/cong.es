import { Temporal } from "temporal-polyfill";
import { z } from "zod";

export const plainDateSchema = z.coerce
	.string()
	.transform((value) => Temporal.PlainDate.from(value));
