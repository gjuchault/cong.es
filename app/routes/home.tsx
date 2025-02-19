import { useState } from "react";
import { Temporal } from "temporal-polyfill";
import { Calendar } from "~/components/calendar/calendar";
import { Field, Label } from "~/components/fieldset";
import { Input } from "~/components/input";
import { Select } from "~/components/select";
import rawBankHolidays from "~/../static-data/bank-holidays.json";

const bankHolidays = rawBankHolidays as [string, string][];

export function meta() {
	return [
		{ title: "cong.es" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const [startDate, setStartDate] = useState(
		Temporal.PlainDate.from("2025-02-01"),
	);
	const [rttType, setRttType] = useState("218j/an");

	function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
		setStartDate(Temporal.PlainDate.from(e.target.value));
	}

	return (
		<div>
			<Field>
				<Label>Date de d'entrée en poste</Label>
				<Input
					type="date"
					defaultValue={startDate.toString()}
					onChange={handleStartDateChange}
				/>
			</Field>
			<Field>
				<Label>Type de contrat</Label>
				<Select defaultValue={rttType}>
					<option value="no-rtt">Pas d'heures supplémentaires</option>
					<option value="35.5h/w">RTT « réels » 35h30</option>
					<option value="36h/w">RTT « réels » 36h00</option>
					<option value="36.5h/w">RTT « réels » 36h30</option>
					<option value="37h/w">RTT « réels » 37h00</option>
					<option value="37.5h/w">RTT « réels » 37h30</option>
					<option value="38h/w">RTT « réels » 38h00</option>
					<option value="38.5h/w">RTT « réels » 38h30</option>
					<option value="218j/an">RTT « forfaitaire » 218 jours</option>
				</Select>
			</Field>
			<Calendar bankHolidayNamePerPlainDateISO={bankHolidays} />
		</div>
	);
}
