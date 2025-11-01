"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type ApiKeyContextType = {
	apiKey: string | null;
	setApiKey: (key: string) => void;
	clearApiKey: () => void;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
	const [apiKey, setApiKeyState] = useState<string | null>(null);

	useEffect(() => {
		try {
			const stored = localStorage.getItem("gc_api_key");
			if (stored) setApiKeyState(stored);
		} catch {
			/* ignore */
		}
	}, []);

	const setApiKey = (key: string) => {
		try {
			localStorage.setItem("gc_api_key", key);
		} catch {
			/* ignore */
		}
		setApiKeyState(key);
	};

	const clearApiKey = () => {
		try {
			localStorage.removeItem("gc_api_key");
		} catch {
			/* ignore */
		}
		setApiKeyState(null);
	};

	return (
		<ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey }}>
			{children}
		</ApiKeyContext.Provider>
	);
}

export function useApiKey() {
	const ctx = useContext(ApiKeyContext);
	if (!ctx) throw new Error("useApiKey must be used within ApiKeyProvider");
	return ctx;
}

export default ApiKeyProvider;
