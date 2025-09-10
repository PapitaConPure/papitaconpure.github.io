export function formatDateUTC(
	date: Date,
	{ sep = '.', yearPad = 4, monthPad = 2, dayPad = 2 } = {},
): string {
	const year = `${date.getUTCFullYear()}`.padStart(yearPad, '0');
	const month = `${date.getUTCMonth() + 1}`.padStart(monthPad, '0');
	const day = `${date.getUTCDate()}`.padStart(dayPad, '0');
	return `${year}${sep}${month}${sep}${day}`;
}
