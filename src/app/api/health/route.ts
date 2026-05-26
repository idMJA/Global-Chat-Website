import { NextResponse } from "next/server";

export async function GET() {
	try {
		const apiUrl = process.env.GLOBAL_CHAT_API_URL;
		if (!apiUrl) throw new Error("GLOBAL_CHAT_API_URL is not defined");
		const res = await fetch(`${apiUrl}/health`, {
			next: { revalidate: 30 },
		});

		if (!res.ok) {
			throw new Error("API is not healthy");
		}

		const data = await res.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Health check failed:", error);
		return NextResponse.json(
			{
				status: "error",
				message: "Global Chat API is offline or unreachable",
				timestamp: new Date().toISOString(),
			},
			{ status: 503 },
		);
	}
}
