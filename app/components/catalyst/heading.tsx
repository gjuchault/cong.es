import clsx from "clsx";

type HeadingProps = {
	level?: 1 | 2 | 3 | 4 | 5 | 6;
} & React.ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;

export function Heading({ className, level = 1, ...props }: HeadingProps) {
	const Element: `h${typeof level}` = `h${level}`;

	return (
		<Element
			{...props}
			className={clsx(
				className,
				"text-xl/8 font-semibold text-zinc-950 dark:text-white",
			)}
		/>
	);
}

export function Subheading({ className, level = 2, ...props }: HeadingProps) {
	const Element: `h${typeof level}` = `h${level}`;

	return (
		<Element
			{...props}
			className={clsx(
				className,
				"text-sm/6 font-semibold text-zinc-950 dark:text-white",
			)}
		/>
	);
}
