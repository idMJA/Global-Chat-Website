"use client";

import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Search,
	Server,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import apiService from "@/services/apiService";

interface MessageInfo {
	originalMessageId: string;
	content: string;
	author: string;
	authorId?: string;
	originalGuildId?: string;
	originalChannelId?: string;
	serverMessages: Array<{
		guildId: string;
		messageId: string;
	}>;
	totalServers: number;
}

interface DeleteResult {
	originalMessageId: string;
	totalServers: number;
	successCount: number;
	failedCount: number;
	errors?: Array<{
		guildId: string;
		error: string;
	}>;
}

interface DeleteWarning {
	status: "warning";
	message: string;
	error: string;
	suggestion: string;
}

export function MessageSearch() {
	const [messageId, setMessageId] = useState("");
	const [loading, setLoading] = useState(false);
	const [messageInfo, setMessageInfo] = useState<MessageInfo | null>(null);
	const [deleteResult, setDeleteResult] = useState<DeleteResult | null>(null);
	const [deleteWarning, setDeleteWarning] = useState<DeleteWarning | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);

	// no ban UI here; only showing authorId

	const handleSearch = async () => {
		if (!messageId.trim()) {
			setError("Please enter a message ID");
			return;
		}

		setLoading(true);
		setError(null);
		setMessageInfo(null);
		setDeleteResult(null);
		setDeleteWarning(null);

		try {
			const response = await apiService.getMessageInfo(messageId.trim());
			setMessageInfo(response.data);

			// nothing else to prefill here; we only display authorId
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch message info",
			);
		} finally {
			setLoading(false);
		}
	};

	// no ban handler in this component

	const handleDelete = async () => {
		if (!messageId.trim()) return;

		if (
			!confirm("Are you sure you want to delete this message from ALL servers?")
		) {
			return;
		}

		setLoading(true);
		setError(null);
		setDeleteWarning(null);

		try {
			const response = await apiService.deleteMessage(messageId.trim());

			// Check if it's a warning response (202 status)
			if (
				response &&
				typeof response === "object" &&
				"status" in response &&
				response.status === "warning"
			) {
				setDeleteWarning(response as unknown as DeleteWarning);
				setMessageInfo(null);
			} else {
				setDeleteResult(response.data);
				setMessageInfo(null);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete message");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Message Management</CardTitle>
					<CardDescription>
						Search for messages using any message ID (original or from any
						server) and delete them from all servers
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex gap-2">
						<Input
							placeholder="Enter message ID"
							value={messageId}
							onChange={(e) => setMessageId(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							disabled={loading}
						/>
						<Button
							onClick={handleSearch}
							disabled={loading || !messageId.trim()}
						>
							<Search className="mr-2 h-4 w-4" />
							Search
						</Button>
					</div>
				</CardContent>
			</Card>

			{error && (
				<Card className="border-destructive">
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 text-destructive">
							<AlertCircle className="h-5 w-5" />
							<p>{error}</p>
						</div>
					</CardContent>
				</Card>
			)}

			{messageInfo && (
				<Card>
					<CardHeader>
						<CardTitle>Message Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Original Message ID
							</p>
							<p className="font-mono text-sm">
								{messageInfo.originalMessageId}
							</p>

							{messageInfo.originalGuildId && (
								<div className="mt-2">
									<p className="text-xs text-muted-foreground">
										Original Guild
									</p>
									<p className="font-mono text-sm">
										{messageInfo.originalGuildId}
									</p>
								</div>
							)}

							{messageInfo.originalChannelId && (
								<div className="mt-2">
									<p className="text-xs text-muted-foreground">
										Original Channel
									</p>
									<p className="font-mono text-sm">
										{messageInfo.originalChannelId}
									</p>
								</div>
							)}
						</div>

						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Author
							</p>
							<div className="flex items-center gap-2">
								<p className="text-sm">{messageInfo.author}</p>
								{messageInfo.authorId && (
									<span className="text-xs font-mono text-muted-foreground">
										{messageInfo.authorId}
									</span>
								)}
							</div>
						</div>

						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Content
							</p>
							<p className="text-sm bg-muted p-3 rounded-md break-words">
								{messageInfo.content}
							</p>
						</div>

						<div>
							<p className="text-sm font-medium text-muted-foreground mb-2">
								Server Messages ({messageInfo.totalServers} servers)
							</p>
							<div className="space-y-2">
								{messageInfo.serverMessages.map((server) => (
									<div
										key={server.guildId}
										className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md"
									>
										<Server className="h-4 w-4 text-muted-foreground" />
										<span className="font-medium">{server.guildId}:</span>
										<span className="font-mono">{server.messageId}</span>
									</div>
								))}
							</div>
						</div>

						{/* authorId displayed above; no ban UI here */}

						<Button
							onClick={handleDelete}
							disabled={loading}
							variant="destructive"
							className="w-full mt-4"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete from All Servers
						</Button>
					</CardContent>
				</Card>
			)}

			{deleteResult && (
				<Card className="border-green-500">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-green-600">
							<CheckCircle2 className="h-5 w-5" />
							Deletion Complete
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-muted-foreground">Original Message ID</p>
								<p className="font-mono">{deleteResult.originalMessageId}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Total Servers</p>
								<p className="font-semibold">{deleteResult.totalServers}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Successful</p>
								<p className="font-semibold text-green-600">
									{deleteResult.successCount}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">Failed</p>
								<p className="font-semibold text-destructive">
									{deleteResult.failedCount}
								</p>
							</div>
						</div>

						{deleteResult.errors && deleteResult.errors.length > 0 && (
							<div>
								<p className="text-sm font-medium text-destructive mb-2">
									Errors:
								</p>
								<div className="space-y-1">
									{deleteResult.errors.map((err) => (
										<div
											key={err.guildId}
											className="text-sm bg-destructive/10 p-2 rounded-md"
										>
											<span className="font-medium">{err.guildId}:</span>{" "}
											{err.error}
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{deleteWarning && (
				<Card className="border-yellow-500">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-yellow-600">
							<AlertTriangle className="h-5 w-5" />
							Operation Status Uncertain
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-md space-y-2">
							<p className="text-sm font-medium">{deleteWarning.message}</p>
							<p className="text-sm text-muted-foreground">
								{deleteWarning.error}
							</p>
						</div>

						<div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md">
							<p className="text-sm font-medium mb-2">💡 What to do next:</p>
							<p className="text-sm text-muted-foreground">
								{deleteWarning.suggestion}
							</p>
						</div>

						<Button onClick={handleSearch} variant="outline" className="w-full">
							<Search className="mr-2 h-4 w-4" />
							Verify Message Status
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
