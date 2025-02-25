import {
	type Dispatch,
	type JSX,
	type PropsWithChildren,
	type SetStateAction,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import type { TypeOf, ZodTypeAny } from "zod";
import { useHydrated } from "~/components/client-only";

function getInitialValue<Schema extends ZodTypeAny>(
	key: string,
	schema: Schema,
): TypeOf<Schema> | undefined {
	try {
		const item = window.localStorage.getItem(key);
		return item ? schema.parse(JSON.parse(item)) : undefined;
	} catch (error) {
		return undefined;
	}
}

export function createPersistentContext<Schema extends ZodTypeAny>(
	key: string,
	schema: Schema,
	initialState: TypeOf<Schema>,
): [
	({ children }: PropsWithChildren) => JSX.Element,
	() => [TypeOf<Schema>, Dispatch<SetStateAction<TypeOf<Schema>>>],
] {
	const Context = createContext<
		[TypeOf<Schema>, Dispatch<SetStateAction<TypeOf<Schema>>>] | undefined
	>(undefined);

	function Provider({ children }: PropsWithChildren): JSX.Element {
		const isClient = useHydrated();

		const [initialRender, setInitialRender] = useState(true);

		const [state, setState] = useState<TypeOf<Schema>>(() => {
			try {
				if (isClient === false) {
					return initialState;
				}

				const item = window.localStorage.getItem(key);
				return item ? schema.parse(JSON.parse(item)) : initialState;
			} catch (error) {
				console.warn(`Error reading localStorage key "${key}":`, error);
				return initialState;
			}
		});

		// biome-ignore lint/correctness/useExhaustiveDependencies: remix specific
		useEffect(() => {
			if (isClient === true) {
				return;
			}

			setInitialRender(false);
			setState(getInitialValue(key, schema) ?? initialState);
		}, [isClient, state]);

		// biome-ignore lint/correctness/useExhaustiveDependencies: remix specific
		useEffect(() => {
			if (typeof globalThis.window === "undefined" || initialRender) {
				return;
			}

			try {
				window.localStorage.setItem(key, JSON.stringify(state));
			} catch (error) {
				console.warn(`Error setting localStorage key "${key}":`, error);
			}
		}, [key, state]);

		return (
			<Context.Provider value={[state, setState]}>{children}</Context.Provider>
		);
	}

	function usePersistedState(): [
		TypeOf<Schema>,
		Dispatch<SetStateAction<TypeOf<Schema>>>,
	] {
		const context = useContext(Context);
		if (context === undefined) {
			throw new Error("usePersistedState must be used within its provider");
		}
		return context;
	}

	return [Provider, usePersistedState];
}
