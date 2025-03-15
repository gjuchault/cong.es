import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Temporal } from "temporal-polyfill";
import { round } from "~/domain/helpers/round";
import { isDateBetweenIncl } from "~/helpers/date";
import { useEmployeeSettings } from "~/hooks/use-employee-settings";
import { generateCalendar } from "~/domain/generate-month";
import { getDayDetailByDate } from "~/domain/get-day-detail-by-date";
import { bankHolidays } from "~/domain/helpers/bank-holidays";

const bankHolidayNamePerPlainDateISO = new Map(
	bankHolidays
		.map((dayOff) => [dayOff.from.toString(), dayOff.name] as const),
);

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

	// biome-ignore lint/correctness/useExhaustiveDependencies: meant to reset state
	useEffect(() => {
		setStartDaySelected(undefined);
		setEndDaySelected(undefined);
	}, [from, to]);

	const [isSelectionInitial, setIsSelectionInitial] = useState(true);
	const [employeeSettings] = useEmployeeSettings();

	const [yearMonth, setYearMonth] = useState(
		Temporal.Now.plainDateISO().toPlainYearMonth(),
	);

	const generatedCalendar = useMemo(
		() =>
			generateCalendar({
				yearMonth,
				bankHolidayNamePerPlainDateISO,
				daysOff: employeeSettings.daysOff
			}),
		[yearMonth, employeeSettings.daysOff],
	);
	const [_, setSearchParams] = useSearchParams();

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
					isDateBetweenIncl(day.date, startDaySelected, endDaySelected);

				const isFirstOfSelection =
					isDaySelected && startDaySelected.equals(day.date);
				const isLastOfSelection =
					isDaySelected && endDaySelected.equals(day.date);

				const dayOff = day.events.filter((event) => event.type !== "bankHoliday").at(0);
				const dayOffProps = dayOff ? {
					hasDayOff: true,
					type: dayOff.type,
					label: dayOff.label,
					isFirstOff: dayOff.isStart,
					isLastOff: dayOff.isEnd,
				} as const : {
					hasDayOff: false,
				} as const;

				return {
					date: day.date,
					isCurrentMonth: day.isCurrentMonth,
					isToday: day.isToday,
					...dayOffProps,
					bankHoliday: day.events.filter((event) => event.type === "bankHoliday").at(0),
					n,
					nMinusOne,
					rtt,
					isDaySelected,
					isFirstOfSelection,
					isLastOfSelection,
					onMouseDown() {
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
							setSearchParams({
								from: startDaySelected.toString(),
								to: endDaySelected.toString(),
							});
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
			setSearchParams,
		],
	);

	return {
		yearMonth,
		setYearMonth,
		calendar,
	};
}
