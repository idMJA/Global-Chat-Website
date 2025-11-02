import { type NextRequest, NextResponse } from "next/server";
import { makeApiRequest, unauthorizedResponse } from "@/lib/request";

// GET /api/dash/messages/[messageId] - Get message info
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ messageId: string }> },
) {
	try {
		const { messageId } = await params;
		const incomingAuth = request.headers.get("authorization") ?? undefined;
		if (!incomingAuth) return unauthorizedResponse();

		const data = await makeApiRequest(
			`/message/info/${messageId}`,
			{},
			incomingAuth,
		);
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error && error.message === "MissingAuthorization") {
			return unauthorizedResponse();
		}
		console.error("Failed to fetch message info:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to fetch message info",
			},
			{ status: 500 },
		);
	}
}

// DELETE /api/dash/messages/[messageId] - Delete message from all servers
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ messageId: string }> },
) {
	try {
		const { messageId } = await params;
		const incomingAuth = request.headers.get("authorization") ?? undefined;
		if (!incomingAuth) return unauthorizedResponse();

		const data = await makeApiRequest(
			`/message/${messageId}`,
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

		console.error("Failed to delete message:", error);

		// Handle socket closure - likely means operation completed but connection dropped
		if (
			error instanceof Error &&
			(error.message.includes("Connection closed by server") ||
				error.message.includes("timeout"))
		) {
			return NextResponse.json(
				{
					status: "warning",
					message:
						"Delete operation sent but connection closed. Message may have been deleted successfully.",
					error: error.message,
					suggestion:
						"Please search for the message again to verify deletion status.",
				},
				{ status: 202 }, // 202 Accepted - processing may have completed
			);
		}

		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to delete message",
			},
			{ status: 500 },
		);
	}
}
