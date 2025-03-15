import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	CogIcon,
	EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { clsx } from "clsx";
import { Temporal } from "temporal-polyfill";
import { Badge } from "../catalyst/badge";
import { ClientOnly } from "../client-only";
import { useCalendar } from "./use-calendar";
import { safe } from "~/domain/helpers/safe";
import { MultiDayBadge } from "./multi-day-badge";
import { dayOffTypeColor } from "~/domain/day";
import { Button } from "../catalyst/button";
import { Heading } from "../catalyst/heading";

export function Calendar({
	onOpenSettings,
	from,
	to,
}: {
	onOpenSettings(): void;
	from?: string;
	to?: string;
}) {
	const { yearMonth, setYearMonth, calendar } = useCalendar({ from, to });

	const yearMonthAsString = yearMonth.toLocaleString("fr", {
		month: "long",
		year: "numeric",
		calendar: "iso8601",
	});

	return (
		<div className="bg-zinc-50 dark:bg-zinc-900 h-0 min-h-[768px]">
			<div className="flex h-full flex-col">
				<header className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 p-6 dark:border-white/10">
					<Heading>
						<time dateTime={yearMonth.toString()} className="capitalize">
							<ClientOnly fallback="2025">{yearMonthAsString}</ClientOnly>
						</time>
					</Heading>
					<div className="flex gap-4">
						<Button className="mr-2" onClick={onOpenSettings}>
							<CogIcon />
							Réglages
						</Button>
						<div className="relative flex items-center md:items-stretch">
							<Button
								className="mr-0.5"
								onClick={() => setYearMonth((ym) => ym.add({ months: -1 }))}
							>
								<span className="sr-only">Mois précédent</span>
								<ChevronLeftIcon className="size-5" aria-hidden="true" />
							</Button>
							<Button
								onClick={() =>
									setYearMonth(Temporal.Now.plainDateISO().toPlainYearMonth())
								}
							>
								Aujourd'hui
							</Button>
							<span className="relative -mx-px h-5 w-px bg-zinc-300 md:hidden" />
							<Button
								className="ml-0.5"
								onClick={() => setYearMonth((ym) => ym.add({ months: 1 }))}
							>
								<span className="sr-only">Mois suivant</span>
								<ChevronRightIcon className="size-5" aria-hidden="true" />
							</Button>
						</div>
					</div>
				</header>
				<div className="flex flex-auto flex-col">
					<div className="grid grid-cols-7 gap-px border-b border-zinc-300 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800 text-center text-xs/6 font-semibold text-zinc-700 dark:text-zinc-200 flex-none">
						<div className="bg-white dark:bg-zinc-950 py-2">
							M<span className="sr-only sm:not-sr-only">on</span>
						</div>
						<div className="bg-white dark:bg-zinc-950 py-2">
							T<span className="sr-only sm:not-sr-only">ue</span>
						</div>
						<div className="bg-white dark:bg-zinc-950 py-2">
							W<span className="sr-only sm:not-sr-only">ed</span>
						</div>
						<div className="bg-white dark:bg-zinc-950 py-2">
							T<span className="sr-only sm:not-sr-only">hu</span>
						</div>
						<div className="bg-white dark:bg-zinc-950 py-2">
							F<span className="sr-only sm:not-sr-only">ri</span>
						</div>
						<div className="bg-white dark:bg-zinc-950 py-2">
							S<span className="sr-only sm:not-sr-only">at</span>
						</div>
						<div className="bg-white dark:bg-zinc-950 py-2">
							S<span className="sr-only sm:not-sr-only">un</span>
						</div>
					</div>
					<div className="flex bg-zinc-200 dark:bg-zinc-800 text-xs/6 text-zinc-700 dark:text-zinc-200 flex-auto">
						<div className="w-full grid grid-cols-7 grid-rows-6 gap-px">
							{calendar.map((day, index) => {
								const todaySum = safe(day.n + day.nMinusOne + day.rtt);
								const isSameThanPreviousDay =
									index > 0 &&
									safe(
										calendar[index - 1].n +
											calendar[index - 1].nMinusOne +
											calendar[index - 1].rtt,
									) === todaySum;
								return (
									<div
										key={day.date.toString()}
										className={clsx(
											day.isCurrentMonth
												? "bg-white dark:bg-zinc-950"
												: "bg-zinc-50 dark:bg-zinc-900 text-zinc-500",
											"relative px-3 py-2",
											"group",
											"select-none",
										)}
										onMouseDown={day.onMouseDown}
										onMouseMove={day.onMouseMove}
										onMouseUp={day.onMouseUp}
									>
										<time
											dateTime={day.date.toString()}
											className={
												day.isToday
													? "flex size-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
													: undefined
											}
										>
											{day.date.day.toString()}
										</time>
										<div>
											<Badge
												color="purple"
												className={clsx("group-hover:hidden", {
													"opacity-40": isSameThanPreviousDay,
												})}
											>
												{todaySum}
											</Badge>
											<div className="hidden group-hover:flex gap-1">
												<Badge color={dayOffTypeColor.n}>N: {day.n}</Badge>
												<Badge color={dayOffTypeColor.nMinusOne}>
													N-1: {day.nMinusOne}
												</Badge>
												<Badge color={dayOffTypeColor.rtt}>
													RTT: {day.rtt}
												</Badge>
											</div>
										</div>
										{day.isDaySelected && (
											<MultiDayBadge
												color="blue"
												isFirst={day.isFirstOfSelection}
												isLast={day.isLastOfSelection}
											>
												Ajouter des congés
											</MultiDayBadge>
										)}
										{day.hasDayOff && (
											<MultiDayBadge
												color={dayOffTypeColor[day.type]}
												isFirst={day.isFirstOff}
												isLast={day.isLastOff}
											>
												{day.label.length > 0
													? day.label
													: `Congés (${day.type})`}
											</MultiDayBadge>
										)}
										{day.bankHoliday !== undefined && (
											<span
												className="group flex"
												key={day.bankHoliday.date.toString()}
											>
												<p className="flex-auto truncate font-medium text-zinc-900 group-hover:text-indigo-600">
													{day.bankHoliday.label}
												</p>
												<span className="ml-3 flex-none text-zinc-500 group-hover:text-indigo-600 block">
													Ferié
												</span>
											</span>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
