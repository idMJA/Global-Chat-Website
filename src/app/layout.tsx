import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Global Chat | Connected Communities",
	description:
		"Bridge your Discord servers with our Global Chat network of member bots.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				"dark",
				geistSans.variable,
				geistMono.variable,
				"font-mono",
				jetbrainsMono.variable,
			)}
		>
			<body
				className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300"
				suppressHydrationWarning
			>
				{children}
			</body>
		</html>
	);
}
