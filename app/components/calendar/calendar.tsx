import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
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

export function Calendar({
	from,
	to,
}: {
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
		<div className="bg-gray-50 lg:h-0 lg:min-h-[768px]">
			<div className="lg:flex lg:h-full lg:flex-col">
				<header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
					<h1 className="text-base font-semibold text-gray-900">
						<time dateTime={yearMonth.toString()} className="capitalize">
							<ClientOnly fallback="2025">{yearMonthAsString}</ClientOnly>
						</time>
					</h1>
					<div className="flex items-center">
						<div className="relative flex items-center rounded-md bg-white shadow-xs md:items-stretch">
							<button
								type="button"
								className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
								onClick={() => {
									setYearMonth((ym) => ym.add({ months: -1 }));
								}}
							>
								<span className="sr-only">Mois précédent</span>
								<ChevronLeftIcon className="size-5" aria-hidden="true" />
							</button>
							<button
								type="button"
								className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
								onClick={() => {
									setYearMonth(Temporal.Now.plainDateISO().toPlainYearMonth());
								}}
							>
								Aujourd'hui
							</button>
							<span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
							<button
								type="button"
								className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
								onClick={() => {
									setYearMonth((ym) => ym.add({ months: 1 }));
								}}
							>
								<span className="sr-only">Mois suivant</span>
								<ChevronRightIcon className="size-5" aria-hidden="true" />
							</button>
						</div>
						<Menu as="div" className="relative ml-6 md:hidden">
							<MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
								<span className="sr-only">Open menu</span>
								<EllipsisHorizontalIcon className="size-5" aria-hidden="true" />
							</MenuButton>

							<MenuItems
								transition
								className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
							>
								<div className="py-1">
									<MenuItem>
										<button
											type="button"
											className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
										>
											Go to today
										</button>
									</MenuItem>
								</div>
							</MenuItems>
						</Menu>
					</div>
				</header>
				<div className="ring-1 shadow-sm ring-black/5 lg:flex lg:flex-auto lg:flex-col">
					<div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs/6 font-semibold text-gray-700 lg:flex-none">
						<div className="bg-white py-2">
							M<span className="sr-only sm:not-sr-only">on</span>
						</div>
						<div className="bg-white py-2">
							T<span className="sr-only sm:not-sr-only">ue</span>
						</div>
						<div className="bg-white py-2">
							W<span className="sr-only sm:not-sr-only">ed</span>
						</div>
						<div className="bg-white py-2">
							T<span className="sr-only sm:not-sr-only">hu</span>
						</div>
						<div className="bg-white py-2">
							F<span className="sr-only sm:not-sr-only">ri</span>
						</div>
						<div className="bg-white py-2">
							S<span className="sr-only sm:not-sr-only">at</span>
						</div>
						<div className="bg-white py-2">
							S<span className="sr-only sm:not-sr-only">un</span>
						</div>
					</div>
					<div className="flex bg-gray-200 text-xs/6 text-gray-700 lg:flex-auto">
						<div className="w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
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
												? "bg-white"
												: "bg-gray-50 text-gray-500",
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
												<p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
													{day.bankHoliday.label}
												</p>
												<span className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block">
													{day.bankHoliday.type}
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
