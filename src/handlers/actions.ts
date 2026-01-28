import type { App } from "@slack/bolt";
import type { RichTextBlock } from "@slack/types";
import { questionModal, requestModal, bugModal, otherModal } from "../blocks/modals";
import { validateBugDateTime } from "../validators/datetime";
import type { Env } from "../types/env";
import type { ReportData } from "../types/report";

export function registerActions(app: App, env: Env): void {
	// Button action handlers
	app.action("reception_question", async ({ ack, body, client, respond }) => {
		await ack();
		if (body.type !== "block_actions" || !body.channel) return;

		await client.views.open({
			trigger_id: body.trigger_id,
			view: questionModal(body.channel.id),
		});
		await respond({ delete_original: true });
	});

	app.action("reception_request", async ({ ack, body, client, respond }) => {
		await ack();
		if (body.type !== "block_actions" || !body.channel) return;

		await client.views.open({
			trigger_id: body.trigger_id,
			view: requestModal(body.channel.id),
		});
		await respond({ delete_original: true });
	});

	app.action("reception_bug", async ({ ack, body, client, respond }) => {
		await ack();
		if (body.type !== "block_actions" || !body.channel) return;

		await client.views.open({
			trigger_id: body.trigger_id,
			view: bugModal(body.channel.id),
		});
		await respond({ delete_original: true });
	});

	app.action("reception_other", async ({ ack, body, client, respond }) => {
		await ack();
		if (body.type !== "block_actions" || !body.channel) return;

		await client.views.open({
			trigger_id: body.trigger_id,
			view: otherModal(body.channel.id),
		});
		await respond({ delete_original: true });
	});

	// Modal submission handlers
	app.view("question_submit", async ({ ack, body, view, client }) => {
		await ack();

		const metadata = JSON.parse(view.private_metadata) as { channelId: string };
		const category = view.state.values.question_category.category_select.selected_option?.value;
		const question = view.state.values.question_input.question_text.value;
		const assignee = view.state.values.question_assignee.assignee_select.selected_user;

		const blocks = [
			{
				type: "header",
				text: { type: "plain_text", text: "New Question", emoji: true },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*From:* <@${body.user.id}>` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Category:* ${category}` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Question:*\n${question}` },
			},
		];

		if (assignee) {
			blocks.push({
				type: "section",
				text: { type: "mrkdwn", text: `*Asked to:* <@${assignee}>` },
			});
		}

		await client.chat.postMessage({
			channel: metadata.channelId,
			text: `New Question from <@${body.user.id}>`,
			blocks,
		});
	});

	app.view("request_submit", async ({ ack, body, view, client }) => {
		await ack();

		const metadata = JSON.parse(view.private_metadata) as { channelId: string };
		const title = view.state.values.request_title.title_text.value;
		const descriptionRichText = view.state.values.request_description.description_rich_text
			.rich_text_value as RichTextBlock | undefined;
		const categories =
			view.state.values.request_category.category_checkboxes.selected_options?.map(
				(opt) => opt.value,
			) ?? [];
		const priority = view.state.values.request_priority.priority_radio.selected_option?.value;
		const assignee = view.state.values.request_assignee.assignee_select.selected_user;

		const categoryText = categories.length > 0 ? categories.join(", ") : "None";

		const blocks: (
			| {
					type: "header";
					text: { type: "plain_text"; text: string; emoji: boolean };
			  }
			| { type: "section"; text: { type: "mrkdwn"; text: string } }
			| RichTextBlock
		)[] = [
			{
				type: "header",
				text: { type: "plain_text", text: "New Feature Request", emoji: true },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*From:* <@${body.user.id}>` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Title:* ${title}` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: "*Description:*" },
			},
		];

		if (descriptionRichText) {
			blocks.push(descriptionRichText);
		}

		blocks.push(
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Categories:* ${categoryText}` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Priority:* ${priority}` },
			},
		);

		if (assignee) {
			blocks.push({
				type: "section",
				text: { type: "mrkdwn", text: `*Suggested Assignee:* <@${assignee}>` },
			});
		}

		await client.chat.postMessage({
			channel: metadata.channelId,
			text: `New Feature Request from <@${body.user.id}>`,
			blocks,
		});
	});

	app.view("bug_submit", async ({ ack, body, view, client }) => {
		const date = view.state.values.bug_date.date_picker.selected_date ?? undefined;
		const time = view.state.values.bug_time.time_picker.selected_time ?? undefined;

		const validation = validateBugDateTime(date, time);
		if (!validation.valid) {
			await ack({
				response_action: "errors",
				errors: {
					[validation.field]: validation.error,
				},
			});
			return;
		}

		await ack();

		const metadata = JSON.parse(view.private_metadata) as { channelId: string };
		const summary = view.state.values.bug_summary.summary_text.value;
		const steps = view.state.values.bug_steps.steps_text.value;
		const impactAreas =
			view.state.values.bug_impact.impact_select.selected_options?.map((opt) => opt.value) ?? [];
		const severity = view.state.values.bug_severity.severity_select.selected_option?.value;
		const referenceUrl = view.state.values.bug_url.url_input.value;

		const impactText = impactAreas.length > 0 ? impactAreas.join(", ") : "None";
		const dateTimeText = time ? `${date} ${time}` : date;

		const blocks = [
			{
				type: "header",
				text: { type: "plain_text", text: "New Bug Report", emoji: true },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*From:* <@${body.user.id}>` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Summary:* ${summary}` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*When:* ${dateTimeText}` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Steps to Reproduce:*\n${steps}` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Affected Areas:* ${impactText}` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Severity:* ${severity}` },
			},
		];

		if (referenceUrl) {
			blocks.push({
				type: "section",
				text: { type: "mrkdwn", text: `*Reference URL:* ${referenceUrl}` },
			});
		}

		await client.chat.postMessage({
			channel: metadata.channelId,
			text: `New Bug Report from <@${body.user.id}>`,
			blocks,
		});
	});

	app.view("other_submit", async ({ ack, body, view, client }) => {
		await ack();

		const metadata = JSON.parse(view.private_metadata) as { channelId: string };
		const subject = view.state.values.other_subject.subject_text.value;
		const content = view.state.values.other_content.content_text.value;
		const email = view.state.values.other_email.email_input.value;
		const relatedChannel = view.state.values.other_channel.channel_select.selected_channel;
		const urgency = view.state.values.other_urgency.urgency_input.value;

		const blocks = [
			{
				type: "header",
				text: { type: "plain_text", text: "New Inquiry", emoji: true },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*From:* <@${body.user.id}>` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Subject:* ${subject}` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*Content:*\n${content}` },
			},
		];

		if (email) {
			blocks.push({
				type: "section",
				text: { type: "mrkdwn", text: `*Contact Email:* ${email}` },
			});
		}

		if (relatedChannel) {
			blocks.push({
				type: "section",
				text: {
					type: "mrkdwn",
					text: `*Related Channel:* <#${relatedChannel}>`,
				},
			});
		}

		if (urgency) {
			blocks.push({
				type: "section",
				text: { type: "mrkdwn", text: `*Urgency:* ${urgency}/5` },
			});
		}

		await client.chat.postMessage({
			channel: metadata.channelId,
			text: `New Inquiry from <@${body.user.id}>`,
			blocks,
		});
	});

	app.view("report_submit", async ({ ack, body, view, client }) => {
		await ack();

		const metadata = JSON.parse(view.private_metadata) as { channelId: string };
		const done = view.state.values.report_done.done_text.value ?? "";
		const plan = view.state.values.report_plan.plan_text.value ?? "";
		const comment = view.state.values.report_comment.comment_text.value ?? null;

		const reportData: ReportData = {
			done,
			plan,
			comment,
			submittedAt: new Date().toISOString(),
			channelId: metadata.channelId,
		};

		await env.REPORT_KV.put(`report_${body.user.id}`, JSON.stringify(reportData));

		const blocks = [
			{
				type: "header",
				text: { type: "plain_text", text: "Report", emoji: true },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*From:* <@${body.user.id}>` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*今日やったこと:*\n${done}` },
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `*明日やること:*\n${plan}` },
			},
		];

		if (comment) {
			blocks.push({
				type: "section",
				text: { type: "mrkdwn", text: `*所感:*\n${comment}` },
			});
		}

		await client.chat.postMessage({
			channel: metadata.channelId,
			text: `Report from <@${body.user.id}>`,
			blocks,
		});
	});
}
