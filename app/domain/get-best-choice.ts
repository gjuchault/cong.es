import type { Temporal } from "temporal-polyfill";
import { isDateBetweenIncl } from "~/helpers/date";
import { safe } from "./helpers/safe";

export function getBestChoice({
	startDate,
	quantity,
	nMinusOneAtDate,
	rttAtDate,
}: {
	startDate: Temporal.PlainDate;
	quantity: number;
	nAtDate: number;
	nMinusOneAtDate: number;
	rttAtDate: number;
}): {
	useRtt: number;
	useNMinusOne: number;
	useN: number;
} {
	const jan1st = startDate.with({ day: 1, month: 1 });
	const may31th = startDate.with({ day: 31, month: 5 });

	let useRtt = 0;
	let useNMinusOne = 0;
	let useN = 0;

	if (isDateBetweenIncl(startDate, jan1st, may31th)) {
		// use N-1, they will expire sooner than RTT
		useNMinusOne = Math.min(quantity, nMinusOneAtDate);

		// Fallback to RTT
		if (quantity - useNMinusOne > 0) {
			useRtt = Math.min(quantity - useNMinusOne, rttAtDate);
		}

		// Fallback to N
		if (quantity - useNMinusOne - useRtt > 0) {
			useN = quantity - useNMinusOne - useRtt;
		}

		return {
			useRtt: safe(useRtt),
			useNMinusOne: safe(useNMinusOne),
			useN: safe(useN),
		};
	}

	// use RTT, they will expire sooner than N-1
	useRtt = Math.min(quantity, rttAtDate);

	// Fallback to N-1
	if (quantity - useRtt > 0) {
		useNMinusOne = Math.min(quantity - useRtt, nMinusOneAtDate);
	}

	// Fallback to N
	if (quantity - useRtt - useNMinusOne > 0) {
		useN = quantity - useRtt - useNMinusOne;
	}

	return {
		useRtt: safe(useRtt),
		useNMinusOne: safe(useNMinusOne),
		useN: safe(useN),
	};
}
