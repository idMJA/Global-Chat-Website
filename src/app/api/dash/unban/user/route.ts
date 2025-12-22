import { type NextRequest, NextResponse } from "next/server";
import { makeApiRequest, unauthorizedResponse } from "@/lib/request";

// POST /api/dash/unban/user - Unban a user
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const incomingAuth = request.headers.get("authorization") ?? undefined;
		if (!incomingAuth) return unauthorizedResponse();

		const data = await makeApiRequest(
			"/unban/user",
			{
				method: "POST",
				body: JSON.stringify(body),
			},
			incomingAuth,
		);
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error && error.message === "MissingAuthorization") {
			return unauthorizedResponse();
		}
		console.error("Failed to unban user:", error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "Failed to unban user",
			},
			{ status: 500 },
		);
	}
}
