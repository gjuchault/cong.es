import { Temporal } from "temporal-polyfill";

export function* loopBetweenTwoDates(
	start: Temporal.PlainDate,
	end: Temporal.PlainDate,
): Generator<Temporal.PlainDate, void, void> {
	const step = Temporal.PlainDate.compare(start, end) <= 0 ? 1 : -1;

	let current = start;
	while (Temporal.PlainDate.compare(current, end) !== step) {
		yield current;
		current = current.add({ days: step });
	}
}
