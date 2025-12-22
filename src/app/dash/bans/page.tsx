"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import apiService from "@/services/apiService";

interface BanEntry {
	id: string;
	targetId: string;
	targetType: "user" | "server";
	targetName?: string | null;
	reason?: string | null;
	bannedBy?: string | null;
	bannedAt?: string | null;
	expiresAt?: string | null;
	isActive?: boolean;
	unbannedBy?: string | null;
	unbannedAt?: string | null;
}

export default function BansPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [userBans, setUserBans] = useState<BanEntry[]>([]);
	const [serverBans, setServerBans] = useState<BanEntry[]>([]);

	// Ban form
	const [userBanId, setUserBanId] = useState("");
	const [userBanReason, setUserBanReason] = useState("");
	const [userBanDuration, setUserBanDuration] = useState("");
	const [userBanLoading, setUserBanLoading] = useState(false);

	const [serverBanId, setServerBanId] = useState("");
	const [serverBanName, setServerBanName] = useState("");
	const [serverBanReason, setServerBanReason] = useState("");
	const [serverBanDuration, setServerBanDuration] = useState("");
	const [serverBanLoading, setServerBanLoading] = useState(false);

	const fetchBans = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const [uRes, sRes] = await Promise.all([
				apiService.getUserBans(),
				apiService.getServerBans(),
			]);

			const mapBan = (r: Record<string, unknown>): BanEntry => ({
				id: String(r.id ?? ""),
				targetId: String(r.targetId ?? r.target ?? ""),
				targetType: (r.targetType === "server" ? "server" : "user") as
					| "user"
					| "server",
				targetName: r.targetName ? String(r.targetName) : undefined,
				reason: r.reason ? String(r.reason) : undefined,
				bannedBy: r.bannedBy ? String(r.bannedBy) : undefined,
				bannedAt: r.bannedAt ? String(r.bannedAt) : undefined,
				expiresAt: r.expiresAt ? String(r.expiresAt) : undefined,
				isActive:
					typeof r.isActive === "boolean" ? r.isActive : Boolean(r.isActive),
				unbannedBy: r.unbannedBy ? String(r.unbannedBy) : undefined,
				unbannedAt: r.unbannedAt ? String(r.unbannedAt) : undefined,
			});

			setUserBans((uRes.data.bans || []).map(mapBan));
			setServerBans((sRes.data.bans || []).map(mapBan));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load bans");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBans();
	}, [fetchBans]);

	const handleBanUser = async () => {
		if (!userBanId.trim()) return alert("Please enter a user id");
		if (!confirm(`Ban user ${userBanId}?`)) return;
		try {
			setUserBanLoading(true);
			const res = await apiService.banUser(
				userBanId.trim(),
				userBanReason.trim() || undefined,
				userBanDuration.trim() || undefined,
			);
			alert(res.message || "User banned");
			setUserBanId("");
			setUserBanReason("");
			setUserBanDuration("");
			fetchBans();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Failed to ban user");
		} finally {
			setUserBanLoading(false);
		}
	};

	const handleBanServer = async () => {
		if (!serverBanId.trim()) return alert("Please enter a server id");
		if (!confirm(`Ban server ${serverBanId}?`)) return;
		try {
			setServerBanLoading(true);
			const res = await apiService.banServer(
				serverBanId.trim(),
				serverBanName.trim() || undefined,
				serverBanReason.trim() || undefined,
				serverBanDuration.trim() || undefined,
			);
			alert(res.message || "Server banned");
			setServerBanId("");
			setServerBanName("");
			setServerBanReason("");
			setServerBanDuration("");
			fetchBans();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Failed to ban server");
		} finally {
			setServerBanLoading(false);
		}
	};

	const handleUnban = async (ban: BanEntry) => {
		if (!confirm(`Unban ${ban.targetType} ${ban.targetId}?`)) return;
		try {
			if (ban.targetType === "user") {
				const res = await apiService.unbanUser(ban.targetId);
				alert(res.message || "User unbanned");
			} else {
				const res = await apiService.unbanServer(ban.targetId);
				alert(res.message || "Server unbanned");
			}
			fetchBans();
		} catch (err) {
			alert(err instanceof Error ? err.message : "Failed to unban");
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Bans Management</h1>
				<div className="flex gap-2">
					<Button onClick={fetchBans} variant="outline">
						Refresh
					</Button>
				</div>
			</div>

			{loading && <div className="text-muted-foreground">Loading bans...</div>}

			{error && <div className="text-destructive">Error: {error}</div>}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Ban User</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<Input
							placeholder="User ID"
							value={userBanId}
							onChange={(e) => setUserBanId(e.target.value)}
						/>
						<Input
							placeholder="Reason (optional)"
							value={userBanReason}
							onChange={(e) => setUserBanReason(e.target.value)}
						/>
						<Input
							placeholder="Duration (ISO 8601, e.g. P7D)"
							value={userBanDuration}
							onChange={(e) => setUserBanDuration(e.target.value)}
						/>
						<div className="flex gap-2">
							<Button
								onClick={handleBanUser}
								disabled={userBanLoading}
								variant="destructive"
							>
								Ban User
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Ban Server</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<Input
							placeholder="Server ID"
							value={serverBanId}
							onChange={(e) => setServerBanId(e.target.value)}
						/>
						<Input
							placeholder="Server Name (optional)"
							value={serverBanName}
							onChange={(e) => setServerBanName(e.target.value)}
						/>
						<Input
							placeholder="Reason (optional)"
							value={serverBanReason}
							onChange={(e) => setServerBanReason(e.target.value)}
						/>
						<Input
							placeholder="Duration (ISO 8601, e.g. PT24H)"
							value={serverBanDuration}
							onChange={(e) => setServerBanDuration(e.target.value)}
						/>
						<div className="flex gap-2">
							<Button
								onClick={handleBanServer}
								disabled={serverBanLoading}
								variant="destructive"
							>
								Ban Server
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="mt-6">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">User Bans</h2>
					</div>
					<DataTable
						data={userBans}
						columns={[
							{ header: "ID", accessor: (r: BanEntry) => r.targetId },
							{ header: "Reason", accessor: (r: BanEntry) => r.reason || "" },
							{
								header: "Banned By",
								accessor: (r: BanEntry) => r.bannedBy || "",
							},
							{
								header: "Banned At",
								accessor: (r: BanEntry) =>
									r.bannedAt ? new Date(r.bannedAt).toLocaleString() : "",
							},
							{
								header: "Expires At",
								accessor: (r: BanEntry) =>
									r.expiresAt ? new Date(r.expiresAt).toLocaleString() : "",
							},
							{
								header: "Active",
								accessor: (r: BanEntry) => (r.isActive ? "Yes" : "No"),
							},
							{
								header: "Actions",
								accessor: (r: BanEntry) => (
									<div className="flex gap-2">
										{r.isActive && (
											<Button
												size="sm"
												variant="outline"
												onClick={(e) => {
													e.stopPropagation();
													handleUnban(r);
												}}
											>
												Unban
											</Button>
										)}
									</div>
								),
							},
						]}
					/>
				</div>

				<div className="mt-8 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Server Bans</h2>
					</div>
					<DataTable
						data={serverBans}
						columns={[
							{ header: "ID", accessor: (r: BanEntry) => r.targetId },
							{ header: "Name", accessor: (r: BanEntry) => r.targetName || "" },
							{ header: "Reason", accessor: (r: BanEntry) => r.reason || "" },
							{
								header: "Banned By",
								accessor: (r: BanEntry) => r.bannedBy || "",
							},
							{
								header: "Banned At",
								accessor: (r: BanEntry) =>
									r.bannedAt ? new Date(r.bannedAt).toLocaleString() : "",
							},
							{
								header: "Expires At",
								accessor: (r: BanEntry) =>
									r.expiresAt ? new Date(r.expiresAt).toLocaleString() : "",
							},
							{
								header: "Active",
								accessor: (r: BanEntry) => (r.isActive ? "Yes" : "No"),
							},
							{
								header: "Actions",
								accessor: (r: BanEntry) => (
									<div className="flex gap-2">
										{r.isActive && (
											<Button
												size="sm"
												variant="outline"
												onClick={(e) => {
													e.stopPropagation();
													handleUnban(r);
												}}
											>
												Unban
											</Button>
										)}
									</div>
								),
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}
