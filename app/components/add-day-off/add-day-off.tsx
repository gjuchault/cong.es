import { useSearchParams } from "react-router";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "../catalyst/dialog";
import { Field, FieldGroup, Label } from "../catalyst/fieldset";
import { Select } from "../catalyst/select";
import { Button } from "../catalyst/button";
import { getBestChoice } from "~/domain/get-best-choice";
import { Temporal } from "temporal-polyfill";
import { getDayDetails } from "~/domain/get-day-details";
import { useMemo, useState } from "react";
import { useEmployeeSettings } from "~/hooks/use-employee-settings";
import { Badge } from "../catalyst/badge";
import { getWorkingDays } from "~/domain/get-working-days";
import { Input } from "../catalyst/input";
import { dayOffTypeColor, type DaysOff } from "~/domain/day";

export function AddDayOff({
	from,
	to,
}: {
	from: string;
	to: string;
}) {
	const [_, setSearchParams] = useSearchParams();
	const [employeeSettings, setEmployeeSettings] = useEmployeeSettings();

	function handleClose() {
		setSearchParams({});
	}

	const startDate = Temporal.PlainDate.from(from);
	const endDate = Temporal.PlainDate.from(to);

	const stocksAtDate = useMemo(
		() => getDayDetails(startDate, employeeSettings),
		[startDate, employeeSettings],
	);

	const quantity = getWorkingDays({
		from: startDate,
		to: endDate,
		startHalf: false,
		stopHalf: false,
	});

	const bestChoices = getBestChoice({
		nAtDate: stocksAtDate.nAtDate,
		nMinusOneAtDate: stocksAtDate.nMinusOneAtDate,
		rttAtDate: stocksAtDate.rttAtDate,
		quantity,
		startDate,
	});

	const [reason, setReason] = useState("");
	const [type, setType] = useState<DaysOff["type"]>(
		bestChoices.useRtt > 0
			? "rtt"
			: bestChoices.useNMinusOne > 0
				? "nMinusOne"
				: "n",
	);

	function handleAddDayOff(): void {
		setEmployeeSettings((currentEmployeeSettings) => ({
			...currentEmployeeSettings,
			daysOff: [
				...currentEmployeeSettings.daysOff,
				{
					from: startDate,
					to: endDate,
					fromHalfOnly: false,
					toHalfOnly: false,
					type,
					name: reason,
				},
			],
		}));

		handleClose();
	}

	// TODO: half days

	return (
		<Dialog open={true} onClose={handleClose}>
			<DialogTitle>Ajouter des congés</DialogTitle>
			<DialogDescription>
				Recommendation:
				{bestChoices.useRtt > 0 && (
					<span className="block">
						<Badge color={dayOffTypeColor.rtt}>RTT: {bestChoices.useRtt}</Badge>
						<span className="ml-1">
							(les RTT expirent plus tôt que les N-1 entre juin et décembre)
						</span>
					</span>
				)}
				{bestChoices.useNMinusOne > 0 && (
					<span className="block">
						<Badge color={dayOffTypeColor.nMinusOne}>
							N-1: {bestChoices.useNMinusOne}
						</Badge>
						<span className="ml-1">
							(les N-1 expirent plus tôt que les RTT entre janvier et mai)
						</span>
					</span>
				)}
				{bestChoices.useN > 0 && (
					<span className="block">
						<Badge color={dayOffTypeColor.n}>N: {bestChoices.useN}</Badge>
						<span className="ml-1">(les N sont en dernier recours)</span>
					</span>
				)}
			</DialogDescription>
			<DialogBody>
				<FieldGroup>
					<Field>
						<Label>Type de congés</Label>
						<Select
							name="type"
							onChange={(e) => setType(e.target.value as DaysOff["type"])}
							value={type}
						>
							<option value="rtt">RTT</option>
							<option value="nMinusOne">N-1</option>
							<option value="n">N</option>
						</Select>
					</Field>
					<Field>
						<Label>Libellé</Label>
						<Input name="reason" onChange={(e) => setReason(e.target.value)} />
					</Field>
				</FieldGroup>
			</DialogBody>
			<DialogActions>
				<Button plain onClick={handleClose}>
					Annuler
				</Button>
				<Button onClick={handleAddDayOff}>Ajouter</Button>
			</DialogActions>
		</Dialog>
	);
}
