import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Temporal } from "temporal-polyfill";
import { round } from "~/domain/helpers/round";
import { isDateBetween } from "~/helpers/date";
import { useEmployeeSettings } from "~/hooks/use-employee-settings";
import { generateCalendar } from "./generate-month";
import { getDayDetailByDate } from "./get-day-detail-by-date";

export function useCalendar({
	from,
	to,
}: {
	from?: string;
	to?: string;
}) {
	const [startDaySelected, setStartDaySelected] = useState<
		Temporal.PlainDate | undefined
	>(() => {
		try {
			return from ? Temporal.PlainDate.from(from) : undefined;
		} catch {
			return undefined;
		}
	});
	const [endDaySelected, setEndDaySelected] = useState<
		Temporal.PlainDate | undefined
	>(() => {
		try {
			return to ? Temporal.PlainDate.from(to) : undefined;
		} catch {
			return undefined;
		}
	});
	const [isSelectionInitial, setIsSelectionInitial] = useState(true);
	const [employeeSettings] = useEmployeeSettings();

	const bankHolidayNamePerPlainDateISO = useMemo(
		() =>
			new Map(
				employeeSettings.daysOff
					.filter((dayOff) => dayOff.type === "bank-holiday")
					.map((dayOff) => [dayOff.date.toString(), dayOff.name] as const),
			),
		[employeeSettings],
	);

	const [yearMonth, setYearMonth] = useState(
		Temporal.Now.plainDateISO().toPlainYearMonth(),
	);

	const generatedCalendar = useMemo(
		() =>
			generateCalendar({
				yearMonth,
				bankHolidayNamePerPlainDateISO,
			}),
		[yearMonth, bankHolidayNamePerPlainDateISO],
	);
	const navigate = useNavigate();

	const dayDetailByDate = useMemo(
		() => getDayDetailByDate({ calendar: generatedCalendar, employeeSettings }),
		[generatedCalendar, employeeSettings],
	);

	const calendar = useMemo(
		() =>
			generatedCalendar.map((day) => {
				const dayDetail = dayDetailByDate.get(day.date.toString());
				const n = round(
					dayDetail?.nAtDate ?? 0,
					employeeSettings.roundingMethod,
				);
				const nMinusOne = round(
					dayDetail?.nMinusOneAtDate ?? 0,
					employeeSettings.roundingMethod,
				);
				const rtt = round(
					dayDetail?.rttAtDate ?? 0,
					employeeSettings.roundingMethod,
				);
				const isDaySelected =
					startDaySelected !== undefined &&
					endDaySelected !== undefined &&
					isDateBetween(day.date, startDaySelected, endDaySelected);

				const isFirstOfSelection =
					isDaySelected && startDaySelected.equals(day.date);
				const isLastOfSelection =
					isDaySelected && endDaySelected.equals(day.date);

				return {
					...day,
					isDaySelected,
					n,
					nMinusOne,
					rtt,
					isFirstOfSelection,
					isLastOfSelection,
					onMouseDown() {
						console.log("mouse down");
						setIsSelectionInitial(false);
						setStartDaySelected(day.date);
						setEndDaySelected(undefined);
					},
					onMouseMove() {
						if (startDaySelected === undefined || isSelectionInitial === true) {
							return;
						}

						setEndDaySelected(day.date);
					},
					onMouseUp() {
						if (
							startDaySelected !== undefined &&
							endDaySelected !== undefined
						) {
							navigate(
								`/${startDaySelected.toString()}/${endDaySelected.toString()}`,
							);
						}

						setIsSelectionInitial(true);
					},
				};
			}),
		[
			dayDetailByDate,
			generatedCalendar,
			startDaySelected,
			endDaySelected,
			isSelectionInitial,
			employeeSettings.roundingMethod,
			navigate,
		],
	);

	return {
		yearMonth,
		setYearMonth,
		calendar,
	};
}
