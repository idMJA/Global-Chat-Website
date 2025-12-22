"use client";

import { Key, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiService from "@/services/apiService";

interface MetricsData {
	totalRequests: number;
	successfulRequests: number;
	failedRequests: number;
	averageResponseTime: number;
	successRate: number;
	requestsByEndpoint: Record<string, number>;
}

export default function MetricsDashboard() {
	const [metrics, setMetrics] = useState<MetricsData | null>(null);
	const [hoursBack, setHoursBack] = useState(24);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await apiService.getGlobalMetrics(hoursBack);
				setMetrics(response.data);
			} catch (err) {
				console.error("Failed to load metrics:", err);
				setError(err instanceof Error ? err.message : "Failed to load metrics");
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [hoursBack]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-muted-foreground">Loading metrics...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-destructive">Error: {error}</div>
			</div>
		);
	}

	if (!metrics) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-muted-foreground">No data available</div>
			</div>
		);
	}
	const endpointData = Object.entries(metrics.requestsByEndpoint)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 10);

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">API Metrics Overview</h1>
				<select
					value={hoursBack}
					onChange={(e) => setHoursBack(Number(e.target.value))}
					className="px-4 py-2 border rounded-lg bg-background text-sm font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
				>
					<option value={1}>Last 1 hour</option>
					<option value={6}>Last 6 hours</option>
					<option value={24}>Last 24 hours</option>
					<option value={168}>Last 7 days</option>
					<option value={720}>Last 30 days</option>
				</select>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Total Requests"
					value={metrics.totalRequests.toLocaleString()}
					subtitle="All API requests"
				/>
				<StatCard
					title="Success Rate"
					value={`${metrics.successRate.toFixed(1)}%`}
					subtitle={`${metrics.successfulRequests.toLocaleString()} successful`}
				/>
				<StatCard
					title="Average Response Time"
					value={`${metrics.averageResponseTime.toFixed(0)}ms`}
					subtitle="Mean response time"
				/>
				<StatCard
					title="Failed Requests"
					value={metrics.failedRequests.toLocaleString()}
					subtitle="Errors and failures"
				/>
			</div>

			{/* Quick Access */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MessageSquare className="h-5 w-5" />
							Message Management
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<p className="text-sm text-muted-foreground">
							Search and delete messages across all connected servers using
							flexible message ID lookup.
						</p>
						<Link href="/dash/messages">
							<Button className="w-full">Go to Messages</Button>
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Key className="h-5 w-5" />
							API Key Management
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<p className="text-sm text-muted-foreground">
							Create and manage API keys with custom permissions for different
							access levels.
						</p>
						<Link href="/dash/api-keys">
							<Button className="w-full" variant="outline">
								Manage API Keys
							</Button>
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Key className="h-5 w-5" />
							Bans
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<p className="text-sm text-muted-foreground">
							View, ban and unban users or servers.
						</p>
						<Link href="/dash/bans">
							<Button className="w-full" variant="outline">
								Open Bans Dashboard
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Requests by Endpoint */}
				<Card>
					<CardHeader>
						<CardTitle>Top Endpoints</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{endpointData.length === 0 ? (
								<div className="text-center text-muted-foreground py-8">
									No endpoint data available
								</div>
							) : (
								endpointData.map(([endpoint, count]) => {
									const percentage = (count / metrics.totalRequests) * 100;
									return (
										<div key={endpoint} className="space-y-2">
											<div className="flex justify-between items-center text-sm">
												<span className="font-medium truncate">{endpoint}</span>
												<span className="text-muted-foreground ml-2">
													{count.toLocaleString()} ({percentage.toFixed(1)}%)
												</span>
											</div>
											<div className="w-full bg-secondary rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full transition-all duration-300"
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									);
								})
							)}
						</div>
					</CardContent>
				</Card>

				{/* Success vs Failed */}
				<Card>
					<CardHeader>
						<CardTitle>Request Status Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div className="flex items-center justify-center space-x-4">
								<div className="text-center">
									<div className="text-4xl font-bold text-green-500">
										{metrics.successfulRequests.toLocaleString()}
									</div>
									<div className="text-sm text-muted-foreground mt-1">
										Successful
									</div>
								</div>
								<div className="text-center">
									<div className="text-4xl font-bold text-red-500">
										{metrics.failedRequests.toLocaleString()}
									</div>
									<div className="text-sm text-muted-foreground mt-1">
										Failed
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-green-500 rounded"></div>
									<span className="text-sm">Success Rate</span>
									<span className="text-sm font-semibold ml-auto">
										{metrics.successRate.toFixed(2)}%
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-red-500 rounded"></div>
									<span className="text-sm">Error Rate</span>
									<span className="text-sm font-semibold ml-auto">
										{(100 - metrics.successRate).toFixed(2)}%
									</span>
								</div>
							</div>

							<div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
								<div className="flex h-full">
									<div
										className="bg-green-500"
										style={{ width: `${metrics.successRate}%` }}
									/>
									<div
										className="bg-red-500"
										style={{ width: `${100 - metrics.successRate}%` }}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
