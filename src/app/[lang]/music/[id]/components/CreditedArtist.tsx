import { Locale } from "@/lib/i18n";
import { resolveLocalizableField } from "@/lib/music";
import { FullArtistCredit } from "@/types/music";


interface FullCreditedArtistProps extends React.HTMLAttributes<HTMLSpanElement> {
	artist: FullArtistCredit;
	lang: Locale;
}

export const CreditedArtistName = ({
	artist,
	lang,
	className = '',
	...props
}: FullCreditedArtistProps) => (
	<span className={`self-start leading-tight ${className}`} {...props}>
		{resolveLocalizableField(artist.name, lang)}
	</span>
);

export const CreditedArtistClarification = ({
	artist,
	lang,
	className = '',
	...props
}: FullCreditedArtistProps) =>
	artist.clarification && (
		<span className={`self-end text-xs ${className}`} {...props}>
			({resolveLocalizableField(artist.clarification, lang)})
		</span>
	);

interface CreditedArtistProps {
	artist: string | FullArtistCredit;
	lang: Locale;
}

export const CreditedArtist = ({ artist, lang }: CreditedArtistProps) => {
	if (typeof artist === 'string') return <span>{artist}</span>;

	if (!artist.url)
		return (
			<span className='flex flex-wrap space-x-1 sm:justify-center'>
				<CreditedArtistName artist={artist} lang={lang} />
				<CreditedArtistClarification
					artist={artist}
					lang={lang}
					className='text-secondary-300'
				/>
			</span>
		);

	return (
		<a
			href={artist.url}
			target='_blank'
			rel='noopener noreferrer'
			className='text-link group flex flex-wrap space-x-1 sm:justify-center'>
			<CreditedArtistName artist={artist} lang={lang} />
			<CreditedArtistClarification
				artist={artist}
				lang={lang}
				className='text-accent-400 group-hover:text-accent-500 group-active:text-accent-600'
			/>
		</a>
	);
};
