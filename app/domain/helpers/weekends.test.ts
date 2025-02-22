import { expect, test } from "bun:test";
import { weekendsDays } from "./weekends";

test("weekendDays()", () => {
	expect(weekendsDays(2025)).toBe(104);
	expect(weekendsDays(2024)).toBe(104);
	expect(weekendsDays(2023)).toBe(105);
	expect(weekendsDays(2022)).toBe(105);
	expect(weekendsDays(2021)).toBe(104);
	expect(weekendsDays(2020)).toBe(104);
	expect(weekendsDays(2019)).toBe(104);
});
