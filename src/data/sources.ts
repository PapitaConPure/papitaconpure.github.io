import { faSoundcloud, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faExternalLink, type IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type SourceKind = 'youtube' | 'soundcloud' | 'spotify' | 'other';

export interface SourceStyle {
	key: SourceKind;
	iconClassName: string;
	icon: IconDefinition;
}

export const sourceStylesArray: SourceStyle[] = [
	{
		key: 'youtube',
		iconClassName: 'text-youtube',
		icon: faYoutube,
	},
	{
		key: 'soundcloud',
		iconClassName: 'text-soundcloud',
		icon: faSoundcloud,
	},
	{
		key: 'spotify',
		iconClassName: 'text-spotify',
		icon: faSpotify,
	},
	{
		key: 'other',
		iconClassName: '',
		icon: faExternalLink,
	},
];

export const sourceStyles: Record<SourceKind, SourceStyle> = sourceStylesArray.reduce(
	(acc, style) => {
		acc[style.key] = style;
		return acc;
	},
	{} as Record<SourceKind, SourceStyle>,
);
