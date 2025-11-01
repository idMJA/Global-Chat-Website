import { type NextRequest, NextResponse } from "next/server";
import { makeApiRequest, unauthorizedResponse } from "@/lib/request";

// GET /api/dash/metrics - Get global metrics
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const hoursBack = searchParams.get("hoursBack") || "24";
		const incomingAuth = request.headers.get("authorization") ?? undefined;

		if (!incomingAuth) return unauthorizedResponse();

		const data = await makeApiRequest(
			`/admin/metrics?hoursBack=${hoursBack}`,
			{},
			incomingAuth,
		);
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error && error.message === "MissingAuthorization") {
			return unauthorizedResponse();
		}
		console.error("Failed to fetch metrics:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to fetch metrics",
			},
			{ status: 500 },
		);
	}
}
