import { LocalizableField } from '@/types/i18n';
import { defaultLocale, Locale } from './i18n';
import { CategoryKey, MusicItem } from '@/types/music';

export function resolveLocalizableField(field: LocalizableField | undefined, lang: Locale): string {
	if (field == undefined) return '';
	if (typeof field === 'string') return field;
	return field[lang] ?? field[defaultLocale] ?? Object.values(field)[0] ?? `${field}`;
}

export const getLocalizedArtistNames = (item: MusicItem, lang: Locale) =>
	item.displayArtist
		? [item.displayArtist]
		: item.artists.map((artist) =>
				typeof artist === 'string' ? artist : resolveLocalizableField(artist.name, lang),
			);

export const getLocalizedArtistFullNames = (item: MusicItem, lang: Locale) =>
	item.displayArtist
		? [{ name: item.displayArtist, clarification: undefined }]
		: item.artists.map((artist) =>
				typeof artist === 'string'
					? { name: artist, clarification: undefined }
					: { name: `${resolveLocalizableField(artist.name, lang)}`, clarification: artist.clarification ? ` (${resolveLocalizableField(artist.clarification, lang)})` : '' },
			);

export const localizableCategories: Record<CategoryKey, LocalizableField> = {
	original: 'original',
	arrangement: {
		es: 'arreglo',
		en: 'arrangement',
		ja: 'アレンジ',
	},
	collab: {
		es: 'collab',
		ja: 'コラボ',
	},
	medley: {
		es: 'medley',
		ja: 'メドレー',
	},
	piano: {
		es: 'piano',
		ja: 'ピアノ',
	},
	touhou: {
		es: 'touhou',
		ja: '東方',
	},
};
