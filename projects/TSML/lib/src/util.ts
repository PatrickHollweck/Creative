export function equalsAnyOf(value: any, comparisons: any[]) {
	for (const comparison of comparisons) {
		if (value === comparison) return value;
	}

	return false;
}
