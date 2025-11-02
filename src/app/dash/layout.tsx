"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const navigation = [
	{ name: "Overview", href: "/dash" },
	{ name: "API Keys", href: "/dash/api-keys" },
	{ name: "Messages", href: "/dash/messages" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const pathname = usePathname();

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<h1 className="text-2xl font-bold">Dashboard</h1>
						</div>
						<nav className="flex space-x-8">
							{navigation.map((item) => {
								const isActive =
									pathname === item.href ||
									(item.href !== "/dash" && pathname?.startsWith(item.href));

								return (
									<Link
										key={item.name}
										href={item.href}
										className={cn(
											"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
											isActive
												? "border-primary text-foreground"
												: "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
										)}
									>
										{item.name}
									</Link>
								);
							})}
						</nav>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
		</div>
	);
}
