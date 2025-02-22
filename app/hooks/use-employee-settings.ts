import {
	defaultSettings,
	employeeSettingsSchema,
} from "~/domain/employee-settings";
import { createPersistentContext } from "./use-persistent-context";

export const [EmployeeSettingsProvider, useEmployeeSettings] =
	createPersistentContext(
		"employee-settings",
		employeeSettingsSchema,
		defaultSettings,
	);
