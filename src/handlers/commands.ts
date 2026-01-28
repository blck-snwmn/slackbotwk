import type { App } from "@slack/bolt";
import { helpMessage, receptionMessage } from "../blocks/messages";
import { reportModal } from "../blocks/modals";
import type { Env } from "../types/env";
import type { ReportData } from "../types/report";

export function registerCommands(app: App, env: Env): void {
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

	app.command("/reception", async ({ ack, respond }) => {
		await ack();
		await respond(receptionMessage());
	});

	app.command("/report", async ({ ack, body, client }) => {
		await ack();

		const userId = body.user_id;
		const channelId = body.channel_id;

		const previousData = await env.REPORT_KV.get<ReportData>(`report_${userId}`, "json");

		await client.views.open({
			trigger_id: body.trigger_id,
			view: reportModal(channelId, previousData),
		});
	});
}
