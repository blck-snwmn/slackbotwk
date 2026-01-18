import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { validateBugDateTime } from "./datetime";

describe("validateBugDateTime", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2025-01-15T14:30:00"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns valid when date is undefined", () => {
		const result = validateBugDateTime(undefined, undefined);
		expect(result.valid).toBe(true);
	});

	it("returns valid for past date", () => {
		const result = validateBugDateTime("2025-01-10", undefined);
		expect(result.valid).toBe(true);
	});

	it("returns valid for today without time", () => {
		const result = validateBugDateTime("2025-01-15", undefined);
		expect(result.valid).toBe(true);
	});

	it("returns valid for today with past time", () => {
		const result = validateBugDateTime("2025-01-15", "10:00");
		expect(result.valid).toBe(true);
	});

	it("returns error for future date", () => {
		const result = validateBugDateTime("2025-01-20", undefined);

		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.field).toBe("bug_date");
			expect(result.error).toBe("発生日は今日以前の日付を選択してください");
		}
	});

	it("returns error for today with future time", () => {
		const result = validateBugDateTime("2025-01-15", "16:00");

		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.field).toBe("bug_time");
			expect(result.error).toBe("発生時刻は現在より前を指定してください");
		}
	});

	it("returns valid for past date with any time", () => {
		const result = validateBugDateTime("2025-01-10", "23:59");
		expect(result.valid).toBe(true);
	});
});
