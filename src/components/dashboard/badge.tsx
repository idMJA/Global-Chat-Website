import { cn } from "@/lib/utils";

interface BadgeProps {
	children: React.ReactNode;
	variant?: "success" | "error" | "warning" | "info" | "default";
	className?: string;
}

export function Badge({
	children,
	variant = "default",
	className,
}: BadgeProps) {
	const variantStyles = {
		success: "bg-green-100 text-green-800 border-green-200",
		error: "bg-red-100 text-red-800 border-red-200",
		warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
		info: "bg-blue-100 text-blue-800 border-blue-200",
		default: "bg-gray-100 text-gray-800 border-gray-200",
	};

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
				variantStyles[variant],
				className,
			)}
		>
			{children}
		</span>
	);
}
