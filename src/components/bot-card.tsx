"use client";

import {
	IconBrandDiscord,
	IconChevronRight,
	IconWorld,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Bot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BotCardProps {
	bot: Bot;
	compact?: boolean;
}

export function BotCard({ bot, compact }: BotCardProps) {
	const variantStyles = {
		left: compact ? "lg:hover:translate-x-1" : "md:hover:-translate-x-2",
		middle: compact ? "lg:hover:-translate-y-1" : "md:hover:-translate-y-2",
		right: compact ? "lg:hover:translate-x-1" : "md:hover:translate-x-2",
	};

	return (
		<Card
			className={cn(
				"group relative flex flex-col h-full overflow-hidden border-zinc-800/50 bg-zinc-900/40 backdrop-blur-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10",
				compact ? "p-4" : "p-6",
				variantStyles[bot.cardVariant],
			)}
		>
			<div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-red-500/10 blur-3xl transition-all group-hover:bg-red-500/20" />
			<div className="absolute -left-4 -bottom-4 h-32 w-32 rounded-full bg-zinc-500/10 blur-3xl transition-all group-hover:bg-zinc-500/20" />

			<CardHeader
				className={cn(
					"relative flex-row items-center gap-4 space-y-0",
					compact ? "p-0 mb-3" : "p-6 pt-0",
				)}
			>
				<div className="relative">
					<Avatar
						className={cn(
							"rounded-2xl ring-2 ring-zinc-100 transition-transform duration-500 group-hover:scale-110 dark:ring-zinc-800",
							compact ? "h-12 w-12" : "h-16 w-16",
						)}
					>
						<AvatarImage
							src={bot.avatar}
							alt={bot.name}
							className="object-cover"
						/>
						<AvatarFallback>
							{bot.name.substring(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div
						className={cn(
							"absolute -bottom-1 -right-1 rounded-full border-2 border-zinc-900",
							compact ? "h-4 w-4" : "h-5 w-5",
							bot.status === "online"
								? "bg-emerald-500"
								: bot.status === "idle"
									? "bg-amber-500"
									: bot.status === "dnd"
										? "bg-red-500"
										: "bg-zinc-500",
						)}
						title={
							bot.status
								? bot.status.charAt(0).toUpperCase() + bot.status.slice(1)
								: "Offline"
						}
					/>
				</div>
				<div className="flex flex-col">
					<CardTitle
						className={cn(
							"font-bold tracking-tight text-zinc-900 dark:text-white",
							compact ? "text-lg" : "text-xl",
						)}
					>
						{bot.name}
					</CardTitle>
					<div className="mt-1">
						<Badge
							variant="outline"
							className={cn(
								"border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
								compact ? "text-[10px] px-2 py-0" : "",
							)}
						>
							{bot.developer}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className={cn("relative flex-1", compact && "p-0 mb-4")}>
				<CardDescription
					className={cn(
						"leading-relaxed text-zinc-600 dark:text-zinc-400 min-h-[60px]",
						compact ? "text-xs" : "text-sm",
					)}
				>
					{bot.description}
				</CardDescription>
			</CardContent>

			<CardFooter
				className={cn(
					"relative mt-auto flex flex-wrap gap-2",
					compact ? "pt-3 pb-3 px-0" : "p-6 pt-4 pb-4",
				)}
			>
				<Button
					asChild
					variant="secondary"
					size={compact ? "xs" : "sm"}
					className={cn(
						"rounded-xl bg-zinc-800 font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",
						compact && "h-8 px-3 text-[10px]",
					)}
				>
					<a href={bot.websiteUrl} target="_blank" rel="noopener noreferrer">
						<IconWorld size={compact ? 14 : 18} className="mr-2" />
						Website
					</a>
				</Button>
				<Button
					asChild
					variant="outline"
					size={compact ? "xs" : "sm"}
					className={cn(
						"rounded-xl border-zinc-700 font-semibold text-zinc-300 hover:bg-zinc-800/50 hover:text-white",
						compact && "h-8 px-3 text-[10px]",
					)}
				>
					<a href={bot.supportUrl} target="_blank" rel="noopener noreferrer">
						<IconBrandDiscord size={compact ? 14 : 18} className="mr-2" />
						Support
					</a>
				</Button>

				<div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 flex items-center justify-center">
					<IconChevronRight
						className="text-zinc-400"
						size={compact ? 20 : 24}
					/>
				</div>
			</CardFooter>
		</Card>
	);
}
