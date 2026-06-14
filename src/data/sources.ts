import { faSoundcloud, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faExternalLink, type IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type SourceKind = 'youtube' | 'soundcloud' | 'spotify' | 'other';

export interface SourceStyle {
	key: SourceKind;
	className: string;
	icon: IconDefinition;
}

export const sourceStylesArray: SourceStyle[] = [
	{
		key: 'youtube',
		className: 'bg-[#ff0000] hover:bg-[#d70000] active:bg-[#bc0000]',
		icon: faYoutube,
	},
	{
		key: 'soundcloud',
		className: 'bg-[#fc4003] hover:bg-[#d13400] active:bg-[#b92e00]',
		icon: faSoundcloud,
	},
	{
		key: 'spotify',
		className:
			'!text-[#181413] font-semibold bg-[#1ed760] hover:bg-[#19b14e] active:bg-[#20ff6e]',
		icon: faSpotify,
	},
	{
		key: 'other',
		className: 'bg-secondary-700 hover:bg-secondary-600 active:bg-secondary-800',
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
