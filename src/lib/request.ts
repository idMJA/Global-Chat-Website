import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:2000";

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

	const response = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			Authorization: authHeader,
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error || `API Error: ${response.statusText}`);
	}

	return response.json();
}

export function unauthorizedResponse(message = "Missing Authorization header") {
	return NextResponse.json({ error: message }, { status: 401 });
}
