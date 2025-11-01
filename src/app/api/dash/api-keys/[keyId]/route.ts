import { type NextRequest, NextResponse } from "next/server";
import { makeApiRequest, unauthorizedResponse } from "@/lib/request";

// GET /api/dash/api-keys/[keyId] - Get API key detail
export async function GET(
	request: NextRequest,
	{ params }: { params: { keyId: string } },
) {
	try {
		const keyId = params.keyId;
		const incomingAuth = request.headers.get("authorization") ?? undefined;
		if (!incomingAuth) return unauthorizedResponse();
		const data = await makeApiRequest(
			`/admin/api-keys/${keyId}`,
			{},
			incomingAuth,
		);
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error && error.message === "MissingAuthorization") {
			return unauthorizedResponse();
		}
		console.error("Failed to fetch API key:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to fetch API key",
			},
			{ status: 500 },
		);
	}
}

// DELETE /api/dash/api-keys/[keyId] - Delete API key
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { keyId: string } },
) {
	try {
		const keyId = params.keyId;
		const incomingAuth = request.headers.get("authorization") ?? undefined;
		if (!incomingAuth) return unauthorizedResponse();
		const data = await makeApiRequest(
			`/admin/api-keys/${keyId}`,
			{
				method: "DELETE",
			},
			incomingAuth,
		);
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error && error.message === "MissingAuthorization") {
			return unauthorizedResponse();
		}
		console.error("Failed to delete API key:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to delete API key",
			},
			{ status: 500 },
		);
	}
}

// PATCH /api/dash/api-keys/[keyId] - Update API key (toggle status)
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { keyId: string } },
) {
	try {
		const keyId = params.keyId;
		const body = await request.json();
		const incomingAuth = request.headers.get("authorization") ?? undefined;
		if (!incomingAuth) return unauthorizedResponse();
		const data = await makeApiRequest(
			`/admin/api-keys/${keyId}`,
			{
				method: "PATCH",
				body: JSON.stringify(body),
			},
			incomingAuth,
		);
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error && error.message === "MissingAuthorization") {
			return unauthorizedResponse();
		}
		console.error("Failed to update API key:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to update API key",
			},
			{ status: 500 },
		);
	}
}
