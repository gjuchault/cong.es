import { expect, test } from "bun:test";
import { safe } from "../safe";

test("safe()", () => {
	expect(safe(0.1 + 0.2)).toBe(0.3);
});
