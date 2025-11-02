// services/apiManagementService.ts

interface ApiKey {
	id: string;
	name: string;
	permissions: string[];
	createdBy: string;
	createdAt: string;
	lastUsedAt?: string;
	isActive: boolean;
}

interface MetricsData {
	totalRequests: number;
	successfulRequests: number;
	failedRequests: number;
	averageResponseTime: number;
	successRate: number;
	requestsByEndpoint: Record<string, number>;
}

interface ApiKeyMetrics {
	apiKeyId: string;
	apiKeyName: string;
	stats: {
		totalRequests: number;
		successfulRequests: number;
		failedRequests: number;
		averageResponseTime: number;
		successRate: number;
		requestsByEndpoint: Record<string, number>;
	};
	recentRequests: Array<{
		id: string;
		endpoint: string;
		method: string;
		statusCode: number;
		responseTime: number;
		timestamp: string;
		success: boolean;
		errorMessage?: string;
	}>;
	page: {
		current: number;
		total: number;
		limit: number;
	};
}

interface MessageInfo {
	originalMessageId: string;
	content: string;
	author: string;
	serverMessages: Array<{
		guildId: string;
		messageId: string;
	}>;
	totalServers: number;
}

interface DeleteMessageResponse {
	status: string;
	message: string;
	data: {
		originalMessageId: string;
		totalServers: number;
		successCount: number;
		failedCount: number;
		errors?: Array<{
			guildId: string;
			error: string;
		}>;
	};
}

export class APIManagementService {
	private apiUrl: string;

	constructor(apiUrl: string = "/api/dash") {
		this.apiUrl = apiUrl;
	}

	private async request<T>(
		path: string,
		options: RequestInit = {},
	): Promise<T> {
		// Attach user-provided API key from localStorage if present
		let authHeader: Record<string, string> = {};
		try {
			const key = localStorage.getItem("gc_api_key");
			if (key) {
				authHeader = { Authorization: `Bearer ${key}` };
			}
		} catch {
			// ignore
		}

		const response = await fetch(`${this.apiUrl}${path}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...authHeader,
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || `API Error: ${response.statusText}`);
		}

		return response.json();
	}

	// API Key Management
	async listApiKeys() {
		return this.request<{ data: { apiKeys: ApiKey[] } }>("/api-keys");
	}

	async createApiKey(name: string, permissions: string[]) {
		return this.request<{
			status: string;
			message: string;
			data: {
				apiKey: string;
				keyId: string;
				name: string;
				permissions: string[];
				warning: string;
			};
		}>("/api-keys", {
			method: "POST",
			body: JSON.stringify({ name, permissions }),
		});
	}

	async getApiKeyDetail(keyId: string) {
		return this.request<{ data: ApiKey }>(`/api-keys/${keyId}`);
	}

	async deleteApiKey(keyId: string) {
		return this.request<{ message: string }>(`/api-keys/${keyId}`, {
			method: "DELETE",
		});
	}

	async toggleApiKeyStatus(keyId: string, isActive: boolean) {
		return this.request<{ data: ApiKey }>(`/api-keys/${keyId}`, {
			method: "PATCH",
			body: JSON.stringify({ isActive }),
		});
	}

	// Metrics
	async getGlobalMetrics(hoursBack: number = 24) {
		return this.request<{ data: MetricsData }>(
			`/metrics?hoursBack=${hoursBack}`,
		);
	}

	async getApiKeyMetrics(
		keyId: string,
		page: number = 1,
		limit: number = 100,
		hoursBack: number = 24,
	) {
		return this.request<{ data: ApiKeyMetrics }>(
			`/api-keys/${keyId}/metrics?page=${page}&limit=${limit}&hoursBack=${hoursBack}`,
		);
	}

	// Message Management
	async getMessageInfo(messageId: string) {
		return this.request<{ data: MessageInfo }>(`/messages/${messageId}`);
	}

	async deleteMessage(messageId: string) {
		return this.request<DeleteMessageResponse>(`/messages/${messageId}`, {
			method: "DELETE",
		});
	}
}

// Create singleton instance
const apiService = new APIManagementService();

export default apiService;
