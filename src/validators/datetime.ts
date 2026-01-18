export type ValidationResult =
	| { valid: true }
	| { valid: false; field: "bug_date" | "bug_time"; error: string };

export function validateBugDateTime(
	date: string | undefined,
	time: string | undefined,
): ValidationResult {
	if (!date) {
		return { valid: true };
	}

	const now = new Date();
	const today = now.toISOString().split("T")[0];

	if (date > today) {
		return {
			valid: false,
			field: "bug_date",
			error: "発生日は今日以前の日付を選択してください",
		};
	}

	if (date === today && time) {
		const selectedDateTime = new Date(`${date}T${time}`);
		if (selectedDateTime > now) {
			return {
				valid: false,
				field: "bug_time",
				error: "発生時刻は現在より前を指定してください",
			};
		}
	}

	return { valid: true };
}
