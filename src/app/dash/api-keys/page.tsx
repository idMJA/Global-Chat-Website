"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/dashboard/badge";
import { CreateApiKeyDialog } from "@/components/dashboard/create-api-key-dialog";
import { DataTable } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiService from "@/services/apiService";

interface ApiKey {
	id: string;
	name: string;
	permissions: string[];
	createdBy: string;
	createdAt: string;
	lastUsedAt?: string;
	isActive: boolean;
}

export default function ApiKeysPage() {
	const router = useRouter();
	const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadApiKeys = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await apiService.listApiKeys();
			setApiKeys(response.data.apiKeys);
		} catch (err) {
			console.error("Failed to load API keys:", err);
			setError(err instanceof Error ? err.message : "Failed to load API keys");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadApiKeys();
	}, [loadApiKeys]);

	const handleToggleStatus = async (keyId: string, isActive: boolean) => {
		try {
			await apiService.toggleApiKeyStatus(keyId, !isActive);
			await loadApiKeys();
		} catch (err) {
			console.error("Failed to toggle status:", err);
			alert("Failed to toggle API key status");
		}
	};

	const handleDeleteKey = async (keyId: string) => {
		if (
			!confirm(
				"Are you sure you want to delete this API key? This action cannot be undone.",
			)
		) {
			return;
		}

		try {
			await apiService.deleteApiKey(keyId);
			await loadApiKeys();
		} catch (err) {
			console.error("Failed to delete API key:", err);
			alert("Failed to delete API key");
		}
	};

	const handleViewMetrics = (keyId: string) => {
		router.push(`/dash/api-keys/${keyId}`);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-muted-foreground">Loading API keys...</div>
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

	const activeKeys = apiKeys.filter((k) => k.isActive).length;
	const inactiveKeys = apiKeys.length - activeKeys;

	const columns = [
		{
			header: "Name",
			accessor: "name" as keyof ApiKey,
			key: "name",
		},
		{
			header: "Permissions",
			accessor: (row: ApiKey) => (
				<div className="flex flex-wrap gap-1">
					{row.permissions.map((perm) => (
						<Badge key={perm} variant="info">
							{perm}
						</Badge>
					))}
				</div>
			),
			key: "permissions",
		},
		{
			header: "Created By",
			accessor: "createdBy" as keyof ApiKey,
			key: "createdBy",
		},
		{
			header: "Created At",
			accessor: (row: ApiKey) => new Date(row.createdAt).toLocaleDateString(),
			key: "createdAt",
		},
		{
			header: "Last Used",
			accessor: (row: ApiKey) =>
				row.lastUsedAt
					? new Date(row.lastUsedAt).toLocaleDateString()
					: "Never",
			key: "lastUsedAt",
		},
		{
			header: "Status",
			accessor: (row: ApiKey) => (
				<Badge variant={row.isActive ? "success" : "error"}>
					{row.isActive ? "Active" : "Inactive"}
				</Badge>
			),
			key: "status",
		},
		{
			header: "Actions",
			accessor: (row: ApiKey) => (
				<div className="flex space-x-2">
					<Button
						size="sm"
						variant="outline"
						onClick={(e) => {
							e.stopPropagation();
							handleViewMetrics(row.id);
						}}
					>
						Metrics
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={(e) => {
							e.stopPropagation();
							handleToggleStatus(row.id, row.isActive);
						}}
					>
						{row.isActive ? "Deactivate" : "Activate"}
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={(e) => {
							e.stopPropagation();
							handleDeleteKey(row.id);
						}}
						className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
					>
						Delete
					</Button>
				</div>
			),
			key: "actions",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">API Keys Management</h1>
				<CreateApiKeyDialog onSuccess={loadApiKeys} />
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<StatCard
					title="Total Keys"
					value={apiKeys.length}
					subtitle="All API keys"
				/>
				<StatCard
					title="Active Keys"
					value={activeKeys}
					subtitle="Currently enabled"
				/>
				<StatCard
					title="Inactive Keys"
					value={inactiveKeys}
					subtitle="Currently disabled"
				/>
			</div>

			{/* API Keys Table */}
			<Card>
				<CardHeader>
					<CardTitle>All API Keys</CardTitle>
				</CardHeader>
				<CardContent>
					{apiKeys.length === 0 ? (
						<div className="text-center text-muted-foreground py-8">
							No API keys found
						</div>
					) : (
						<DataTable data={apiKeys} columns={columns} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}
