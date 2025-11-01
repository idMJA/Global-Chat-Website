import { type NextRequest, NextResponse } from "next/server";
import { makeApiRequest, unauthorizedResponse } from "@/lib/request";

// GET /api/dash/api-keys - List all API keys
export async function GET(request: NextRequest) {
	try {
		const incomingAuth = request.headers.get("authorization") ?? undefined;
		if (!incomingAuth) return unauthorizedResponse();
		const data = await makeApiRequest("/admin/api-keys", {}, incomingAuth);
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error && error.message === "MissingAuthorization") {
			return unauthorizedResponse();
		}
		console.error("Failed to fetch API keys:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to fetch API keys",
			},
			{ status: 500 },
		);
	}
}

// POST /api/dash/api-keys - Create new API key
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const incomingAuth = request.headers.get("authorization") ?? undefined;
		if (!incomingAuth) return unauthorizedResponse();
		const data = await makeApiRequest(
			" /admin/api-keys".replace(/^ /, ""),
			{
				method: "POST",
				body: JSON.stringify(body),
			},
			incomingAuth,
		);
		return NextResponse.json(data, { status: 201 });
	} catch (error) {
		if (error instanceof Error && error.message === "MissingAuthorization") {
			return unauthorizedResponse();
		}
		console.error("Failed to create API key:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to create API key",
			},
			{ status: 500 },
		);
	}
}
