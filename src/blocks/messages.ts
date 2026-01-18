import type { RespondArguments } from "@slack/bolt";

export function receptionMessage(): RespondArguments {
	return {
		blocks: [
			{
				type: "header",
				text: {
					type: "plain_text",
					text: "Reception",
					emoji: true,
				},
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "Please select your inquiry type:",
				},
			},
			{
				type: "actions",
				elements: [
					{
						type: "button" as const,
						text: { type: "plain_text" as const, text: "Question", emoji: true },
						action_id: "reception_question",
						style: "primary" as const,
					},
					{
						type: "button" as const,
						text: { type: "plain_text" as const, text: "Feature Request", emoji: true },
						action_id: "reception_request",
					},
					{
						type: "button" as const,
						text: { type: "plain_text" as const, text: "Bug Report", emoji: true },
						action_id: "reception_bug",
						style: "danger" as const,
					},
					{
						type: "button" as const,
						text: { type: "plain_text" as const, text: "Other", emoji: true },
						action_id: "reception_other",
					},
				],
			},
		],
		text: "Reception",
	};
}

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
