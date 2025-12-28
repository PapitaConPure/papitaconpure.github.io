import { formatDateUTC } from '@/lib/date';
import getRoot from '@/lib/getroot';
import { Locale } from '@/lib/i18n';
import { localizableCategories, resolveLocalizableField } from '@/lib/music';
import { MusicItem } from '@/types/music';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { CreditedArtist } from './CreditedArtist';
import { itemsById } from '@/data/music';
import { SectionAcrossLocales } from '@/types/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';

const SmallSeparator = () => <div className='my-4 h-[1px] w-full bg-secondary-800 bg-opacity-30' />;

const TrackList = ({ children }: React.OlHTMLAttributes<HTMLDataListElement>) => (
	<ol className='flex flex-col space-y-0.5 rounded-sm border border-secondary-800 px-6 py-3'>
		{children}
	</ol>
);

interface TrackListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
	n: number;
	digits?: number;
}

const TrackListItem = ({ n, children, className, digits = 2, ...props }: TrackListItemProps) => (
	<li
		{...props}
		className={`flex items-start space-x-2 rounded-sm py-0.5 hover:bg-secondary-900 ${className || ''}`}>
		{digits > 0 && (
			<span className='w-6 flex-shrink-0 select-none text-right text-secondary-400'>
				{`${n}`.padStart(digits, '0')}.
			</span>
		)}
		{children}
	</li>
);

const TrackListItemContent = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className: string;
}) => <span className={`flex-grow ${className || ''}`}>{children}</span>;

interface TrackDetailsSectionProps {
	lang: Locale;
	item: MusicItem;
	t: SectionAcrossLocales<'Music'>;
}

function TrackDetailsSection({ lang, item, t }: Readonly<TrackDetailsSectionProps>) {
	return (
		<section>
			<div className='flex flex-col items-start justify-start md:flex-row md:space-x-8'>
				<div className='mx-auto mb-8 flex w-[90%] max-w-[30rem] flex-shrink-0 flex-col self-stretch sm:w-96 md:mx-0 md:mb-0 md:w-96 md:max-w-[50%]'>
					<div className='relative w-full rounded-lg'>
						<Image
							src={getRoot(item.coverUrl || item.thumbnailUrl)}
							alt='Cover Art Bleed'
							width={500}
							height={500}
							aria-hidden
							priority
							fetchPriority='high'
							className='absolute inset-0 -z-10 hidden w-full rounded-lg opacity-25 blur-3xl motion-safe:animate-pulse md:block md:contrast-more:hidden lg:scale-110'
							style={{ animationDuration: '20s' }}
						/>
						<Image
							src={getRoot(item.coverUrl || item.thumbnailUrl)}
							alt='Cover Art'
							width={500}
							height={500}
							priority
							fetchPriority='high'
							className='relative w-full rounded-lg'
						/>
					</div>
					{(item.kind === 'album' || item.kind === 'compilation') && (
						<div className='mt-4 hidden flex-grow items-center justify-center md:flex'>
							<FontAwesomeIcon
								icon={faCompactDisc}
								size='10x'
								className='text-accent-main opacity-30'
							/>
						</div>
					)}
				</div>
				<div className='mx-auto flex-grow md:mx-0'>
					<p className='mb-1.5 mt-0.5 flex flex-wrap text-xl text-foreground text-opacity-90'>
						{item.artists.map((artist, index, arr) => (
							<span key={index + 1} className='flex'>
								<CreditedArtist artist={artist} lang={lang} />
								{index < arr.length - 1 && (
									<span className='mx-2 self-center text-base text-secondary-500'>
										&
									</span>
								)}
							</span>
						))}
					</p>
					<h1 className='mb-2.5 font-default-sans text-3xl font-extrabold text-foreground'>
						{resolveLocalizableField(item.title, lang)}
					</h1>
					<div className='mb-3 flex flex-wrap space-x-2 text-xs font-light text-foreground text-opacity-80'>
						{item.categories.map((category, index) => (
							<div
								key={index}
								className='mb-2 rounded-full border border-primary-500 px-2 py-0.5 text-primary-400'>
								{resolveLocalizableField(
									localizableCategories[category],
									lang,
								).toUpperCase()}
							</div>
						))}
					</div>
					<SmallSeparator />

					{item.externalLinks && item.externalLinks.length > 0 && (
						<>
							<h2 className='section-h3 mb-2'>{t.detailLinksTitle}</h2>
							<ul className='list-disc pl-6'>
								{item.externalLinks.map((link, index) => (
									<li key={index}>
										<a
											href={link.url}
											target='_blank'
											rel='noopener noreferrer'
											className='text-link'>
											{resolveLocalizableField(link.label, lang)}
										</a>
									</li>
								))}
							</ul>
						</>
					)}

					{(item.kind === 'album' || item.kind === 'ep') && (
						<>
							<h2 className='section-h3 mt-4 mb-2'>{t.detailTracklistTitle}</h2>
							<TrackList>
								{item.children.map((child, index) => {
									if (child.kind === 'name')
										return (
											<TrackListItem
												key={index}
												n={index + 1}
												className='flex cursor-default items-start space-x-2 rounded-sm py-0.5 hover:bg-secondary-900'>
												<TrackListItemContent className='text-foreground hover:opacity-90'>
													{resolveLocalizableField(child.data, lang)}
												</TrackListItemContent>
											</TrackListItem>
										);

									const childItem = itemsById[child.data];

									if (!childItem) return <></>;

									return (
										<TrackListItem
											key={index}
											n={index + 1}
											className='flex items-start space-x-2 rounded-sm py-0.5 hover:bg-secondary-900'>
											<TrackListItemContent className='text-accent-400 hover:text-accent-500'>
												<Link
													href={`${lang}/music/detail?id=${childItem.id}`}
													className='w-full'>
													{resolveLocalizableField(childItem.title, lang)}
												</Link>
											</TrackListItemContent>
										</TrackListItem>
									);
								})}
							</TrackList>
						</>
					)}

					{item.kind === 'compilation' && (
						<>
							<h2 className='section-h3 mt-5 mb-2'>{t.detailTracklistTitle}</h2>
							<TrackList>
								{item.childrenTitles.map((childTitle, index) => {
									return (
										<TrackListItem
											key={index}
											n={index + 1}
											className='flex cursor-default items-start space-x-2 rounded-sm py-0.5 hover:bg-secondary-900'>
											<TrackListItemContent className='text-foreground hover:opacity-90'>
												{resolveLocalizableField(childTitle, lang)}
											</TrackListItemContent>
										</TrackListItem>
									);
								})}
							</TrackList>
						</>
					)}

					<SmallSeparator />
					<p className='text-right text-base font-light text-foreground text-opacity-80'>
						<span className='text-xs font-thin'>UTC</span> {formatDateUTC(item.date)}
					</p>
				</div>
			</div>
		</section>
	);
}

export default TrackDetailsSection;
