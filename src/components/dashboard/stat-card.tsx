import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon?: React.ReactNode;
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

export function StatCard({
	title,
	value,
	subtitle,
	icon,
	trend,
}: StatCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{subtitle && (
					<p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
				)}
				{trend && (
					<div
						className={`text-xs mt-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
					>
						{trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
					</div>
				)}
			</CardContent>
		</Card>
	);
}
