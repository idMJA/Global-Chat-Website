"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { BotCard } from "@/components/bot-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Bot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MembersSectionProps {
	compact?: boolean;
}

export function MembersSection({ compact }: MembersSectionProps) {
	const [members, setMembers] = useState<Bot[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchMembers() {
			try {
				const response = await fetch("/api/members");
				const data = await response.json();
				setMembers(data);
			} catch (error) {
				console.error("Failed to fetch members:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchMembers();
	}, []);

	return (
		<section
			id="members"
			className={cn("w-full", compact ? "py-0" : "py-24 sm:py-32")}
		>
			<div
				className={cn(
					"container mx-auto px-4 md:px-6",
					compact && "max-w-none",
				)}
			>
				{!compact && (
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<Badge
								variant="outline"
								className="mb-4 border-red-500/30 bg-red-500/10 text-red-400"
							>
								Our Network
							</Badge>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								Connected Member Bots
							</h2>
							<p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
								Meet the amazing bots that are part of our Global Chat
								ecosystem. Each bot brings unique features and community to the
								network.
							</p>
						</div>
					</div>
				)}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
					className={cn(
						"mx-auto grid gap-4 items-stretch",
						compact
							? "grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
							: "mt-16 max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
					)}
				>
					{loading
						? Array.from({ length: 3 }).map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Skeletons do not reorder
								<div key={`skeleton-${i}`} className="flex flex-col space-y-3">
									<Skeleton
										className={cn(
											"w-full rounded-3xl",
											compact ? "h-[200px]" : "h-[300px]",
										)}
									/>
								</div>
							))
						: members.map((bot) => (
								<motion.div
									key={bot.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									className="h-full"
								>
									<BotCard bot={bot} compact={compact} />
								</motion.div>
							))}
				</motion.div>
			</div>
		</section>
	);
}
