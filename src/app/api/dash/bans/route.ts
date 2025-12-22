import { type NextRequest, NextResponse } from "next/server";
import { makeApiRequest, unauthorizedResponse } from "@/lib/request";

// GET /api/dash/bans - Get all bans
export async function GET(request: NextRequest) {
	try {
		const incomingAuth = request.headers.get("authorization") ?? undefined;
		if (!incomingAuth) return unauthorizedResponse();

		const data = await makeApiRequest("/bans", {}, incomingAuth);
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error && error.message === "MissingAuthorization") {
			return unauthorizedResponse();
		}
		console.error("Failed to fetch bans:", error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "Failed to fetch bans",
			},
			{ status: 500 },
		);
	}
}
