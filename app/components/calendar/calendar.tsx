import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ClockIcon,
	EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { clsx } from "clsx";
import { generateCalendar } from "./generate-month";
import { Temporal } from "temporal-polyfill";
import { useMemo, useState } from "react";
import { ClientOnly } from "../client-only";

export function Calendar({
	bankHolidayNamePerPlainDateISO,
}: { bankHolidayNamePerPlainDateISO: [string, string][] }) {
	const [yearMonth, setYearMonth] = useState(
		Temporal.Now.plainDateISO().toPlainYearMonth(),
	);

	const calendar = useMemo(
		() =>
			generateCalendar({
				yearMonth,
				bankHolidayNamePerPlainDateISO: new Map(bankHolidayNamePerPlainDateISO),
			}),
		[yearMonth, bankHolidayNamePerPlainDateISO],
	);
	const selectedDay = calendar.find((day) => day.isSelected);

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
						<div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
							{calendar.map((day) => (
								<div
									key={day.date.toString()}
									className={clsx(
										day.isCurrentMonth
											? "bg-white"
											: "bg-gray-50 text-gray-500",
										"relative px-3 py-2",
									)}
								>
									<time
										dateTime={day.date.toString()}
										className={
											day.isToday
												? "flex size-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
												: undefined
										}
									>
										{day.date.toString().split("-").pop()?.replace(/^0/, "")}
									</time>
									{day.events.length > 0 && (
										<ol className="mt-2">
											{day.events.slice(0, 2).map((event) => (
												<li key={event.type}>
													<span className="group flex">
														<p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
															{event.name}
														</p>
														<time
															dateTime={event.type}
															className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
														>
															{event.type}
														</time>
													</span>
												</li>
											))}
											{day.events.length > 2 && (
												<li className="text-gray-500">
													+ {day.events.length - 2} more
												</li>
											)}
										</ol>
									)}
								</div>
							))}
						</div>
						<div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
							{calendar.map((day) => (
								<button
									key={day.date.toString()}
									type="button"
									className={clsx(
										day.isCurrentMonth ? "bg-white" : "bg-gray-50",
										(day.isSelected || day.isToday) && "font-semibold",
										day.isSelected && "text-white",
										!day.isSelected && day.isToday && "text-indigo-600",
										!day.isSelected &&
											day.isCurrentMonth &&
											!day.isToday &&
											"text-gray-900",
										!day.isSelected &&
											!day.isCurrentMonth &&
											!day.isToday &&
											"text-gray-500",
										"flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10",
									)}
								>
									<time
										dateTime={day.date.toString()}
										className={clsx(
											day.isSelected &&
												"flex size-6 items-center justify-center rounded-full",
											day.isSelected && day.isToday && "bg-indigo-600",
											day.isSelected && !day.isToday && "bg-gray-900",
											"ml-auto",
										)}
									>
										{day.date.toString().split("-").pop()?.replace(/^0/, "")}
									</time>
									<span className="sr-only">{day.events.length} events</span>
									{day.events.length > 0 && (
										<span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
											{day.events.map((event) => (
												<span
													key={event.type}
													className="mx-0.5 mb-1 size-1.5 rounded-full bg-gray-400"
												/>
											))}
										</span>
									)}
								</button>
							))}
						</div>
					</div>
				</div>
				{(selectedDay?.events.length ?? 0) > 0 && (
					<div className="px-4 py-10 sm:px-6 lg:hidden">
						<ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm ring-1 shadow-sm ring-black/5">
							{selectedDay?.events.map((event) => (
								<li
									key={event.type}
									className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50"
								>
									<div className="flex-auto">
										<p className="font-semibold text-gray-900">{event.type}</p>
										<time
											dateTime={event.type}
											className="mt-2 flex items-center text-gray-700"
										>
											<ClockIcon
												className="mr-2 size-5 text-gray-400"
												aria-hidden="true"
											/>
											{event.type}
										</time>
									</div>
									<span className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 ring-1 shadow-xs ring-gray-300 ring-inset group-hover:opacity-100 hover:ring-gray-400 focus:opacity-100">
										Edit<span className="sr-only">, {event.type}</span>
									</span>
								</li>
							))}
						</ol>
					</div>
				)}
			</div>
		</div>
	);
}
