import { App, LogLevel } from "@slack/bolt";
import type { Env } from "./types/env";
import { registerCommands } from "./handlers/commands";
import { registerEvents } from "./handlers/events";
import { registerActions } from "./handlers/actions";
import { WorkersReceiver } from "./receiver";

export function createApp(env: Env): { app: App; receiver: WorkersReceiver } {
	const receiver = new WorkersReceiver(env.SLACK_SIGNING_SECRET);

	const app = new App({
		token: env.SLACK_BOT_TOKEN,
		receiver,
		processBeforeResponse: true,
		logLevel: LogLevel.DEBUG,
	});

	registerCommands(app);
	registerEvents(app);
	registerActions(app);

	return { app, receiver };
}
