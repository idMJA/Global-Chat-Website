import { NextResponse } from "next/server";

export async function GET() {
	try {
		const apiUrl = process.env.GLOBAL_CHAT_API_URL;
		if (!apiUrl) throw new Error("GLOBAL_CHAT_API_URL is not defined");

		const res = await fetch(`${apiUrl}/stats`, {
			next: { revalidate: 60 },
		});

		if (!res.ok) {
			throw new Error("Stats API is not reachable");
		}

		const data = await res.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Stats check failed:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Could not fetch stats",
			},
			{ status: 503 },
		);
	}
}
