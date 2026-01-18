import type { ModalView } from "@slack/types";

export function questionModal(channelId: string): ModalView {
	return {
		type: "modal",
		callback_id: "question_submit",
		private_metadata: JSON.stringify({ channelId }),
		title: {
			type: "plain_text",
			text: "Question",
		},
		submit: {
			type: "plain_text",
			text: "Submit",
		},
		close: {
			type: "plain_text",
			text: "Cancel",
		},
		blocks: [
			{
				type: "input",
				block_id: "question_category",
				element: {
					type: "static_select",
					action_id: "category_select",
					placeholder: {
						type: "plain_text",
						text: "Select a category",
					},
					options: [
						{
							text: { type: "plain_text", text: "General" },
							value: "general",
						},
						{
							text: { type: "plain_text", text: "Technical" },
							value: "technical",
						},
						{
							text: { type: "plain_text", text: "Process" },
							value: "process",
						},
					],
				},
				label: {
					type: "plain_text",
					text: "Category",
				},
			},
			{
				type: "input",
				block_id: "question_input",
				element: {
					type: "plain_text_input",
					action_id: "question_text",
					multiline: true,
					placeholder: {
						type: "plain_text",
						text: "Enter your question here...",
					},
				},
				label: {
					type: "plain_text",
					text: "Your Question",
				},
			},
			{
				type: "input",
				block_id: "question_assignee",
				optional: true,
				element: {
					type: "users_select",
					action_id: "assignee_select",
					placeholder: {
						type: "plain_text",
						text: "Select a person to ask",
					},
				},
				label: {
					type: "plain_text",
					text: "Who would you like to ask?",
				},
			},
		],
	};
}

export function requestModal(channelId: string): ModalView {
	return {
		type: "modal",
		callback_id: "request_submit",
		private_metadata: JSON.stringify({ channelId }),
		title: {
			type: "plain_text",
			text: "Feature Request",
		},
		submit: {
			type: "plain_text",
			text: "Submit",
		},
		close: {
			type: "plain_text",
			text: "Cancel",
		},
		blocks: [
			{
				type: "input",
				block_id: "request_title",
				element: {
					type: "plain_text_input",
					action_id: "title_text",
					placeholder: {
						type: "plain_text",
						text: "Feature title",
					},
				},
				label: {
					type: "plain_text",
					text: "Title",
				},
			},
			{
				type: "input",
				block_id: "request_description",
				element: {
					type: "rich_text_input",
					action_id: "description_rich_text",
					placeholder: {
						type: "plain_text",
						text: "Describe the feature you want...",
					},
				},
				label: {
					type: "plain_text",
					text: "Description",
				},
			},
			{
				type: "input",
				block_id: "request_category",
				element: {
					type: "checkboxes",
					action_id: "category_checkboxes",
					options: [
						{
							text: { type: "plain_text", text: "UI" },
							value: "ui",
						},
						{
							text: { type: "plain_text", text: "Backend" },
							value: "backend",
						},
						{
							text: { type: "plain_text", text: "Performance" },
							value: "performance",
						},
						{
							text: { type: "plain_text", text: "Other" },
							value: "other",
						},
					],
				},
				label: {
					type: "plain_text",
					text: "Category (select all that apply)",
				},
			},
			{
				type: "input",
				block_id: "request_priority",
				element: {
					type: "radio_buttons",
					action_id: "priority_radio",
					options: [
						{
							text: { type: "plain_text", text: "Low" },
							value: "low",
						},
						{
							text: { type: "plain_text", text: "Medium" },
							value: "medium",
						},
						{
							text: { type: "plain_text", text: "High" },
							value: "high",
						},
					],
				},
				label: {
					type: "plain_text",
					text: "Priority",
				},
			},
			{
				type: "input",
				block_id: "request_assignee",
				optional: true,
				element: {
					type: "users_select",
					action_id: "assignee_select",
					placeholder: {
						type: "plain_text",
						text: "Select a person to assign",
					},
				},
				label: {
					type: "plain_text",
					text: "Suggested Assignee",
				},
			},
		],
	};
}

