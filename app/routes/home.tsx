import { z } from "zod";
import { Calendar } from "~/components/calendar/calendar";
import { Field, Label } from "~/components/catalyst/fieldset";
import { Input } from "~/components/catalyst/input";
import { Select } from "~/components/catalyst/select";
import { roundingMethodSchema } from "~/domain/helpers/round";
import { rttTypeSchema } from "~/domain/rtt";
import { plainDateSchema } from "~/helpers/schemas";
import { useEmployeeSettings } from "~/hooks/use-employee-settings";
import { AddDayOff } from "~/components/add-day-off/add-day-off";
import { useSearchParams } from "react-router";
import { parseFromTo } from "~/helpers/parse-from-to";

export function meta() {
	return [
		{ title: "cong.es" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const [searchParams] = useSearchParams();
	const [employeeSettings, setEmployeeSettings] = useEmployeeSettings();
	const { from, to } = parseFromTo(searchParams);

	function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
		const parseResult = plainDateSchema.safeParse(e.target.value);
		if (parseResult.success === false) {
			return;
		}

		setEmployeeSettings((currentSettings) => ({
			...currentSettings,
			startDate: parseResult.data,
		}));
	}

	function handleRttTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const parseResult = rttTypeSchema.safeParse(e.target.value);
		if (parseResult.success === false) {
			return;
		}

		setEmployeeSettings((currentSettings) => ({
			...currentSettings,
			rttType: parseResult.data,
		}));
	}

	function handleNPerYearChange(e: React.ChangeEvent<HTMLInputElement>) {
		const parseResult = z.coerce
			.number()
			.int()
			.safe()
			.gt(8)
			.safeParse(e.target.value);

		if (parseResult.success === false) {
			return;
		}

		setEmployeeSettings((currentSettings) => ({
			...currentSettings,
			nPerYear: parseResult.data,
		}));
	}

	function handleRoundingMethodChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const parseResult = roundingMethodSchema.safeParse(e.target.value);
		if (parseResult.success === false) {
			return;
		}

		setEmployeeSettings((currentSettings) => ({
			...currentSettings,
			roundingMethod: parseResult.data,
		}));
	}

	return (
		<div>
			{from !== undefined && to !== undefined && (
				<AddDayOff from={from} to={to} />
			)}
			<Field>
				<Label>Date de d'entrée en poste</Label>
				<Input
					type="date"
					value={employeeSettings.startDate.toString()}
					onChange={handleStartDateChange}
				/>
			</Field>
			<Field>
				<Label>Type de contrat</Label>
				<Select value={employeeSettings.rttType} onChange={handleRttTypeChange}>
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
			<div>
				<Field>
					<Label>Nombre de jours de congés par an</Label>
					<Input
						type="number"
						value={employeeSettings.nPerYear}
						onChange={handleNPerYearChange}
					/>
				</Field>
				<Field>
					<Label>Arrondi</Label>
					<Select
						value={employeeSettings.roundingMethod}
						onChange={handleRoundingMethodChange}
					>
						<option value="ceil-int">Arrondi à l'entier supérieur</option>
						<option value="ceil-half">Arrondi au demi supérieur</option>
						<option value="round-half">Arrondi au demi</option>
						<option value="double-digit">Deux décimales</option>
					</Select>
				</Field>
			</div>
			<Calendar from={from} to={to} />
		</div>
	);
}
