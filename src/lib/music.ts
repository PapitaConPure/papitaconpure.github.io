import type { LocalizableField } from '@/types/i18n';
import type { AssetFormat, CategoryKey, MusicItem } from '@/types/music';
import { defaultLocale, type Locale } from './i18n';

export function resolveLocalizableField(field: LocalizableField | undefined, lang: Locale): string {
	if (field == null) return '';
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
					: {
							name: `${resolveLocalizableField(artist.name, lang)}`,
							clarification: artist.clarification
								? ` (${resolveLocalizableField(artist.clarification, lang)})`
								: '',
						},
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

export const assetMappings = {
	audio: ['mp3', 'flac', 'wav'] as const,
	image: ['jpg', 'png', 'gif', 'webp'] as const,
	video: ['mp4', 'mov', 'webm'] as const,
	document: ['pdf', 'docx', 'txt'] as const,
	zip: ['zip', 'rar', '7z'] as const,
	file: ['midi', 'mscz'] as const,
} as const;

//Make an index that helps retrieval of the family a format belongs to
export const assetFormatKindsIndex = Object.entries(assetMappings).reduce(
	(acc, [kind, formats]) => {
		formats.forEach((format) => {
			acc[format] = kind as keyof typeof assetMappings;
		});
		return acc;
	},
	{} as Record<AssetFormat, keyof typeof assetMappings>,
);

export const assetKinds = Object.keys(assetMappings) as Array<keyof typeof assetMappings>;

export const audioAssetFormats = assetMappings.audio;
export const imageAssetFormats = assetMappings.image;
export const videoAssetFormats = assetMappings.video;
export const documentAssetFormats = assetMappings.document;
export const zippedAssetFormats = assetMappings.zip;
export const otherAssetFormats = assetMappings.file;

export const allAssetFormats = [
	...audioAssetFormats,
	...imageAssetFormats,
	...videoAssetFormats,
	...documentAssetFormats,
	...zippedAssetFormats,
	...otherAssetFormats,
];
