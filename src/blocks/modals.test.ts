import { describe, it, expect } from "vitest";
import { questionModal, requestModal, bugModal, otherModal } from "./modals";

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
