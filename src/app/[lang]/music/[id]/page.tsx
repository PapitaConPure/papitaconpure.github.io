import Link from 'next/link';
import items, { assetStyles, itemsById } from '@/data/music';
import Image from 'next/image';
import { YouTubeVideo } from '@/components/YouTubeVideo';
import { OlHTMLAttributes } from 'react';
import getRoot from '@/lib/getroot';
import { CreditsField, FullArtistCredit, MusicItem } from '@/types/music';
import BackSection from '@/components/BackSection';
import AudioPreview from '@/components/AudioPreview';
import VideoPreview from '@/components/VideoPreview';
import { Metadata, Viewport } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheck,
	faClock,
	faDownload,
	faExternalLinkAlt,
	faEye,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { getMessages, isValidLocale, Locale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Tr, { trStr } from '@/lib/i18n/Tr';
import { localizableCategories, resolveLocalizableField } from '@/lib/music';
import DirectDownloadButton from '@/components/DirectDownloadButton';

const SmallSeparator = () => <div className='my-4 h-[1px] w-full bg-secondary-800 bg-opacity-30' />;

const ChildrenList = ({ children }: OlHTMLAttributes<HTMLDataListElement>) => (
	<ol className='flex flex-col space-y-0.5 rounded-sm border border-secondary-800 px-6 py-3'>
		{children}
	</ol>
);

interface CredittedArtistProps {
	artist: string | FullArtistCredit;
	lang: Locale;
}

const getListedArtists = (item: MusicItem, lang: Locale) =>
	`${item.displayArtist || item.artists.map((artist) => (typeof artist === 'string' ? artist : resolveLocalizableField(artist.name, lang))).join(' & ')}`;

const CredittedArtist = ({ artist, lang }: CredittedArtistProps) => {
	if (typeof artist === 'string') return <span>{artist}</span>;

	if (!artist.url)
		return (
			<span className='flex flex-wrap space-x-1 sm:justify-center'>
				<span className='self-start leading-tight'>
					{resolveLocalizableField(artist.name, lang)}
				</span>
				{artist.clarification && (
					<span className='self-end text-xs text-secondary-300'>
						({resolveLocalizableField(artist.clarification, lang)})
					</span>
				)}
			</span>
		);

	return (
		<a
			href={artist.url}
			target='_blank'
			rel='noopener noreferrer'
			className='text-link group flex flex-wrap space-x-1 sm:justify-center'>
			<span className='self-start leading-tight'>
				{resolveLocalizableField(artist.name, lang)}
			</span>
			{artist.clarification && (
				<span className='self-end text-xs text-accent-400 group-hover:text-accent-500 group-active:text-accent-600'>
					({resolveLocalizableField(artist.clarification, lang)})
				</span>
			)}
		</a>
	);
};

interface CreditsFieldDescriptor {
	title: string;
	creditsField: CreditsField;
}

interface ExtendedCreditsCategoryProps {
	localizedCategoryTitle: string;
	creditsFieldDescriptors: CreditsFieldDescriptor[];
	lang: Locale;
}

function ExtendedCreditsCategory({
	localizedCategoryTitle,
	creditsFieldDescriptors,
	lang,
}: ExtendedCreditsCategoryProps) {
	return (
		<div>
			<h3 className='section-h3'>{localizedCategoryTitle}</h3>
			<div className='mt-4 grid grid-cols-1 gap-x-2 gap-y-5 lg:grid-cols-2'>
				{creditsFieldDescriptors.map(({ title, creditsField }, i, arr) => (
					<div
						key={i}
						className={
							arr.length % 2 !== 0 && i === arr.length - 1 ? 'lg:col-span-full' : ''
						}>
						<h4 className='section-h4 mb-3'>{title}</h4>
						<ul className='flex list-disc flex-col gap-y-2 break-all pl-6 text-secondary-100 sm:mx-auto sm:w-max sm:list-none sm:pl-0 md:w-full'>
							{creditsField.map((artist, index) => (
								<li key={index}>
									{<CredittedArtist artist={artist} lang={lang} />}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}

function formatDateUTC(date: Date, sep = '.'): string {
	const year = `${date.getUTCFullYear()}`.padStart(4, '0');
	const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
	const day = `${date.getUTCDate()}`.padStart(2, '0');
	return `${year}${sep}${month}${sep}${day}`;
}

interface MusicDetailProps {
	params: Promise<{
		id: string;
		lang: string;
	}>;
}

export const viewport: Viewport = {
	themeColor: '#c97f72',
};

export async function generateStaticParams() {
	return locales.flatMap((lang) =>
		items.map((item) => ({
			lang,
			id: item.id,
		})),
	);
}

export async function generateMetadata({ params }: MusicDetailProps): Promise<Metadata> {
	const { id = undefined, lang = undefined } = await params;
	const item = id ? itemsById[id] : undefined;

	if (!lang || !isValidLocale(lang)) return { title: 'Not Found' };

	const messages = await getMessages(lang);
	if (!messages) return { title: 'Not Found' };

	if (!item) return { title: messages.NotFound.notice };

	const bigImageUrl = item.thumbnailUrl || item.coverUrl;

	return {
		title: resolveLocalizableField(item.title, lang),
		description:
			resolveLocalizableField(item.description, lang) || `${getListedArtists(item, lang)}`,
		openGraph: {
			title: resolveLocalizableField(item.title, lang),
			description: resolveLocalizableField(item.description, lang),
			url: `https://papitaconpure.github.io/music/${item.id}`,
			images: [
				bigImageUrl.startsWith('http')
					? bigImageUrl
					: `https://papitaconpure.github.io/${bigImageUrl}`,
			],
			type: item.kind === 'single' ? 'music.song' : 'music.album',
			siteName: messages.General.metaSiteName,
		},
		twitter: {
			card: 'summary_large_image',
			title: resolveLocalizableField(item.title, lang),
			description:
				resolveLocalizableField(item.description, lang) ||
				'No description provided for this item.',
			creator:
				item.displayArtist ||
				item.artists
					.map((artist) =>
						typeof artist === 'string'
							? artist
							: resolveLocalizableField(artist.name, lang),
					)
					.join(' & '),
			site: 'https://papitaconpure.github.io',
			images: [
				bigImageUrl.startsWith('http')
					? bigImageUrl
					: `https://papitaconpure.github.io/${bigImageUrl}`,
			],
		},
	};
}

const MusicDetail = async ({ params }: MusicDetailProps) => {
	const { id = undefined, lang = undefined } = await params;
	const item = id ? itemsById[id] : undefined;

	if (!lang || !isValidLocale(lang)) return notFound();

	const messages = await getMessages(lang);
	if (!messages) return notFound();
	const t = messages.Music;

	if (item == undefined) {
		return (
			<main>
				<section>
					<div className='flex justify-center'>
						<div className='flex flex-col items-center space-y-8'>
							<div className='text-9xl'>🥔</div>
							<p>La ID de Música especificada no existe.</p>
						</div>
					</div>
				</section>
				<BackSection href={`/${lang}/music`}>
					<Tr
						t={t.backSectionButton}
						components={{ 1: <span className='font-semibold' /> }}
					/>
				</BackSection>
			</main>
		);
	}

	return (
		<main>
			<section>
				<div className='flex flex-col items-start justify-start sm:flex-row sm:space-x-8'>
					<div className='mx-auto mb-8 w-[90%] max-w-[30rem] flex-shrink-0 sm:mx-0 sm:mb-0 sm:w-80 sm:max-w-[50%] md:w-96'>
						<Image
							src={getRoot(item.coverUrl || item.thumbnailUrl)}
							alt='Cover Art'
							width={500}
							height={500}
							priority
							className='w-full rounded-lg'></Image>
					</div>
					<div className='flex-grow'>
						<p className='mb-1.5 mt-[0.0625rem] flex flex-wrap text-xl text-foreground text-opacity-90'>
							{item.artists.map((artist, index, arr) => (
								<span key={index + 1} className='flex'>
									<CredittedArtist artist={artist} lang={lang} />
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

						{item.externalLinks && item.externalLinks.length > 0 && (
							<>
								<SmallSeparator />
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
								<SmallSeparator />
								<h2 className='section-h3 mb-2'>{t.detailTracklistTitle}</h2>
								<ChildrenList>
									{item.children.map((child, index) => {
										if (child.kind === 'name')
											return (
												<li
													key={index}
													className='flex cursor-default items-start space-x-2 rounded-sm py-0.5 hover:bg-secondary-900'>
													<span className='w-6 flex-shrink-0 text-right text-secondary-600'>
														{`${index + 1}`.padStart(2, '0')}.
													</span>
													<span className='flex-grow text-foreground hover:opacity-90'>
														{resolveLocalizableField(child.data, lang)}
													</span>
												</li>
											);

										const childItem = itemsById[child.data];

										if (!childItem) return <></>;

										return (
											<li
												key={index}
												className='flex items-start space-x-2 rounded-sm py-0.5 hover:bg-secondary-900'>
												<span className='w-6 flex-shrink-0 text-right text-secondary-600'>
													{`${index + 1}`.padStart(2, '0')}.
												</span>
												<Link
													href={`${lang}/music/detail?id=${childItem.id}`}
													className='flex-grow text-accent-400 hover:text-accent-500'>
													{resolveLocalizableField(childItem.title, lang)}
												</Link>
											</li>
										);
									})}
								</ChildrenList>
							</>
						)}

						{item.kind === 'compilation' && (
							<>
								<SmallSeparator />
								<h2 className='section-h3 mb-2'>{t.detailTracklistTitle}</h2>
								<ChildrenList>
									{item.childrenTitles.map((childTitle, index) => {
										return (
											<li
												key={index}
												className='flex cursor-default items-start space-x-2 rounded-sm py-0.5 hover:bg-secondary-900'>
												<span className='w-6 flex-shrink-0 text-right text-secondary-600'>
													{`${index + 1}`.padStart(2, '0')}.
												</span>
												<span className='flex-grow text-foreground hover:opacity-90'>
													{resolveLocalizableField(childTitle, lang)}
												</span>
											</li>
										);
									})}
								</ChildrenList>
							</>
						)}

						<SmallSeparator />
						<p className='text-right text-base font-light text-foreground text-opacity-80'>
							<span className='text-xs font-thin'>UTC</span>{' '}
							{formatDateUTC(item.date)}
						</p>
					</div>
				</div>
			</section>
			{item.videoUrl && (
				<section>
					<h2 className='section-h2'>{t.detailVideoTitle}</h2>
					<div className='mt-4 w-full'>
						<YouTubeVideo
							title={`${t.detailVideoTitle} - ${item.title} (YouTube)`}
							src={item.videoUrl}
							thumbnailUrl={item.thumbnailUrl || undefined}
							className='aspect-video w-full overflow-hidden rounded-md object-cover'
						/>
					</div>
				</section>
			)}
			{item.description && (
				<section>
					<h2 className='section-h2'>{t.detailDescriptionTitle}</h2>
					<p className='mt-2'>
						{resolveLocalizableField(item.description, lang)
							.split('\n')
							.map((line, index, arr) => (
								<span key={index}>
									{line}
									{index < arr.length - 1 && <br />}
								</span>
							))}
					</p>
				</section>
			)}
			{item.downloadUrls && item.downloadUrls.length > 0 && (
				<section>
					{
						//TODO: Añadir filtros, ordenamiento y selector de vista de miniaturas/listado
					}
					<h2 className='section-h2'>{t.detailDownloadsTitle}</h2>
					<div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
						{item.downloadUrls.map((download, index) => (
							<div
								key={index}
								className='relative flex flex-col items-center justify-start rounded-md border border-secondary-700 bg-secondary-800 p-4 transition-transform duration-500 md:hover:scale-105 md:hover:motion-reduce:scale-100'>
								<div className='relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-secondary-900'>
									{download.kind === 'image' &&
										(download.previewUrl || download.url) && (
											<div className='absolute inset-0 opacity-25'>
												<Image
													src={getRoot(download.url)}
													alt='Preview Backdrop'
													fill
													className='absolute inset-0 rounded-md object-fill blur-md'
												/>
												<Image
													src={getRoot(download.url)}
													alt='Preview'
													fill
													className='absolute inset-0 rounded-md object-contain'
												/>
											</div>
										)}
									{download.kind === 'video' && (
										<div className='absolute inset-0 opacity-25'>
											{download.previewUrl ? (
												<VideoPreview
													url={download.previewUrl}
													format={
														download.previewFormat || download.format
													}
													className='absolute inset-0 my-auto rounded-md'
												/>
											) : (
												download.url && (
													<VideoPreview
														{...download}
														className='absolute inset-0 my-auto rounded-md'
													/>
												)
											)}
										</div>
									)}
									<div className='absolute flex w-full flex-col items-center space-y-1'>
										<FontAwesomeIcon
											icon={assetStyles[download.kind].icon}
											className={`text-7xl ${assetStyles[download.kind].className} sm:text-9xl md:text-8xl`}
										/>
										{download.format !== '' && (
											<div className='text-2xl font-bold sm:text-4xl md:text-3xl'>
												{download.format.toUpperCase()}
											</div>
										)}
									</div>
								</div>
								<h2 className='mb-4 flex-grow'>
									{resolveLocalizableField(download.label, lang)}
								</h2>
								{download.kind === 'audio' && download.url && (
									<AudioPreview
										{...download}
										className='h-13 mb-2 w-full rounded-md bg-white sm:h-12 md:h-9'
									/>
								)}
								<div className='flex w-full flex-shrink-0 space-x-2'>
									{!download.url && (
										<button
											aria-disabled
											className='flex flex-grow cursor-not-allowed items-center justify-center rounded-md bg-secondary-main px-5 py-4 text-secondary-200 transition-colors duration-100 hover:bg-secondary-700 sm:px-4 sm:py-3 md:py-2'>
											<FontAwesomeIcon
												icon={faClock}
												className='cursor-not-allowed text-xl md:text-base'
											/>
										</button>
									)}
									{download.url && (
										<DirectDownloadButton
											href={getRoot(download.url)}
											aria-label={trStr(t.detailDownloadsDownloadAriaLabel, {
												assetlabel: resolveLocalizableField(
													download.label,
													lang,
												),
												filesize: download.size,
											})}
											download={!download.external || download.direct}
											target={download.external ? '_blank' : '_self'}
											rel='noopener noreferrer'
											className='flex flex-grow cursor-pointer items-center justify-center rounded-md bg-primary-main px-5 py-4 text-white transition-colors duration-200 hover:bg-primary-700 sm:px-4 sm:py-3 md:py-2'
											downloadStageChildren={
												<>
													<FontAwesomeIcon
														icon={faCheck}
														className='mr-2 cursor-not-allowed text-xl md:text-base'
													/>
													<div className='cursor-not-allowed select-none text-center text-xl font-semibold sm:text-lg md:text-sm'>
														{download.size}
													</div>
													<FontAwesomeIcon
														icon={faSpinner}
														size='xs'
														className='ml-2 animate-spin opacity-80'
													/>
												</>
											}>
											<FontAwesomeIcon
												icon={faDownload}
												className='mr-2 cursor-pointer text-xl md:text-base'
											/>
											<div className='cursor-pointer select-none text-center text-xl font-semibold sm:text-lg md:text-sm'>
												{download.size}
											</div>
											{download.external && (
												<FontAwesomeIcon
													icon={faExternalLinkAlt}
													size='xs'
													className='mb-0.5 ml-2 cursor-pointer opacity-80'
												/>
											)}
										</DirectDownloadButton>
									)}
									{download.url && download.kind === 'document' && (
										<a
											href={download.url}
											aria-label={t.detailDownloadsDocumentPreviewAriaLabel}
											rel='noopener noreferrer'
											target='_blank'
											tabIndex={0}
											className='flex flex-shrink-0 items-center justify-center rounded-md bg-secondary-700 px-5 py-4 text-white transition-colors duration-100 hover:bg-secondary-600 sm:px-4 sm:py-3 md:px-3 md:py-2'>
											<FontAwesomeIcon
												icon={faEye}
												className='text-xl md:text-base'
											/>
											{download.external && (
												<FontAwesomeIcon
													icon={faExternalLinkAlt}
													size='xs'
													className='mb-0.5 ml-2 cursor-pointer opacity-80'
												/>
											)}
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}
			{item.credits && (
				<section>
					<h2 className='section-h2'>{t.detailCreditsTitle}</h2>
					<div className='mt-4 grid grid-cols-1 gap-x-6 gap-y-8 rounded-md border border-secondary-800 px-4 pb-4 pt-3 text-left sm:grid-cols-2 sm:text-center lg:gap-x-8'>
						{item.credits.music && (
							<ExtendedCreditsCategory
								localizedCategoryTitle={t.detailCreditsMusic}
								creditsFieldDescriptors={
									[
										{
											title: t.detailCreditsMusicComposers,
											creditsField: item.credits.music.composers,
										},
										{
											title: t.detailCreditsMusicArrangers,
											creditsField: item.credits.music.arrangers,
										},
										{
											title: t.detailCreditsMusicMixers,
											creditsField: item.credits.music.mixers,
										},
									].filter(
										(cfd) => cfd.creditsField != undefined,
									) as CreditsFieldDescriptor[]
								}
								lang={lang}
							/>
						)}
						{item.credits.visuals && (
							<ExtendedCreditsCategory
								localizedCategoryTitle={t.detailCreditsVisuals}
								creditsFieldDescriptors={
									[
										{
											title: t.detailCreditsVisualsForeground,
											creditsField: item.credits.visuals.foreground,
										},
										{
											title: t.detailCreditsVisualsBackground,
											creditsField: item.credits.visuals.background,
										},
										{
											title: t.detailCreditsVisualsCover,
											creditsField: item.credits.visuals.cover,
										},
										{
											title: t.detailCreditsVisualsThumbnail,
											creditsField: item.credits.visuals.thumbnail,
										},
									].filter(
										(cfd) => cfd.creditsField != undefined,
									) as CreditsFieldDescriptor[]
								}
								lang={lang}
							/>
						)}
					</div>
				</section>
			)}
			{item.licensing && (
				<section>
					<h2 className='section-h2'>{t.detailLicensingTitle}</h2>
					{typeof item.licensing === 'string' ? (
						<p className='mt-2'>{item.licensing}</p>
					) : (
						<ul className='mt-4 flex flex-col space-y-4'>
							{item.licensing.map((licenseSpecification, i) => (
								<li
									key={i}
									className='flex rounded-md border border-secondary-700 bg-secondary-800 p-4'>
									<div className='flex min-h-10 flex-grow flex-col justify-center'>
										<h3 className='section-h3'>
											{licenseSpecification.license.label}
										</h3>
										<div className='mt-3 rounded-md bg-secondary-900 p-4'>
											<h4 className='font-semibold'>
												{t.detailLicensingLicenseWorksListName}
											</h4>
											{licenseSpecification.targets?.length ? (
												<ul className='mt-2 flex flex-col space-y-3'>
													{licenseSpecification.targets.map(
														(target, j) => (
															<li
																key={j}
																className='flex items-center space-x-2 font-light leading-tight'>
																<FontAwesomeIcon
																	icon={
																		assetStyles[target.kind]
																			.icon
																	}
																	className={
																		assetStyles[target.kind]
																			.className
																	}
																/>
																<div>
																	{target.workUrl ? (
																		<a
																			href={target.workUrl}
																			className='text-link'>
																			{target.work}
																		</a>
																	) : (
																		<i>{target.work}</i>
																	)}{' '}
																	© {target.year} by{' '}
																	{target.creators.map(
																		(creator, k) =>
																			typeof creator ===
																			'string' ? (
																				<strong key={k}>
																					{creator}
																				</strong>
																			) : creator.url ? (
																				<a
																					href={
																						creator.url
																					}
																					className='text-link'
																					key={k}>
																					{creator.name}
																				</a>
																			) : (
																				<strong key={k}>
																					{creator.name}
																				</strong>
																			),
																	)}
																	.
																</div>
															</li>
														),
													)}
												</ul>
											) : (
												<p className='mt-1 font-light'>
													<i>
														{resolveLocalizableField(item.title, lang)}
													</i>{' '}
													© {item.date.getUTCFullYear()} by{' '}
													<strong>{getListedArtists(item, lang)}</strong>.
												</p>
											)}
										</div>
										{licenseSpecification.license.url && (
											<Link
												href={licenseSpecification.license.url}
												aria-label={trStr(
													t.detailLicensingLicenseViewAriaLabel,
													{
														licensename:
															licenseSpecification.license.label,
													},
												)}
												rel='noopener noreferrer'
												target='_blank'
												tabIndex={0}
												className='mt-4 flex flex-shrink-0 items-center justify-center rounded-md bg-secondary-700 px-5 py-4 text-white transition-colors duration-100 hover:bg-secondary-600 md:hidden'>
												<FontAwesomeIcon
													icon={faEye}
													className='mr-2 text-xl md:text-base'
												/>
												<span className='cursor-pointer select-none text-center'>
													{t.detailLicensingLicenseView}
												</span>
												<FontAwesomeIcon
													icon={faExternalLinkAlt}
													size='xs'
													className='mb-0.5 ml-2 cursor-pointer opacity-80'
												/>
											</Link>
										)}
									</div>
									{licenseSpecification.license.url && (
										<Link
											href={licenseSpecification.license.url}
											aria-label={trStr(
												t.detailLicensingLicenseViewAriaLabel,
												{ licensename: licenseSpecification.license.label },
											)}
											rel='noopener noreferrer'
											target='_blank'
											tabIndex={0}
											className='ml-4 hidden flex-shrink-0 items-center justify-center rounded-md bg-secondary-700 px-4 py-3 text-white transition-colors duration-100 hover:bg-secondary-600 md:flex'>
											<FontAwesomeIcon
												icon={faEye}
												className='text-xl md:text-base'
											/>
											<FontAwesomeIcon
												icon={faExternalLinkAlt}
												size='xs'
												className='mb-0.5 ml-2 cursor-pointer opacity-80'
											/>
										</Link>
									)}
								</li>
							))}
						</ul>
					)}
				</section>
			)}
			{item.tags && item.tags.length > 0 && (
				<section>
					<h2 className='section-h2'>{t.detailTagsTitle}</h2>
					<div className='mt-2 flex flex-wrap space-x-2'>
						{item.tags.map((tag, index) => (
							<span
								key={index}
								className='my-2 rounded-md bg-secondary-800 px-3 py-1 text-sm text-secondary-300'>
								{tag.toUpperCase()}
							</span>
						))}
					</div>
				</section>
			)}
			<BackSection href={`/${lang}/music`}>
				<Tr
					t={t.backSectionButton}
					components={{ 1: <span className='font-semibold' /> }}
				/>
			</BackSection>
		</main>
	);
};

export default MusicDetail;
