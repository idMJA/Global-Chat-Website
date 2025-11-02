"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/dashboard/badge";
import { DataTable } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiService from "@/services/apiService";

interface RequestLog {
	id: string;
	endpoint: string;
	method: string;
	statusCode: number;
	responseTime: number;
	timestamp: string;
	success: boolean;
	errorMessage?: string;
}

interface ApiKeyMetrics {
	apiKeyId: string;
	apiKeyName: string;
	stats: {
		totalRequests: number;
		successfulRequests: number;
		failedRequests: number;
		averageResponseTime: number;
		successRate: number;
		requestsByEndpoint: Record<string, number>;
	};
	recentRequests: RequestLog[];
	page: {
		current: number;
		total: number;
		limit: number;
	};
}

export default function ApiKeyMetricsPage() {
	const params = useParams();
	const router = useRouter();
	const keyId = params?.keyId as string;

	const [data, setData] = useState<ApiKeyMetrics | null>(null);
	const [page, setPage] = useState(1);
	const [hoursBack, setHoursBack] = useState(24);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadMetrics = useCallback(async () => {
		if (!keyId) return;

		try {
			setLoading(true);
			setError(null);
			const response = await apiService.getApiKeyMetrics(
				keyId,
				page,
				50,
				hoursBack,
			);
			setData(response.data);
		} catch (err) {
			console.error("Failed to load metrics:", err);
			setError(err instanceof Error ? err.message : "Failed to load metrics");
		} finally {
			setLoading(false);
		}
	}, [keyId, page, hoursBack]);

	useEffect(() => {
		loadMetrics();
	}, [loadMetrics]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-muted-foreground">Loading metrics...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-64 space-y-4">
				<div className="text-destructive">Error: {error}</div>
				<Button onClick={() => router.push("/dash/api-keys")}>
					Back to API Keys
				</Button>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex flex-col items-center justify-center h-64 space-y-4">
				<div className="text-muted-foreground">No data available</div>
				<Button onClick={() => router.push("/dash/api-keys")}>
					Back to API Keys
				</Button>
			</div>
		);
	}

	const endpointData = Object.entries(data.stats.requestsByEndpoint)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 10);

	const requestColumns = [
		{
			header: "Endpoint",
			accessor: "endpoint" as keyof RequestLog,
			key: "endpoint",
		},
		{
			header: "Method",
			accessor: (row: RequestLog) => <Badge variant="info">{row.method}</Badge>,
			key: "method",
		},
		{
			header: "Status Code",
			accessor: (row: RequestLog) => {
				const variant =
					row.statusCode >= 200 && row.statusCode < 300
						? "success"
						: row.statusCode >= 400
							? "error"
							: "warning";
				return <Badge variant={variant}>{row.statusCode}</Badge>;
			},
			key: "statusCode",
		},
		{
			header: "Response Time",
			accessor: (row: RequestLog) => `${row.responseTime}ms`,
			key: "responseTime",
		},
		{
			header: "Timestamp",
			accessor: (row: RequestLog) => new Date(row.timestamp).toLocaleString(),
			key: "timestamp",
		},
		{
			header: "Status",
			accessor: (row: RequestLog) => (
				<Badge variant={row.success ? "success" : "error"}>
					{row.success ? "Success" : "Failed"}
				</Badge>
			),
			key: "status",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div className="space-y-1">
					<Button
						variant="outline"
						size="sm"
						onClick={() => router.push("/dash/api-keys")}
						className="mb-2"
					>
						← Back to API Keys
					</Button>
					<h1 className="text-3xl font-bold">Metrics for {data.apiKeyName}</h1>
					<p className="text-muted-foreground">API Key ID: {data.apiKeyId}</p>
				</div>
				<select
					value={hoursBack}
					onChange={(e) => {
						setHoursBack(Number(e.target.value));
						setPage(1);
					}}
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
					value={data.stats.totalRequests.toLocaleString()}
					subtitle="All requests"
				/>
				<StatCard
					title="Success Rate"
					value={`${data.stats.successRate.toFixed(1)}%`}
					subtitle={`${data.stats.successfulRequests.toLocaleString()} successful`}
				/>
				<StatCard
					title="Average Response Time"
					value={`${data.stats.averageResponseTime.toFixed(0)}ms`}
					subtitle="Mean response time"
				/>
				<StatCard
					title="Failed Requests"
					value={data.stats.failedRequests.toLocaleString()}
					subtitle="Errors and failures"
				/>
			</div>

			{/* Endpoint Distribution */}
			<Card>
				<CardHeader>
					<CardTitle>Requests by Endpoint</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{endpointData.length === 0 ? (
							<div className="text-center text-muted-foreground py-8">
								No endpoint data available
							</div>
						) : (
							endpointData.map(([endpoint, count]) => {
								const percentage = (count / data.stats.totalRequests) * 100;
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

			{/* Recent Requests */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Requests</CardTitle>
				</CardHeader>
				<CardContent>
					{data.recentRequests.length === 0 ? (
						<div className="text-center text-muted-foreground py-8">
							No recent requests
						</div>
					) : (
						<>
							<DataTable data={data.recentRequests} columns={requestColumns} />

							{/* Pagination */}
							{data.page.total > 1 && (
								<div className="flex justify-center items-center space-x-4 mt-6">
									<Button
										variant="outline"
										disabled={page === 1}
										onClick={() => setPage(page - 1)}
									>
										Previous
									</Button>
									<span className="text-sm text-muted-foreground">
										Page {data.page.current} of {data.page.total}
									</span>
									<Button
										variant="outline"
										disabled={page === data.page.total}
										onClick={() => setPage(page + 1)}
									>
										Next
									</Button>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
