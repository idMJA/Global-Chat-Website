export interface Bot {
	id: string;
	name: string;
	developer: string;
	description: string;
	avatar: string;
	websiteUrl: string;
	supportUrl: string;
	cardVariant: "left" | "middle" | "right";
	status?: "online" | "idle" | "dnd" | "offline" | string;
}
