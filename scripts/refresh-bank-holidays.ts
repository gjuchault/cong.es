import { Temporal } from "temporal-polyfill";
import { z } from "zod";

export async function fetchBankHolidays(): Promise<
	[Temporal.PlainDate, string][]
> {
	const bankHolidays: [Temporal.PlainDate, string][] = [];

	const url = new URL("/PublicHolidays", "https://openholidaysapi.org/");

	const startOfYear = Temporal.Now.plainDateISO().with({ month: 1, day: 1 });

	url.searchParams.set("countryIsoCode", "FR");
	url.searchParams.set("validFrom", startOfYear.toString());
	url.searchParams.set("validTo", startOfYear.add({ days: 1095 }).toString());
	url.searchParams.set("languageIsoCode", "FR");
	url.searchParams.set("subdivisionCode", "FR-FR");

	const response = await fetch(url);

	if (!response.ok) {
		console.error("Failed to fetch public holidays", { response });
		return bankHolidays;
	}

	const data = await response.json();
	const holidays = z
		.array(
			z.object({
				startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
				name: z
					.array(
						z.object({
							text: z.string(),
						}),
					)
					.nonempty(),
			}),
		)
		.parse(data);

	for (const { startDate, name } of holidays) {
		bankHolidays.push([Temporal.PlainDate.from(startDate), name[0].text]);
	}

	return bankHolidays;
}

export async function refreshBankHolidays() {
	const bankHolidays = await fetchBankHolidays();

	await Bun.write(
		"static-data/bank-holidays.json",
		JSON.stringify(bankHolidays, null, 2),
	);
}

if (import.meta.main) {
	refreshBankHolidays();
}
