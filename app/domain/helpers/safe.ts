export function safe(input: number): number {
	const factor = 1000000000000;
	return Math.round(input * factor) / factor;
}
