import { isDate } from "./date";

export function parseFromTo(searchParams: URLSearchParams): {
	from?: string;
	to?: string;
} {
	const rawFrom = searchParams.get("from");
	const rawTo = searchParams.get("to");

	const result: {
		from?: string;
		to?: string;
	} = {};

	if (rawFrom !== null && isDate(rawFrom)) {
		result.from = rawFrom;
	}

	if (rawTo !== null && isDate(rawTo)) {
		result.to = rawTo;
	}

	return result;
}
