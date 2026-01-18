import type { RespondArguments } from "@slack/bolt";

export function helpMessage(): RespondArguments {
	return {
		blocks: [
			{
				type: "header",
				text: {
					type: "plain_text",
					text: "Slackbot Help",
					emoji: true,
				},
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "*Available Commands:*",
				},
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "• `/hello` - Say hello\n• `/help` - Show this message",
				},
			},
			{
				type: "divider",
			},
			{
				type: "context",
				elements: [
					{
						type: "mrkdwn",
						text: "Powered by Cloudflare Workers",
					},
				],
			},
		],
		text: "Slackbot Help",
	};
}
