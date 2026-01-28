import { describe, it, expect, beforeEach } from "vitest";
import crypto from "node:crypto";
import { WorkersReceiver } from "./receiver";

function generateSlackSignature(signingSecret: string, timestamp: string, body: string): string {
	const sigBasestring = `v0:${timestamp}:${body}`;
	const hmac = crypto.createHmac("sha256", signingSecret);
	hmac.update(sigBasestring);
	return `v0=${hmac.digest("hex")}`;
}

const mockCtx = {
	waitUntil: () => {},
	passThroughOnException: () => {},
} as unknown as ExecutionContext;

describe("WorkersReceiver", () => {
	const signingSecret = "test-signing-secret";
	let receiver: WorkersReceiver;

	beforeEach(() => {
		receiver = new WorkersReceiver(signingSecret);
	});

	it("returns 405 for non-POST requests", async () => {
		const request = new Request("https://example.com", {
			method: "GET",
		});

		const response = await receiver.handleRequest(request, mockCtx);
		expect(response.status).toBe(405);
		expect(await response.text()).toBe("Method not allowed");
	});

	it("returns 401 when signature headers are missing", async () => {
		const request = new Request("https://example.com", {
			method: "POST",
			body: "{}",
		});

		const response = await receiver.handleRequest(request, mockCtx);
		expect(response.status).toBe(401);
		expect(await response.text()).toBe("Missing signature headers");
	});

	it("returns 401 for invalid signature", async () => {
		const timestamp = Math.floor(Date.now() / 1000).toString();
		const body = JSON.stringify({ type: "event_callback" });

		const request = new Request("https://example.com", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-slack-request-timestamp": timestamp,
				"x-slack-signature": "v0=invalid_signature",
			},
			body,
		});

		const response = await receiver.handleRequest(request, mockCtx);
		expect(response.status).toBe(401);
		expect(await response.text()).toBe("Invalid signature");
	});

	it("returns 401 for expired timestamp", async () => {
		const oldTimestamp = (Math.floor(Date.now() / 1000) - 400).toString();
		const body = JSON.stringify({ type: "url_verification", challenge: "test" });
		const signature = generateSlackSignature(signingSecret, oldTimestamp, body);

		const request = new Request("https://example.com", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-slack-request-timestamp": oldTimestamp,
				"x-slack-signature": signature,
			},
			body,
		});

		const response = await receiver.handleRequest(request, mockCtx);
		expect(response.status).toBe(401);
		expect(await response.text()).toBe("Invalid signature");
	});

	it("handles URL verification challenge", async () => {
		const timestamp = Math.floor(Date.now() / 1000).toString();
		const challenge = "test_challenge_token";
		const body = JSON.stringify({ type: "url_verification", challenge });
		const signature = generateSlackSignature(signingSecret, timestamp, body);

		const request = new Request("https://example.com", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-slack-request-timestamp": timestamp,
				"x-slack-signature": signature,
			},
			body,
		});

		const response = await receiver.handleRequest(request, mockCtx);
		expect(response.status).toBe(200);
		expect(await response.text()).toBe(challenge);
	});

	it("returns 500 when bolt app is not initialized", async () => {
		const timestamp = Math.floor(Date.now() / 1000).toString();
		const body = JSON.stringify({ type: "event_callback", event: {} });
		const signature = generateSlackSignature(signingSecret, timestamp, body);

		const request = new Request("https://example.com", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-slack-request-timestamp": timestamp,
				"x-slack-signature": signature,
			},
			body,
		});

		const response = await receiver.handleRequest(request, mockCtx);
		expect(response.status).toBe(500);
		expect(await response.text()).toBe("Bot not initialized");
	});
});
