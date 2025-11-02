"use client";

import { MessageSquare, Shield, Trash2 } from "lucide-react";
import { MessageSearch } from "@/components/dashboard/message-search";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function MessagesPage() {
	return (
		<div className="container mx-auto p-6 space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Message Management
				</h1>
				<p className="text-muted-foreground mt-2">
					View and delete messages across all connected servers
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Flexible Search
						</CardTitle>
						<MessageSquare className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							Search using any message ID from any server
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Global Deletion
						</CardTitle>
						<Trash2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							Delete messages from all servers at once
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Permission Required
						</CardTitle>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							Requires{" "}
							<code className="text-xs bg-muted px-1 py-0.5 rounded">
								delete:message
							</code>{" "}
							permission
						</p>
					</CardContent>
				</Card>
			</div>

			<MessageSearch />

			<Card>
				<CardHeader>
					<CardTitle>How It Works</CardTitle>
					<CardDescription>
						Understanding flexible message ID lookup
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 text-sm">
					<div>
						<h4 className="font-semibold mb-2">
							🔍 Flexible Message ID Search
						</h4>
						<p className="text-muted-foreground">
							You can use ANY message ID from ANY server to search for messages.
							The system will automatically find the original message and all
							its copies across servers.
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-2">🗑️ Global Deletion</h4>
						<p className="text-muted-foreground">
							When you delete a message, it will be removed from ALL connected
							servers simultaneously. You&apos;ll receive a detailed report
							showing success/failure for each server.
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-2">🔐 Required Permissions</h4>
						<ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
							<li>
								<code className="bg-muted px-1 py-0.5 rounded">
									view:message_info
								</code>{" "}
								- View message details
							</li>
							<li>
								<code className="bg-muted px-1 py-0.5 rounded">
									delete:message
								</code>{" "}
								- Delete messages
							</li>
						</ul>
					</div>

					<div className="bg-muted p-4 rounded-lg">
						<h4 className="font-semibold mb-2">💡 Example</h4>
						<div className="space-y-2 text-xs font-mono">
							<p>
								<span className="text-muted-foreground">Original ID:</span>{" "}
								773323
							</p>
							<p>
								<span className="text-muted-foreground">Server A ID:</span>{" "}
								191921
							</p>
							<p>
								<span className="text-muted-foreground">Server B ID:</span>{" "}
								232341
							</p>
							<p>
								<span className="text-muted-foreground">Server C ID:</span>{" "}
								937283
							</p>
						</div>
						<p className="mt-2 text-muted-foreground">
							✅ You can search using ANY of these IDs!
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
