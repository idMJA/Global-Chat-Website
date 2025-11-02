import { type NextRequest, NextResponse } from "next/server";
import { makeApiRequest, unauthorizedResponse } from "@/lib/request";

// GET /api/dash/api-keys/[keyId]/metrics - Get API key metrics
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ keyId: string }> },
) {
	try {
		const { keyId } = await params;
		const searchParams = request.nextUrl.searchParams;
		const page = searchParams.get("page") || "1";
		const limit = searchParams.get("limit") || "50";
		const hoursBack = searchParams.get("hoursBack") || "24";
		const incomingAuth = request.headers.get("authorization") ?? undefined;

		if (!incomingAuth) return unauthorizedResponse();

		const data = await makeApiRequest(
			`/admin/api-keys/${keyId}/metrics?page=${page}&limit=${limit}&hoursBack=${hoursBack}`,
			{},
			incomingAuth,
		);
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error && error.message === "MissingAuthorization") {
			return unauthorizedResponse();
		}
		console.error("Failed to fetch API key metrics:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to fetch API key metrics",
			},
			{ status: 500 },
		);
	}
}
