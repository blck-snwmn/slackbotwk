import type { Receiver, ReceiverEvent, App, AckFn, StringIndexed } from "@slack/bolt";
import crypto from "node:crypto";

export class WorkersReceiver implements Receiver {
	private bolt: App | undefined;
	private signingSecret: string;

	constructor(signingSecret: string) {
		this.signingSecret = signingSecret;
	}

	init(bolt: App): void {
		this.bolt = bolt;
	}

	async start(): Promise<void> {
		// Workers don't need to start a server
	}

	async stop(): Promise<void> {
		// Workers don't need to stop a server
	}

	async handleRequest(request: Request, ctx: ExecutionContext): Promise<Response> {
		if (request.method !== "POST") {
			return new Response("Method not allowed", { status: 405 });
		}

		const body = await request.text();
		const timestamp = request.headers.get("x-slack-request-timestamp");
		const signature = request.headers.get("x-slack-signature");

		if (!timestamp || !signature) {
			return new Response("Missing signature headers", { status: 401 });
		}

		// Verify signature
		const isValid = this.verifySignature(body, timestamp, signature);
		if (!isValid) {
			return new Response("Invalid signature", { status: 401 });
		}

		const contentType = request.headers.get("content-type") ?? "";
		const payload = this.parseBody(body, contentType);

		// Handle URL verification challenge
		if (payload.type === "url_verification") {
			return new Response(String(payload.challenge), {
				headers: { "Content-Type": "text/plain" },
			});
		}

		// Handle events
		if (this.bolt) {
			let ackResponse: unknown = undefined;
			let ackResolve: () => void;
			const ackPromise = new Promise<void>((resolve) => {
				ackResolve = resolve;
			});

			const event = this.createReceiverEvent(payload, (response) => {
				ackResponse = response;
				ackResolve();
			});

			// Start processing and keep worker alive via waitUntil
			const processPromise = this.bolt
				.processEvent(event)
				.catch((error) => {
					console.error("Error processing event:", error);
				})
				.finally(() => {
					// Fallback: resolve ackPromise if ack() was never called.
					// Calling resolve multiple times is safe; only the first call takes effect.
					ackResolve();
				});
			ctx.waitUntil(processPromise);

			// Wait only until ack() is called, then return HTTP response immediately
			await ackPromise;

			if (ackResponse !== undefined) {
				return new Response(JSON.stringify(ackResponse), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}
			return new Response(null, { status: 200 });
		}

		return new Response("Bot not initialized", { status: 500 });
	}

	private verifySignature(body: string, timestamp: string, signature: string): boolean {
		const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
		if (parseInt(timestamp, 10) < fiveMinutesAgo) {
			return false;
		}

		const sigBasestring = `v0:${timestamp}:${body}`;
		const hmac = crypto.createHmac("sha256", this.signingSecret);
		hmac.update(sigBasestring);
		const mySignature = `v0=${hmac.digest("hex")}`;

		// timingSafeEqual requires same length buffers
		if (mySignature.length !== signature.length) {
			return false;
		}

		return crypto.timingSafeEqual(Buffer.from(mySignature), Buffer.from(signature));
	}

	private parseBody(body: string, contentType: string): StringIndexed {
		if (contentType.includes("application/json")) {
			return JSON.parse(body) as StringIndexed;
		}

		// Handle application/x-www-form-urlencoded (slash commands, interactions)
		const params = new URLSearchParams(body);
		const result: StringIndexed = {};

		for (const [key, value] of params.entries()) {
			// payload field contains JSON for interactive components
			if (key === "payload") {
				return JSON.parse(value) as StringIndexed;
			}
			result[key] = value;
		}

		return result;
	}

	private createReceiverEvent(
		payload: StringIndexed,
		onAck: (response: unknown) => void,
	): ReceiverEvent {
		const ack = async (response?: unknown): Promise<void> => {
			onAck(response);
		};

		return {
			body: payload,
			ack: ack as AckFn<unknown>,
			retryNum: undefined,
			retryReason: undefined,
			customProperties: {},
		};
	}
}
