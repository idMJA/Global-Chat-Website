"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiKey } from "@/lib/apiKey";

export function ApiKeyDialog() {
	const { apiKey, setApiKey, clearApiKey } = useApiKey();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");

	useEffect(() => {
		setOpen(!apiKey);
		setValue(apiKey ?? "");
	}, [apiKey]);

	const save = () => {
		setApiKey(value || "");
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Enter your API Key</DialogTitle>
					<DialogDescription>
						Please input your API key to continue. This will be stored locally
						in your browser.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4">
					<Input
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder="Paste your API key here"
					/>
				</div>

				<DialogFooter>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							onClick={() => {
								clearApiKey();
								setValue("");
								setOpen(true);
							}}
						>
							Clear
						</Button>
						<Button onClick={save}>Save</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ApiKeyDialog;
