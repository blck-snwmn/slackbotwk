import type { App } from "@slack/bolt";
import { helpMessage } from "../blocks/messages";

export function registerCommands(app: App): void {
	app.command("/hello", async ({ ack, respond }) => {
		await ack();
		await respond({
			text: "Hello from Cloudflare Workers!",
		});
	});

	app.command("/help", async ({ ack, respond }) => {
		await ack();
		await respond(helpMessage());
	});
}
