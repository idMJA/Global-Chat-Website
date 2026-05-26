"use client";

import { IconBrandDiscord } from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { MembersSection } from "@/components/members-section";
import { SystemStatus } from "@/components/system-status";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="relative flex min-h-screen w-screen flex-col bg-zinc-950 text-foreground selection:bg-red-500/30 overflow-x-hidden">
			{/* Background Blobs */}
			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<motion.div
					animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
					className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-red-900/20 blur-[120px]"
				/>
				<motion.div
					animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
					transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[20%] -right-[10%] h-[50%] w-[40%] rounded-full bg-red-600/10 blur-[120px]"
				/>
			</div>

			<main className="relative flex flex-1 flex-col items-center justify-center py-12 md:py-20">
				{/* Top: Hero */}
				<section className="container mx-auto flex flex-col items-center justify-center px-6 text-center mb-16">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="mb-6 flex justify-center w-full"
					>
						<SystemStatus />
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="max-w-4xl bg-gradient-to-br from-white via-white to-red-500/50 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl"
					>
						Connect Your Community
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-zinc-400"
					>
						Global Chat bridges the gap between Discord servers through our
						network of specialized member bots.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="mt-10 flex flex-row gap-4"
					>
						<Link href="https://discord.gg/idn" target="_blank">
							<Button
								size="lg"
								className="h-12 rounded-2xl bg-red-600 px-8 font-bold text-white hover:bg-red-700"
							>
								<IconBrandDiscord className="mr-2" size={20} />
								Join Support Server
							</Button>
						</Link>
						<Link href="/learn-more">
							<Button
								size="lg"
								variant="outline"
								className="h-12 rounded-2xl border-zinc-800 text-zinc-300 hover:bg-zinc-800"
							>
								Learn More
							</Button>
						</Link>
					</motion.div>
				</section>

				{/* Bottom: Members */}
				<section className="container mx-auto px-6">
					<MembersSection compact />
				</section>
			</main>

			{/* Footer */}
			<footer className="py-8 px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
				<div className="space-y-4">
					<p className="text-[10px] uppercase tracking-widest text-zinc-600">
						© {new Date().getFullYear()} Discord ID
					</p>
				</div>

				<div className="text-left md:text-right space-y-1">
					<p className="text-[10px] uppercase tracking-widest text-zinc-500">
						Made by{" "}
						<a
							href="https://mja.moe"
							target="_blank"
							rel="noopener noreferrer"
							className="text-zinc-400 hover:text-red-400 transition-colors"
						>
							アーリャ (aka. iaMJ)
						</a>
					</p>
					<p className="text-[10px] uppercase tracking-widest text-zinc-600">
						Maintained by{" "}
						<a
							href="https://www.discord.my.id"
							target="_blank"
							rel="noopener noreferrer"
							className="text-zinc-400 hover:text-red-400 transition-colors"
						>
							Discord ID Team
						</a>
					</p>
					<p className="text-[10px] uppercase tracking-widest text-zinc-600">
						Hosted by{" "}
						<a
							href="https://github.com/TronixDev"
							target="_blank"
							rel="noopener noreferrer"
							className="text-zinc-400 hover:text-red-400 transition-colors"
						>
							Tronix Developments
						</a>
					</p>
				</div>
			</footer>
		</div>
	);
}
