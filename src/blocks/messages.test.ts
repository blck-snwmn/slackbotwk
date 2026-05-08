import { describe, it, expect } from "vitest";
import { receptionMessage, helpMessage } from "./messages";

describe("receptionMessage", () => {
	it("returns correct structure", () => {
		const result = receptionMessage();

		expect(result.text).toBe("Reception");
		expect("blocks" in result).toBe(true);
		if ("blocks" in result) {
			expect(result.blocks).toHaveLength(3);
		}
	});

	it("has header block", () => {
		const result = receptionMessage();
		if (!("blocks" in result) || !result.blocks) return;

		const header = result.blocks[0];
		expect(header).toMatchObject({
			type: "header",
			text: { type: "plain_text", text: "Reception" },
		});
	});

	it("has four action buttons", () => {
		const result = receptionMessage();
		if (!("blocks" in result) || !result.blocks) return;

		const actions = result.blocks[2];
		expect(actions?.type).toBe("actions");
		if (actions?.type === "actions" && "elements" in actions) {
			expect(actions.elements).toHaveLength(4);

			const actionIds = actions.elements.map((e) => ("action_id" in e ? e.action_id : null));
			expect(actionIds).toContain("reception_question");
			expect(actionIds).toContain("reception_request");
			expect(actionIds).toContain("reception_bug");
			expect(actionIds).toContain("reception_other");
		}
	});
});

describe("helpMessage", () => {
	it("returns correct structure", () => {
		const result = helpMessage();

		expect(result.text).toBe("Slackbot Help");
		expect("blocks" in result).toBe(true);
		if ("blocks" in result) {
			expect(result.blocks).toHaveLength(5);
		}
	});

	it("has header block", () => {
		const result = helpMessage();
		if (!("blocks" in result) || !result.blocks) return;

		const header = result.blocks[0];
		expect(header).toMatchObject({
			type: "header",
			text: { type: "plain_text", text: "Slackbot Help" },
		});
	});

	it("includes available commands", () => {
		const result = helpMessage();
		if (!("blocks" in result) || !result.blocks) return;

		const commandsBlock = result.blocks[2];
		expect(commandsBlock?.type).toBe("section");
		if (commandsBlock?.type === "section" && "text" in commandsBlock && commandsBlock.text) {
			const text: { text?: string } = commandsBlock.text;
			expect(text.text).toContain("/hello");
			expect(text.text).toContain("/help");
		}
	});
});
