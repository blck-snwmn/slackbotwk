import { describe, it, expect } from "vitest";
import { questionModal, requestModal, bugModal, otherModal, reportModal } from "./modals";
import type { ReportData } from "../types/report";

describe("questionModal", () => {
	const channelId = "C123456";

	it("returns correct callback_id", () => {
		const result = questionModal(channelId);
		expect(result.callback_id).toBe("question_submit");
	});

	it("includes channelId in private_metadata", () => {
		const result = questionModal(channelId);
		const metadata = JSON.parse(result.private_metadata ?? "{}");
		expect(metadata.channelId).toBe(channelId);
	});

	it("has required input blocks", () => {
		const result = questionModal(channelId);
		const blockIds = result.blocks?.map((b) => ("block_id" in b ? b.block_id : null));

		expect(blockIds).toContain("question_category");
		expect(blockIds).toContain("question_input");
		expect(blockIds).toContain("question_assignee");
	});
});

describe("requestModal", () => {
	const channelId = "C123456";

	it("returns correct callback_id", () => {
		const result = requestModal(channelId);
		expect(result.callback_id).toBe("request_submit");
	});

	it("includes channelId in private_metadata", () => {
		const result = requestModal(channelId);
		const metadata = JSON.parse(result.private_metadata ?? "{}");
		expect(metadata.channelId).toBe(channelId);
	});

	it("has required input blocks", () => {
		const result = requestModal(channelId);
		const blockIds = result.blocks?.map((b) => ("block_id" in b ? b.block_id : null));

		expect(blockIds).toContain("request_title");
		expect(blockIds).toContain("request_description");
		expect(blockIds).toContain("request_category");
		expect(blockIds).toContain("request_priority");
	});
});

describe("bugModal", () => {
	const channelId = "C123456";

	it("returns correct callback_id", () => {
		const result = bugModal(channelId);
		expect(result.callback_id).toBe("bug_submit");
	});

	it("includes channelId in private_metadata", () => {
		const result = bugModal(channelId);
		const metadata = JSON.parse(result.private_metadata ?? "{}");
		expect(metadata.channelId).toBe(channelId);
	});

	it("has required input blocks", () => {
		const result = bugModal(channelId);
		const blockIds = result.blocks?.map((b) => ("block_id" in b ? b.block_id : null));

		expect(blockIds).toContain("bug_summary");
		expect(blockIds).toContain("bug_date");
		expect(blockIds).toContain("bug_steps");
		expect(blockIds).toContain("bug_severity");
	});
});

describe("otherModal", () => {
	const channelId = "C123456";

	it("returns correct callback_id", () => {
		const result = otherModal(channelId);
		expect(result.callback_id).toBe("other_submit");
	});

	it("includes channelId in private_metadata", () => {
		const result = otherModal(channelId);
		const metadata = JSON.parse(result.private_metadata ?? "{}");
		expect(metadata.channelId).toBe(channelId);
	});

	it("has required input blocks", () => {
		const result = otherModal(channelId);
		const blockIds = result.blocks?.map((b) => ("block_id" in b ? b.block_id : null));

		expect(blockIds).toContain("other_subject");
		expect(blockIds).toContain("other_content");
	});
});

describe("reportModal", () => {
	const channelId = "C123456";

	it("returns correct callback_id", () => {
		const result = reportModal(channelId, null);
		expect(result.callback_id).toBe("report_submit");
	});

	it("includes channelId in private_metadata", () => {
		const result = reportModal(channelId, null);
		const metadata = JSON.parse(result.private_metadata ?? "{}");
		expect(metadata.channelId).toBe(channelId);
	});

	it("has required input blocks", () => {
		const result = reportModal(channelId, null);
		const blockIds = result.blocks?.map((b) => ("block_id" in b ? b.block_id : null));

		expect(blockIds).toContain("report_done");
		expect(blockIds).toContain("report_plan");
		expect(blockIds).toContain("report_comment");
	});

	it("does not set initial values when previousData is null", () => {
		const result = reportModal(channelId, null);
		const blocks = result.blocks ?? [];

		for (const block of blocks) {
			if ("element" in block && "initial_value" in block.element) {
				expect(block.element.initial_value).toBeUndefined();
			}
		}
	});

	it("sets initial values when previousData is provided", () => {
		const previousData: ReportData = {
			done: "Implemented feature A",
			plan: "Start feature B",
			comment: "Going well",
			submittedAt: "2026-01-28T10:00:00Z",
			channelId: "C999",
		};
		const result = reportModal(channelId, previousData);
		const blocks = result.blocks ?? [];

		const doneBlock = blocks.find((b) => "block_id" in b && b.block_id === "report_done");
		const planBlock = blocks.find((b) => "block_id" in b && b.block_id === "report_plan");
		const commentBlock = blocks.find((b) => "block_id" in b && b.block_id === "report_comment");

		expect(doneBlock).toBeDefined();
		expect(planBlock).toBeDefined();
		expect(commentBlock).toBeDefined();

		if (doneBlock && "element" in doneBlock) {
			expect((doneBlock.element as { initial_value?: string }).initial_value).toBe(
				"Implemented feature A",
			);
		}
		if (planBlock && "element" in planBlock) {
			expect((planBlock.element as { initial_value?: string }).initial_value).toBe(
				"Start feature B",
			);
		}
		if (commentBlock && "element" in commentBlock) {
			expect((commentBlock.element as { initial_value?: string }).initial_value).toBe("Going well");
		}
	});

	it("does not set initial value for comment when it is null", () => {
		const previousData: ReportData = {
			done: "Did something",
			plan: "Will do something",
			comment: null,
			submittedAt: "2026-01-28T10:00:00Z",
			channelId: "C999",
		};
		const result = reportModal(channelId, previousData);
		const blocks = result.blocks ?? [];

		const commentBlock = blocks.find((b) => "block_id" in b && b.block_id === "report_comment");
		expect(commentBlock).toBeDefined();

		if (commentBlock && "element" in commentBlock) {
			expect((commentBlock.element as { initial_value?: string }).initial_value).toBeUndefined();
		}
	});
});
