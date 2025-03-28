import { clsx } from "clsx";
import type { PropsWithChildren } from "react";
import { Badge, type BadgeProps } from "../catalyst/badge";

export function MultiDayBadge({
	color,
	isFirst,
	isLast,
	children,
}: PropsWithChildren<{
	color: BadgeProps["color"];
	isFirst: boolean;
	isLast: boolean;
}>) {
	return (
		<Badge
			color={color}
			className={clsx("block! mt-1", {
				"rounded-md m-0": isFirst === true && isLast === true,
				"rounded-l-md rounded-r-none -mr-2 sm:-mr-3":
					isFirst === true && isLast === false,
				"rounded-r-md rounded-l-none -ml-2 sm:-ml-3":
					isFirst === false && isLast === true,
				"rounded-none -mr-2 sm:-mr-3 -ml-2 sm:-ml-3":
					isFirst === false && isLast === false,
				"text-transparent!":
					(isFirst === true && isLast === false) || isLast === false,
				"text-right": isLast === true && isFirst === false,
			})}
		>
			{children}
		</Badge>
	);
}
