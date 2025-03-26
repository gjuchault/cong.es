import { useEffect, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { nPerYearSchema } from "~/domain/employee-settings";
import { roundingMethodSchema } from "~/domain/helpers/round";
import { rttTypeSchema } from "~/domain/rtt";
import { useEmployeeSettings } from "~/hooks/use-employee-settings";
import { Button } from "../catalyst/button";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "../catalyst/dialog";
import { Field, FieldGroup, Label } from "../catalyst/fieldset";
import { Input } from "../catalyst/input";
import { Select } from "../catalyst/select";

export function Settings({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose(): void;
}) {
	const [employeeSettings, setEmployeeSettings] = useEmployeeSettings();
	const [startDate, setStartDate] = useState(
		employeeSettings.startDate.toString(),
	);
	const [rttType, setRttType] = useState(employeeSettings.rttType);
	const [nPerYear, setNPerYear] = useState(employeeSettings.nPerYear);
	const [roundingMethod, setRoundingMethod] = useState(
		employeeSettings.roundingMethod,
	);

	useEffect(() => {
		setStartDate(employeeSettings.startDate.toString());
		setRttType(employeeSettings.rttType);
		setNPerYear(employeeSettings.nPerYear);
		setRoundingMethod(employeeSettings.roundingMethod);
	}, [employeeSettings]);

	function handleSaveSettings() {
		setEmployeeSettings({
			startDate: Temporal.PlainDate.from(startDate),
			rttType,
			nPerYear,
			roundingMethod,
			daysOff: employeeSettings.daysOff,
		});

		onClose();
	}

	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle>Ajouter des congés</DialogTitle>
			<DialogDescription>Réglages</DialogDescription>
			<DialogBody>
				<FieldGroup>
					<Field>
						<Label>Date de d'entrée en poste</Label>
						<Input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</Field>
					<Field>
						<Label>Type de contrat</Label>
						<Select
							value={rttType}
							onChange={(e) => {
								const parseResult = rttTypeSchema.safeParse(e.target.value);
								if (parseResult.success === false) {
									return;
								}

								setRttType(parseResult.data);
							}}
						>
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
					<Field>
						<Label>Nombre de jours de congés par an</Label>
						<Input
							type="number"
							value={nPerYear}
							onChange={(e) => {
								const parseResult = nPerYearSchema.safeParse(
									e.target.valueAsNumber,
								);
								if (parseResult.success === false) {
									return;
								}

								setNPerYear(parseResult.data);
							}}
						/>
					</Field>
					<Field>
						<Label>Arrondi</Label>
						<Select
							value={roundingMethod}
							onChange={(e) => {
								const parseResult = roundingMethodSchema.safeParse(
									e.target.value,
								);
								if (parseResult.success === false) {
									return;
								}

								setRoundingMethod(parseResult.data);
							}}
						>
							<option value="ceil-int">Arrondi à l'entier supérieur</option>
							<option value="ceil-half">Arrondi au demi supérieur</option>
							<option value="round-half">Arrondi au demi</option>
							<option value="double-digit">Deux décimales</option>
						</Select>
					</Field>
				</FieldGroup>
			</DialogBody>
			<DialogActions>
				<Button plain onClick={onClose}>
					Annuler
				</Button>
				<Button onClick={handleSaveSettings}>Appliquer</Button>
			</DialogActions>
		</Dialog>
	);
}
