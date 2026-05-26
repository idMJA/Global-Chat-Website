"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SystemStatus() {
	const [status, setStatus] = useState<"checking" | "online" | "offline">(
		"checking",
	);
	const [serverCount, setServerCount] = useState<number | null>(null);

	useEffect(() => {
		async function checkHealthAndStats() {
			try {
				const response = await fetch("/api/stats");
				if (response.ok) {
					const data = await response.json();
					if (data.success && data.data) {
						setStatus("online");
						setServerCount(data.data.total_servers);
					} else {
						setStatus("offline");
					}
				} else {
					setStatus("offline");
				}
			} catch {
				setStatus("offline");
			}
		}

		checkHealthAndStats();
		const interval = setInterval(checkHealthAndStats, 60000); // Check every minute
		return () => clearInterval(interval);
	}, []);

	return (
		<div
			className={cn(
				"flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors duration-500",
				status === "online" &&
					"border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
				status === "checking" &&
					"border-amber-500/30 bg-amber-500/10 text-amber-400",
				status === "offline" && "border-red-500/30 bg-red-500/10 text-red-400",
			)}
			title={
				status === "checking"
					? "Checking API..."
					: status === "online"
						? "Global Chat Online"
						: "Global Chat Offline"
			}
		>
			<span className="relative flex h-2 w-2">
				{status === "online" && (
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
				)}
				{status === "checking" && (
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
				)}
				{status === "offline" && (
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
				)}
				<span
					className={cn(
						"relative inline-flex h-2 w-2 rounded-full",
						status === "checking"
							? "bg-amber-500"
							: status === "online"
								? "bg-emerald-500"
								: "bg-red-500",
					)}
				/>
			</span>
			{serverCount !== null
				? `${serverCount.toLocaleString()} servers connected`
				: status === "checking"
					? "Loading stats..."
					: "Status unknown"}
		</div>
	);
}
