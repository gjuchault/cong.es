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
import { Settings } from "~/components/settings/settings";
import { useState } from "react";

export function meta() {
	return [
		{ title: "cong.es" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const [searchParams] = useSearchParams();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { from, to } = parseFromTo(searchParams);

	return (
		<div>
			{from !== undefined && to !== undefined && (
				<AddDayOff from={from} to={to} />
			)}
			<Settings
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
			<Calendar
				from={from}
				to={to}
				onOpenSettings={() => setIsSettingsOpen(true)}
			/>
		</div>
	);
}
