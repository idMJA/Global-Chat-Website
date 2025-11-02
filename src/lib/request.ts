import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:2000";
const REQUEST_TIMEOUT = 30000; // 30 seconds

export async function makeApiRequest(
	path: string,
	options: RequestInit = {},
	authHeader?: string,
) {
	// No fallback to ADMIN_API_KEY: require authHeader
	if (!authHeader) {
		// Caller should handle and return 401. We throw a specific error.
		throw new Error("MissingAuthorization");
	}

	// Create abort controller for timeout
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

	try {
		const response = await fetch(`${API_URL}${path}`, {
			...options,
			headers: {
				Authorization: authHeader,
				"Content-Type": "application/json",
				...options.headers,
			},
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || `API Error: ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		clearTimeout(timeoutId);

		// Handle specific error types
		if (error instanceof Error) {
			if (error.name === "AbortError") {
				throw new Error("Request timeout - operation may still be processing");
			}
			if (
				error.message.includes("UND_ERR_SOCKET") ||
				error.message.includes("other side closed")
			) {
				throw new Error(
					"Connection closed by server - operation may have completed",
				);
			}
		}

		throw error;
	}
}

export function unauthorizedResponse(message = "Missing Authorization header") {
	return NextResponse.json({ error: message }, { status: 401 });
}