export function bugModal(channelId: string): ModalView {
	return {
		type: "modal",
		callback_id: "bug_submit",
		private_metadata: JSON.stringify({ channelId }),
		title: {
			type: "plain_text",
			text: "Bug Report",
		},
		submit: {
			type: "plain_text",
			text: "Submit",
		},
		close: {
			type: "plain_text",
			text: "Cancel",
		},
		blocks: [
			{
				type: "input",
				block_id: "bug_summary",
				element: {
					type: "plain_text_input",
					action_id: "summary_text",
					placeholder: {
						type: "plain_text",
						text: "Brief summary of the bug",
					},
				},
				label: {
					type: "plain_text",
					text: "Bug Summary",
				},
			},
			{
				type: "input",
				block_id: "bug_date",
				element: {
					type: "datepicker",
					action_id: "date_picker",
					placeholder: {
						type: "plain_text",
						text: "Select a date",
					},
				},
				label: {
					type: "plain_text",
					text: "When did it occur?",
				},
			},
			{
				type: "input",
				block_id: "bug_time",
				optional: true,
				element: {
					type: "timepicker",
					action_id: "time_picker",
					placeholder: {
						type: "plain_text",
						text: "Select a time",
					},
				},
				label: {
					type: "plain_text",
					text: "Approximate time",
				},
			},
			{
				type: "input",
				block_id: "bug_steps",
				element: {
					type: "plain_text_input",
					action_id: "steps_text",
					multiline: true,
					placeholder: {
						type: "plain_text",
						text: "1. Go to...\n2. Click on...\n3. See error...",
					},
				},
				label: {
					type: "plain_text",
					text: "Steps to Reproduce",
				},
			},
			{
				type: "input",
				block_id: "bug_impact",
				element: {
					type: "multi_static_select",
					action_id: "impact_select",
					placeholder: {
						type: "plain_text",
						text: "Select affected areas",
					},
					options: [
						{
							text: { type: "plain_text", text: "Frontend" },
							value: "frontend",
						},
						{
							text: { type: "plain_text", text: "Backend" },
							value: "backend",
						},
						{
							text: { type: "plain_text", text: "Database" },
							value: "database",
						},
						{
							text: { type: "plain_text", text: "API" },
							value: "api",
						},
						{
							text: { type: "plain_text", text: "Authentication" },
							value: "auth",
						},
					],
				},
				label: {
					type: "plain_text",
					text: "Affected Areas",
				},
			},
			{
				type: "input",
				block_id: "bug_severity",
				element: {
					type: "static_select",
					action_id: "severity_select",
					placeholder: {
						type: "plain_text",
						text: "Select severity",
					},
					options: [
						{
							text: { type: "plain_text", text: "Critical" },
							value: "critical",
						},
						{
							text: { type: "plain_text", text: "Major" },
							value: "major",
						},
						{
							text: { type: "plain_text", text: "Minor" },
							value: "minor",
						},
						{
							text: { type: "plain_text", text: "Trivial" },
							value: "trivial",
						},
					],
				},
				label: {
					type: "plain_text",
					text: "Severity",
				},
			},
			{
				type: "input",
				block_id: "bug_url",
				optional: true,
				element: {
					type: "url_text_input",
					action_id: "url_input",
					placeholder: {
						type: "plain_text",
						text: "https://example.com/screenshot",
					},
				},
				label: {
					type: "plain_text",
					text: "Reference URL (screenshot, video, etc.)",
				},
			},
		],
	};
}

export function otherModal(channelId: string): ModalView {
	return {
		type: "modal",
		callback_id: "other_submit",
		private_metadata: JSON.stringify({ channelId }),
		title: {
			type: "plain_text",
			text: "Other Inquiry",
		},
		submit: {
			type: "plain_text",
			text: "Submit",
		},
		close: {
			type: "plain_text",
			text: "Cancel",
		},
		blocks: [
			{
				type: "input",
				block_id: "other_subject",
				element: {
					type: "plain_text_input",
					action_id: "subject_text",
					placeholder: {
						type: "plain_text",
						text: "Subject",
					},
				},
				label: {
					type: "plain_text",
					text: "Subject",
				},
			},
			{
				type: "input",
				block_id: "other_content",
				element: {
					type: "plain_text_input",
					action_id: "content_text",
					multiline: true,
					placeholder: {
						type: "plain_text",
						text: "Enter your message here...",
					},
				},
				label: {
					type: "plain_text",
					text: "Content",
				},
			},
			{
				type: "input",
				block_id: "other_email",
				optional: true,
				element: {
					type: "email_text_input",
					action_id: "email_input",
					placeholder: {
						type: "plain_text",
						text: "your.email@example.com",
					},
				},
				label: {
					type: "plain_text",
					text: "Contact Email (if you need a reply)",
				},
			},
			{
				type: "input",
				block_id: "other_channel",
				optional: true,
				element: {
					type: "channels_select",
					action_id: "channel_select",
					placeholder: {
						type: "plain_text",
						text: "Select a channel",
					},
				},
				label: {
					type: "plain_text",
					text: "Related Channel",
				},
			},
			{
				type: "input",
				block_id: "other_urgency",
				optional: true,
				element: {
					type: "number_input",
					action_id: "urgency_input",
					is_decimal_allowed: false,
					min_value: "1",
					max_value: "5",
					placeholder: {
						type: "plain_text",
						text: "1 (low) - 5 (high)",
					},
				},
				label: {
					type: "plain_text",
					text: "Urgency (1-5)",
				},
			},
		],
	};
}
