import { type PropsWithChildren, useSyncExternalStore } from "react";

function subscribe() {
	return () => {};
}

export function useHydrated() {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	);
}

export function ClientOnly({
	children,
	fallback = null,
}: PropsWithChildren<{
	/**
	 * You are encouraged to add a fallback that is the same dimensions
	 * as the client rendered children. This will avoid content layout
	 * shift which is disgusting
	 */
	fallback?: React.ReactNode;
}>) {
	return useHydrated() ? <>{children}</> : <>{fallback}</>;
}
