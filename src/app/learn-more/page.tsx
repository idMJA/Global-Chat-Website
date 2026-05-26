"use client";

import {
	IconArrowLeft,
	IconMessages,
	IconRocket,
	IconShieldCheck,
	IconWorld,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LearnMore() {
	return (
		<div className="relative flex min-h-screen w-screen flex-col bg-zinc-950 text-foreground selection:bg-red-500/30 overflow-x-hidden">
			{/* Background Blobs */}
			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<motion.div
					animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
					className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-red-900/20 blur-[120px]"
				/>
				<motion.div
					animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
					transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[20%] -right-[10%] h-[50%] w-[40%] rounded-full bg-red-600/10 blur-[120px]"
				/>
			</div>

			<main className="relative flex flex-1 flex-col items-center py-12 md:py-24">
				<div className="container mx-auto px-6 max-w-4xl">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="mb-12"
					>
						<Link href="/">
							<Button
								variant="ghost"
								className="text-zinc-400 hover:text-white hover:bg-zinc-900"
							>
								<IconArrowLeft className="mr-2" size={18} />
								Back to Home
							</Button>
						</Link>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="space-y-8"
					>
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white to-red-500/50 bg-clip-text text-transparent">
							About Global Chat
						</h1>

						<p className="text-lg text-zinc-400 leading-relaxed">
							Global Chat is a revolutionary network designed to bridge isolated
							Discord communities. By connecting your server to our network, you
							open up a world of cross-server communication, collaboration, and
							shared experiences.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
							<div className="p-6 rounded-3xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-xl">
								<div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
									<IconWorld size={24} />
								</div>
								<h3 className="text-xl font-bold text-white mb-2">
									Cross-Server Bridge
								</h3>
								<p className="text-sm text-zinc-500 leading-relaxed">
									Connect multiple Discord servers into a single unified chat
									channel. Share messages, media, and ideas across the globe.
								</p>
							</div>

							<div className="p-6 rounded-3xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-xl">
								<div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
									<IconMessages size={24} />
								</div>
								<h3 className="text-xl font-bold text-white mb-2">
									Real-time Delivery
								</h3>
								<p className="text-sm text-zinc-500 leading-relaxed">
									Our high-performance infrastructure ensures that messages are
									delivered instantly across all connected servers with minimal
									latency.
								</p>
							</div>

							<div className="p-6 rounded-3xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-xl">
								<div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
									<IconShieldCheck size={24} />
								</div>
								<h3 className="text-xl font-bold text-white mb-2">
									Advanced Moderation
								</h3>
								<p className="text-sm text-zinc-500 leading-relaxed">
									Keep your community safe with our global blacklist and
									AI-powered moderation tools that filter toxic content
									automatically.
								</p>
							</div>

							<div className="p-6 rounded-3xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-xl">
								<div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
									<IconRocket size={24} />
								</div>
								<h3 className="text-xl font-bold text-white mb-2">
									Easy Integration
								</h3>
								<p className="text-sm text-zinc-500 leading-relaxed">
									Setup takes less than a minute. Choose your favorite member
									bot, invite it, and start chatting immediately.
								</p>
							</div>
						</div>

						<div className="mt-16 p-8 rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl text-center">
							<h2 className="text-2xl font-bold text-white mb-4">
								Ready to join the network?
							</h2>
							<p className="text-zinc-400 mb-8">
								Choose one of our partner bots from the home page and follow the
								simple setup instructions.
							</p>
							<Link href="/">
								<Button className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-2xl h-12 font-bold">
									Get Started Now
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>
			</main>

			<footer className="py-8 px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
				<div className="space-y-1">
					<p className="text-[10px] uppercase tracking-widest text-zinc-600">
						© {new Date().getFullYear()} Global Chat Network
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
				</div>
			</footer>
		</div>
	);
}
