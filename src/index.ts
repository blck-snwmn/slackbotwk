import { createApp } from "./app";
import type { Env } from "./types/env";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { receiver } = createApp(env);
		return receiver.handleRequest(request, ctx);
	},
};
