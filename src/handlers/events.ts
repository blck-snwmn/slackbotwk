import type { App } from "@slack/bolt";

export function registerEvents(app: App): void {
	app.event("app_mention", async ({ event, client }) => {
		await client.chat.postMessage({
			channel: event.channel,
			text: `Hello <@${event.user}>! How can I help you?`,
		});
	});
}
