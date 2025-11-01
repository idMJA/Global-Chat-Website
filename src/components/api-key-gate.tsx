"use client";

import { ApiKeyProvider, useApiKey } from "@/lib/apiKey";
import ApiKeyDialog from "@/components/dashboard/api-key-dialog";
import { Button } from "@/components/ui/button";

function ApiKeyControls() {
	const { apiKey, clearApiKey } = useApiKey();

	if (!apiKey) return null;

	return (
		<div className="fixed top-4 right-4 z-50">
			<div className="flex items-center space-x-2">
				<span className="text-xs text-muted-foreground truncate max-w-[200px]">
					Key: ****{apiKey.slice(-6)}
				</span>
				<Button size="sm" variant="outline" onClick={() => clearApiKey()}>
					Logout
				</Button>
			</div>
		</div>
	);
}

export default function ApiKeyGate({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ApiKeyProvider>
			<ApiKeyDialog />
			<ApiKeyControls />
			{children}
		</ApiKeyProvider>
	);
}
