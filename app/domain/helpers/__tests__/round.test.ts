import { expect, test } from "bun:test";
import { round } from "../round";

test("round()", () => {
	expect(round(2, "ceil-int")).toBe(2);
	expect(round(2, "ceil-half")).toBe(2);
	expect(round(2, "round-half")).toBe(2);

	expect(round(2.2, "ceil-int")).toBe(3);
	expect(round(2.2, "ceil-half")).toBe(2.5);
	expect(round(2.2, "round-half")).toBe(2);

	expect(round(2.3, "ceil-int")).toBe(3);
	expect(round(2.3, "ceil-half")).toBe(2.5);
	expect(round(2.3, "round-half")).toBe(2.5);

	expect(round(2.6, "ceil-int")).toBe(3);
	expect(round(2.6, "ceil-half")).toBe(3);
	expect(round(2.6, "round-half")).toBe(2.5);

	expect(round(2.8, "ceil-int")).toBe(3);
	expect(round(2.8, "ceil-half")).toBe(3);
	expect(round(2.8, "round-half")).toBe(3);
});
