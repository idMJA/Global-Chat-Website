"use client";

import { Check, Copy, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import apiService from "@/services/apiService";

const AVAILABLE_PERMISSIONS = [
	{
		id: "ban_user",
		label: "Ban User",
		description: "Ban user dari global chat",
	},
	{
		id: "ban_server",
		label: "Ban Server",
		description: "Ban server dari global chat",
	},
	{ id: "unban_user", label: "Unban User", description: "Unban user" },
	{ id: "unban_server", label: "Unban Server", description: "Unban server" },
	{ id: "view_bans", label: "View Bans", description: "Lihat daftar ban" },
	{
		id: "manage_api_keys",
		label: "Manage API Keys",
		description: "Manage API keys (create, delete, toggle)",
	},
	{
		id: "*",
		label: "Wildcard (*)",
		description: "Akses penuh ke semua endpoint",
	},
];

interface CreateApiKeyDialogProps {
	onSuccess: () => void;
}

export function CreateApiKeyDialog({ onSuccess }: CreateApiKeyDialogProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("");
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
	const [createdKey, setCreatedKey] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const handlePermissionToggle = (permissionId: string) => {
		// If wildcard is selected, clear all other permissions
		if (permissionId === "*") {
			setSelectedPermissions(["*"]);
			return;
		}

		// If selecting other permission while wildcard is active, remove wildcard
		if (selectedPermissions.includes("*")) {
			setSelectedPermissions([permissionId]);
			return;
		}

		setSelectedPermissions((prev) =>
			prev.includes(permissionId)
				? prev.filter((p) => p !== permissionId)
				: [...prev, permissionId],
		);
	};

	const handleCreate = async () => {
		if (!name.trim()) {
			alert("Please enter a name for the API key");
			return;
		}

		try {
			setLoading(true);
			const response = await apiService.createApiKey(name, selectedPermissions);

			if (response.status === "ok") {
				setCreatedKey(response.data.apiKey);
				// Don't close dialog yet - show the key first
			} else {
				alert("Failed to create API key");
			}
		} catch (error) {
			console.error("Failed to create API key:", error);
			alert(
				error instanceof Error ? error.message : "Failed to create API key",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCopy = async () => {
		if (createdKey) {
			await navigator.clipboard.writeText(createdKey);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleClose = () => {
		setOpen(false);
		// Reset form after closing
		setTimeout(() => {
			setName("");
			setSelectedPermissions([]);
			setCreatedKey(null);
			setCopied(false);
			onSuccess();
		}, 200);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<PlusCircle className="h-4 w-4" />
					Create API Key
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				{!createdKey ? (
					<>
						<DialogHeader>
							<DialogTitle>Create New API Key</DialogTitle>
							<DialogDescription>
								Create a new API key with specific permissions. Choose carefully
								based on your needs.
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-6 py-4">
							{/* Name Input */}
							<div className="space-y-2">
								<Label htmlFor="name">API Key Name *</Label>
								<Input
									id="name"
									placeholder="e.g., Discord Bot - Production"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
								<p className="text-xs text-muted-foreground">
									Use a descriptive name to identify this key later
								</p>
							</div>

							{/* Permissions */}
							<div className="space-y-3">
								<Label>Permissions</Label>
								<p className="text-xs text-muted-foreground">
									Select permissions for this API key. Leave empty for basic
									chat functionality only.
								</p>
								<div className="space-y-3 border rounded-lg p-4">
									{AVAILABLE_PERMISSIONS.map((permission) => (
										<div
											key={permission.id}
											className="flex items-start space-x-3"
										>
											<Checkbox
												id={permission.id}
												checked={selectedPermissions.includes(permission.id)}
												onCheckedChange={() =>
													handlePermissionToggle(permission.id)
												}
												disabled={
													permission.id !== "*" &&
													selectedPermissions.includes("*")
												}
											/>
											<div className="flex-1 space-y-1">
												<Label
													htmlFor={permission.id}
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
												>
													{permission.label}
												</Label>
												<p className="text-xs text-muted-foreground">
													{permission.description}
												</p>
											</div>
										</div>
									))}
								</div>
								<p className="text-xs text-muted-foreground">
									💡 <strong>Tip:</strong> For simple chat functionality, no
									permissions are needed. Wildcard (*) gives full access to all
									endpoints.
								</p>
							</div>
						</div>

						<DialogFooter>
							<Button variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button onClick={handleCreate} disabled={loading || !name.trim()}>
								{loading ? "Creating..." : "Create API Key"}
							</Button>
						</DialogFooter>
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>✅ API Key Created Successfully!</DialogTitle>
							<DialogDescription>
								Your API key has been created. Copy it now - it will not be
								shown again!
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label>API Key</Label>
								<div className="flex gap-2">
									<Textarea
										readOnly
										value={createdKey}
										className="font-mono text-sm h-24"
									/>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={handleCopy}
									className="w-full gap-2"
								>
									{copied ? (
										<>
											<Check className="h-4 w-4" />
											Copied!
										</>
									) : (
										<>
											<Copy className="h-4 w-4" />
											Copy to Clipboard
										</>
									)}
								</Button>
							</div>

							<div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
								<p className="text-sm font-medium text-yellow-500 mb-2">
									⚠️ Important Security Notice
								</p>
								<ul className="text-xs text-muted-foreground space-y-1">
									<li>
										• Store this key securely in your environment variables
									</li>
									<li>• Never commit this key to version control</li>
									<li>
										• This key will not be shown again after closing this dialog
									</li>
									<li>• If lost, you&apos;ll need to create a new key</li>
								</ul>
							</div>
						</div>

						<DialogFooter>
							<Button onClick={handleClose} className="w-full">
								I&apos;ve Saved the Key Securely
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
