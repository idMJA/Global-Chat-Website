"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { ReactElement } from "react";

interface Bot {
	id: string;
	name: string;
	developer: string;
	description: string;
	avatar: string;
	websiteUrl: string;
	supportUrl: string;
	cardVariant: "left" | "middle" | "right";
}

export default function Home(): ReactElement {
	// Bot data configuration - easy to add new bots here
	const botsData: Bot[] = [
		{
			id: "alya-chan",
			name: "Alya-chan",
			developer: "Tronix Developments",
			description:
				"The versatile bot with everything you need! Advanced multipurpose bot with AI features, auto-moderation, and comprehensive server management tools.",
			avatar: "/icon/alya.png",
			websiteUrl: "https://alyaa.site",
			supportUrl: "https://dc.gg/tx",
			cardVariant: "left",
		},
		{
			id: "yuki-suou",
			name: "Yuki Suou",
			developer: "KH1EV Community",
			description:
				"Enjoy the bot to have fun with your Discord server. From imagination to reality featuring AI Chatbot from Meta AI Contribution and use the bot anytime, anywhere, and immerse yourself in the ultimate anime experience!",
			avatar: "/icon/yuki.png",
			websiteUrl: "https://yukisuou.xyz",
			supportUrl: "https://discord.gg/MwNE7Vfb6t",
			cardVariant: "middle",
		},
		{
			id: "kythia",
			name: "Kythia",
			developer: "Kythia Labs",
			description:
				"Meet Kythia Hye-Jin, your cutest and beautiful companion! More than just a bot, she brings your server to life with AI, Music, Economy, and Auto-Moderation to keep it secure.",
			avatar: "/icon/kythia.png",
			websiteUrl: "https://kythia.my.id",
			supportUrl: "https://dsc.gg/kythia",
			cardVariant: "right",
		},
	];

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0 },
	};

	const cardVariants: Variants = {
		hidden: { opacity: 0, x: -100, rotateY: -15 },
		visible: { opacity: 1, x: 0, rotateY: 0 },
	};

	const cardVariantsRight: Variants = {
		hidden: { opacity: 0, x: 100, rotateY: 15 },
		visible: { opacity: 1, x: 0, rotateY: 0 },
	};

	const cardVariantsMiddle: Variants = {
		hidden: { opacity: 0, y: 100, scale: 0.95 },
		visible: { opacity: 1, y: 0, scale: 1 },
	};

	return (
		<div className="min-h-screen bg-black relative overflow-hidden">
			{/* Animated background gradient effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20" />
			<motion.div
				className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
				animate={{
					scale: [1, 1.1, 1],
					opacity: [0.3, 0.6, 0.3],
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"
				animate={{
					scale: [1, 1.1, 1],
					opacity: [0.3, 0.6, 0.3],
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1,
				}}
			/>

			{/* Floating particles */}
			<motion.div
				className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full"
				animate={{ y: [-10, 10, -10] }}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full"
				animate={{ y: [-10, 10, -10] }}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1,
				}}
			/>
			<motion.div
				className="absolute bottom-40 left-20 w-3 h-3 bg-white/10 rounded-full"
				animate={{ y: [-10, 10, -10] }}
				transition={{
					duration: 5,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 2,
				}}
			/>
			<motion.div
				className="absolute top-60 left-1/3 w-1 h-1 bg-white/25 rounded-full"
				animate={{ y: [-10, 10, -10] }}
				transition={{
					duration: 3.5,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0.5,
				}}
			/>
			<motion.div
				className="absolute bottom-60 right-1/3 w-2 h-2 bg-white/15 rounded-full"
				animate={{ y: [-10, 10, -10] }}
				transition={{
					duration: 4.5,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1.5,
				}}
			/>

			<motion.div
				className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* Header with entrance animation */}
				<motion.div
					className="text-center mb-16"
					variants={itemVariants}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<motion.h1
						className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
						initial={{ opacity: 0, y: -50, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ duration: 1.2, ease: "easeOut" }}
					>
						Global Chat
					</motion.h1>
					<motion.p
						className="text-gray-400 text-lg max-w-2xl mx-auto"
						variants={itemVariants}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
					>
						This is our member who integrates to create communication between
						servers.
					</motion.p>
				</motion.div>

				{/* Bot Cards with staggered entrance */}
				<div className="flex flex-wrap justify-center gap-12 max-w-6xl">
					{botsData.map((bot) => {
						let cardVariantsChoice: Variants | undefined;
						if (bot.cardVariant === "left") {
							cardVariantsChoice = cardVariants;
						} else if (bot.cardVariant === "right") {
							cardVariantsChoice = cardVariantsRight;
						} else if (bot.cardVariant === "middle") {
							cardVariantsChoice = cardVariantsMiddle;
						}
						return (
							<motion.div
								key={bot.id}
								variants={cardVariantsChoice}
								transition={{ duration: 1, ease: "easeOut" }}
								whileHover={{
									scale: 1.1,
									rotate:
										bot.cardVariant === "left"
											? 1
											: bot.cardVariant === "right"
												? -1
												: 0,
									transition: { duration: 0.3 },
								}}
								whileTap={{ scale: 0.95 }}
							>
								<Card className="w-80 min-h-[460px] flex flex-col bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 group">
									<CardHeader className="text-center pb-6">
										<motion.div
											className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-500 overflow-hidden"
											whileHover={{
												rotate:
													bot.cardVariant === "left"
														? 12
														: bot.cardVariant === "right"
															? -12
															: 0,
												scale: 1.03,
											}}
											transition={{ duration: 0.5 }}
										>
											<div className="relative w-full h-full">
												<Image
													src={bot.avatar}
													alt={`${bot.name} avatar`}
													fill
													className="object-cover"
												/>
											</div>
										</motion.div>
										<CardTitle className="text-white text-2xl font-bold transition-all duration-300 group-hover:text-gray-100">
											{bot.name}
										</CardTitle>
										<CardDescription className="text-gray-300 text-base font-medium transition-all duration-300 group-hover:text-white">
											{bot.developer}
										</CardDescription>
									</CardHeader>
									<CardContent className="flex-1 flex flex-col justify-between text-center space-y-6 pt-0">
										<p className="text-gray-300 text-sm leading-relaxed transition-all duration-300 group-hover:text-gray-100">
											{bot.description}
										</p>
										<div className="flex gap-3 justify-center">
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<Button
													variant="outline"
													size="sm"
													className="bg-white text-black border-white hover:bg-gray-200 hover:text-black font-medium px-6 transition-all duration-300 hover:shadow-lg"
													onClick={() => window.open(bot.websiteUrl, "_blank")}
												>
													Website
												</Button>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<Button
													variant="outline"
													size="sm"
													className="bg-transparent text-white border border-white/20 hover:bg-white hover:text-black font-medium px-6 transition-all duration-300 hover:shadow-lg"
													onClick={() => window.open(bot.supportUrl, "_blank")}
												>
													Support
												</Button>
											</motion.div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</div>

				{/* Footer (fixed bottom-right) */}
				<motion.div
					className="fixed right-4 bottom-4 z-50"
					variants={itemVariants}
					initial="hidden"
					animate="visible"
					transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
				>
					<motion.a
						href="https://mjba.my"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-500 text-sm transition-all duration-300 hover:text-gray-400 bg-black/40 px-3 py-2 rounded-md backdrop-blur-sm inline-block"
						whileHover={{ scale: 1.05 }}
					>
						made by アーリャ
					</motion.a>
				</motion.div>
			</motion.div>
		</div>
	);
}
