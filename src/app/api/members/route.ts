import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { Bot } from "@/lib/types";

interface PresenceUser {
	memberId: string;
	user: {
		avatarURL: string | null;
	};
	presence: {
		status: "online" | "idle" | "dnd" | "offline";
	};
}

interface PresenceData {
	users: PresenceUser[];
}

export async function GET() {
	try {
		const configPath = path.join(process.cwd(), "config.json");
		const configData = await fs.readFile(configPath, "utf-8");
		const config = JSON.parse(configData);

		let presenceData: PresenceData = { users: [] };
		try {
			const presenceUrl = process.env.PRESENCE_API_URL;
			if (!presenceUrl) throw new Error("PRESENCE_API_URL is not defined");
			const presenceRes = await fetch(presenceUrl, {
				next: { revalidate: 30 },
			});
			if (presenceRes.ok) {
				presenceData = await presenceRes.json();
			}
		} catch (e) {
			console.error("Failed to fetch presence data", e);
		}

		const mergedMembers: Bot[] = config.members.map((member: Bot) => {
			const presenceInfo = presenceData.users?.find(
				(u) => u.memberId === member.id,
			);
			return {
				...member,
				status: presenceInfo?.presence?.status || "offline",
				avatar: presenceInfo?.user?.avatarURL || member.avatar,
			};
		});

		return NextResponse.json(mergedMembers);
	} catch (error) {
		console.error("Error reading config.json:", error);
		return NextResponse.json(
			{ error: "Failed to load members" },
			{ status: 500 },
		);
	}
}
