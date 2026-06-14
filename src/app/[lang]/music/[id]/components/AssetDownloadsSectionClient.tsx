'use client';

import { faEye, faFilter, faRefresh, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import { faTableList } from '@fortawesome/free-solid-svg-icons/faTableList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type React from 'react';
import {
	type AnchorHTMLAttributes,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';
import {
	type AudioPlayerTrack,
	sendTrackToAudioPlayer,
	stopAudioPlayer,
	usePlayerTrack,
} from '@/components/AudioPlayer';
import SimpleTooltip from '@/components/SimpleTooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { assetStylesArray } from '@/data/music';
import type { Locale } from '@/lib/i18n';
import {
	allAssetFormats,
	assetFormatKindsIndex,
	assetKinds,
	resolveLocalizableField,
} from '@/lib/music';
import { simpleHash } from '@/lib/utils';
import type { SectionComponentProps } from '@/types/i18n';
import type { AssetFormat, AssetKind, DownloadUrl, MusicItem } from '@/types/music';
import {
	AssetBrowserPortal,
	AssetDownloadCard,
	AssetDownloadDetail,
} from './AssetDownloadsSection';

interface DirectDownloadButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	downloadStageChildren: ReactNode;
	idleClassName?: string;
	downloadingClassName?: string;
}

export function DirectDownloadButton({
	downloadStageChildren,
	className,
	children,
	...props
}: DirectDownloadButtonProps) {
	const [downloading, setDownloading] = useState(false);

	return (
		// biome-ignore lint/a11y/useValidAnchor: Small cute animation while loading link
		<a
			href='#'
			{...props}
			rel='noopener noreferrer'
			className={`${className} ${downloading ? 'pointer-events-none opacity-60' : ''}`}
			onClick={() => {
				setDownloading(true);
				setTimeout(() => setDownloading(false), 2000);
			}}
		>
			{downloading ? downloadStageChildren : children}
		</a>
	);
}

interface AssetDownloadAudioPreviewButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		SectionComponentProps<'Music'> {
	download: DownloadUrl;
	lang: Locale;
	idleContent: React.ReactNode;
	playingContent: React.ReactNode;
}

export function AssetDownloadAudioPreviewButton({
	download,
	lang,
	t,
	idleContent,
	playingContent,
	className = '',
}: AssetDownloadAudioPreviewButtonProps) {
	const { audioPlayerTrack } = usePlayerTrack();
	const isPlayingThisTrack = audioPlayerTrack?.url === download.url;

	const targetTrack: AudioPlayerTrack = {
		url: download.url,
		format: download.format,
		name: `{${download.format.toUpperCase()}} ${download.external ? `[${download.provider}] ` : ''}${resolveLocalizableField(download.label, lang)}`,
		external: download.external,
	};

	return (
		<button
			type='button'
			onClick={() =>
				isPlayingThisTrack ? stopAudioPlayer() : sendTrackToAudioPlayer(targetTrack)
			}
			aria-label={t.detailDownloadsPreviewAriaLabel}
			tabIndex={0}
			className={`flex flex-shrink-0 items-center justify-center rounded-md ${isPlayingThisTrack ? 'bg-accent-400' : 'bg-secondary-700'} px-5 py-4 text-white transition-colors duration-100 ${isPlayingThisTrack ? 'hover:bg-red-600' : 'hover:bg-secondary-600'} sm:px-4 sm:py-3 md:px-3 md:py-2 ${className}`}
		>
			{isPlayingThisTrack ? <>{playingContent}</> : <>{idleContent}</>}
		</button>
	);
}

function AssetDownloadsBrowserDisplayIncreaseButton({
	children,
	className = '',
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={`mt-2 flex w-full items-center rounded-md px-8 py-3 font-medium text-foreground transition-colors sm:mt-0 sm:w-40 sm:justify-center sm:px-4 sm:py-2 ${className}`}
			{...props}
		>
			<FontAwesomeIcon
				icon={faEye}
				size='lg'
				className='text-lg sm:mr-3 md:mr-2 md:text-base'
			/>
			<span className='flex-grow'>{children}</span>
		</button>
	);
}

const MAX_DISPLAYED_ASSETS_DEFAULT = 9;

const MAX_DISPLAYED_ASSETS_INCREASE = 12;

interface AssetDownloadsBrowserProps
	extends SectionComponentProps<'Music'>,
		HTMLAttributes<HTMLDivElement> {
	item: MusicItem;
	lang: Locale;
}

export function AssetDownloadsBrowser({ item, lang, t, ...props }: AssetDownloadsBrowserProps) {
	const [activeKindFilters, setActiveKindFilters] = useState(() => new Set<AssetKind>());
	const [activeFormatFilters, setActiveFormatFilters] = useState(() => new Set<AssetFormat>());
	const [maxDisplayedAssets, setMaxDisplayedAssets] = useState(MAX_DISPLAYED_ASSETS_DEFAULT);
	const [detailView, setDetailView] = useState(false);

	const allDownloads = item.downloadUrls;
	const trueMaximum = allDownloads?.length || 0;
	const allKinds = new Set(
		allDownloads
			? assetKinds.filter((assetKind) =>
					allDownloads.some((download) => download.kind === assetKind),
				)
			: [],
	);
	const allFormats = new Set(
		allDownloads
			? allAssetFormats.filter((assetFormat) =>
					allDownloads.some((download) => download.format === assetFormat),
				)
			: [],
	);

	const [filteredAssetsCount, setFilteredAssetsCount] = useState(trueMaximum);

	const resetAssetBrowser = () => {
		setActiveKindFilters(() => new Set<AssetKind>());
		setActiveFormatFilters(() => new Set<AssetFormat>());
		setMaxDisplayedAssets(() => MAX_DISPLAYED_ASSETS_DEFAULT);
	};

	const showMore = () => {
		setMaxDisplayedAssets((prev) =>
			Math.min(trueMaximum, prev + MAX_DISPLAYED_ASSETS_INCREASE),
		);
	};

	const showAll = () => {
		setMaxDisplayedAssets(trueMaximum);
	};

	const toggleDetailView = () => {
		setDetailView(!detailView);
	};

	const toggleKindFilter = (kind: AssetKind) => {
		setActiveKindFilters((prev) => {
			const newSet = new Set(prev);

			if (newSet.has(kind)) {
				newSet.delete(kind);
			} else {
				newSet.add(kind);
			}

			return newSet;
		});
	};

	const toggleFormatFilter = (format: AssetFormat) => {
		setActiveFormatFilters((prev) => {
			const newSet = new Set(prev);

			if (newSet.has(format)) {
				newSet.delete(format);
			} else {
				newSet.add(format);
			}

			return newSet;
		});
	};

	function isDownloadKindDisplayed(downloadKind: AssetKind) {
		if (activeKindFilters.size === 0) return true;

		return activeKindFilters.has(downloadKind);
	}

	const areActiveFormatsWithinActiveKinds = useCallback(() => {
		for (const activeFormatFilter of activeFormatFilters) {
			const activeFormatKind = assetFormatKindsIndex[activeFormatFilter];
			if (activeFormatKind && activeKindFilters.has(activeFormatKind)) return true;
		}
	}, [activeFormatFilters, activeKindFilters]);

	function isDownloadFormatDisplayed(downloadFormat: AssetFormat | null = null) {
		if (activeKindFilters.size === 0) return true;
		if (downloadFormat == null) return true;
		if (!areActiveFormatsWithinActiveKinds()) return true;

		return activeFormatFilters.has(downloadFormat);
	}

	const isDownloadDisplayed = useCallback(
		(downloadKind: AssetKind, downloadFormat: AssetFormat) => {
			if (activeKindFilters.size === 0) return true;
			if (!activeKindFilters.has(downloadKind)) return false;
			if (activeFormatFilters.size === 0) return true;
			if (!areActiveFormatsWithinActiveKinds()) return true;

			return activeFormatFilters.has(downloadFormat);
		},
		[activeFormatFilters, activeKindFilters, areActiveFormatsWithinActiveKinds],
	);

	useEffect(() => {
		setMaxDisplayedAssets(() => MAX_DISPLAYED_ASSETS_DEFAULT);
	}, []);

	useEffect(() => {
		if (activeKindFilters.size === 0) setFilteredAssetsCount(trueMaximum);
		else
			setFilteredAssetsCount(
				() =>
					allDownloads?.filter((download) =>
						isDownloadDisplayed(download.kind, download.format),
					).length ?? 0,
			);
	}, [allDownloads, activeKindFilters, trueMaximum, isDownloadDisplayed]);

	if (!allDownloads || allDownloads.length <= 0) return;

	//TODO: Añadir ordenamiento y selector de vista de miniaturas/listado

	return (
		<section>
			<div className='flex items-center justify-between space-x-2'>
				<h2 className='section-h2'>
					<span>{t.detailDownloadsTitle}</span>{' '}
					<span className='text-sm font-normal text-foreground/70'>
						(
						{maxDisplayedAssets < allDownloads.length
							&& maxDisplayedAssets < filteredAssetsCount
							&& `${maxDisplayedAssets} / `}
						{activeKindFilters.size > 0 && `${filteredAssetsCount} / `}
						{allDownloads.length})
					</span>
				</h2>
				<div className='flex-grow' />
				<SimpleTooltip content={t.detailDownloadsBrowserSwitchView}>
					<button
						type='button'
						onClick={toggleDetailView}
						aria-label={t.detailDownloadsBrowserReset}
						className='group rounded-md p-1.5 outline-none ring-primary-main transition-all hover:bg-secondary-800 focus:ring-2 active:bg-secondary-900'
					>
						{detailView ? (
							<FontAwesomeIcon
								icon={faTableList}
								className='aspect-square h-4 w-4 text-foreground/80 transition-all duration-150 group-hover:text-foreground group-focus:text-foreground group-active:text-secondary-300'
								size='lg'
							/>
						) : (
							<FontAwesomeIcon
								icon={faTableCellsLarge}
								className='aspect-square h-4 w-4 text-foreground/80 transition-all duration-150 group-hover:text-foreground group-focus:text-foreground group-active:text-secondary-300'
								size='lg'
							/>
						)}
					</button>
				</SimpleTooltip>
				<SimpleTooltip content={t.detailDownloadsBrowserReset}>
					<button
						type='button'
						onClick={resetAssetBrowser}
						aria-label={t.detailDownloadsBrowserReset}
						className='group rounded-md p-1.5 outline-none ring-primary-main transition-all hover:bg-secondary-800 focus:ring-2 active:bg-secondary-900'
					>
						<FontAwesomeIcon
							icon={faRefresh}
							className='aspect-square h-4 w-4 text-foreground/80 transition-colors duration-150 group-hover:rotate-180 group-hover:text-foreground group-hover:transition-all group-focus:rotate-180 group-focus:text-foreground group-focus:transition-all group-active:text-secondary-300'
							size='lg'
						/>
					</button>
				</SimpleTooltip>
				<Popover>
					<PopoverTrigger asChild>
						<button
							type='button'
							aria-label={t.detailDownloadsBrowserFilter}
							className='group rounded-md p-1.5 outline-none ring-primary-main transition-all hover:bg-secondary-800 focus:ring-2 active:bg-secondary-900'
						>
							<FontAwesomeIcon
								icon={faFilter}
								className='aspect-square h-4 w-4 text-accent-400 transition-all duration-150 group-hover:text-accent-100 group-focus:text-foreground group-active:text-accent-500'
								size='lg'
							/>
						</button>
					</PopoverTrigger>
					<PopoverContent className='flex flex-col space-y-6' align='end'>
						<h1 className='font-semibold text-lg'>{t.detailDownloadsBrowserFilter}</h1>
						<div className='flex justify-center space-x-4'>
							{assetStylesArray
								.filter((assetStyle) =>
									allDownloads.some(
										(download) => download.kind === assetStyle.key,
									),
								)
								.map((assetStyle) => (
									<button
										key={assetStyle.key}
										onClick={() => toggleKindFilter(assetStyle.key)}
										className={`w-full rounded-md p-4 text-center outline-none ring-primary-main transition-all duration-100 hover:bg-secondary-800 focus-visible:ring-2 active:bg-secondary-700`}
									>
										<div className='relative mx-auto h-6 w-6'>
											<FontAwesomeIcon
												icon={assetStyle.icon}
												className={`absolute inset-0 transition-all duration-75 ${assetStyle.className} ${isDownloadKindDisplayed(assetStyle.key) ? '' : 'scale-75 opacity-60'}`}
												size='lg'
											/>
											<FontAwesomeIcon
												icon={assetStyle.icon}
												className={`absolute inset-0 mix-blend-plus-lighter blur-md transition-all duration-200 ${assetStyle.className} ${isDownloadKindDisplayed(assetStyle.key) ? '' : 'opacity-0'}`}
												size='lg'
											/>
										</div>
									</button>
								))}
						</div>
						{activeKindFilters.size > 0 && (
							<div
								className={`grid rounded-md bg-background/70 p-2 ${allKinds.size <= 1 ? 'grid-cols-1' : allKinds.size === 2 ? 'grid-cols-2' : allKinds.size === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-2`}
							>
								{allAssetFormats
									.filter(
										(assetFormat) =>
											assetFormatKindsIndex[assetFormat]
											&& activeKindFilters.has(
												assetFormatKindsIndex[assetFormat],
											)
											&& allFormats.has(assetFormat),
									)
									.map((assetFormat) => (
										<button
											key={assetFormat}
											onClick={() => toggleFormatFilter(assetFormat)}
											className={`relative flex aspect-[3/2] w-full items-center justify-center rounded-md px-1 outline-none ring-primary-main transition-all duration-100 hover:bg-secondary-800 focus-visible:ring-2 active:bg-secondary-700`}
										>
											<div
												className={`absolute rounded-md text-sm font-medium transition-all duration-75 ${isDownloadFormatDisplayed(assetFormat) ? '' : 'scale-75 opacity-70'}`}
											>
												{assetFormat.toUpperCase()}
											</div>
											<div
												className={`absolute rounded-md text-sm font-medium mix-blend-plus-lighter blur-md transition-all duration-75 ${isDownloadFormatDisplayed(assetFormat) ? '' : 'opacity-0'}`}
											>
												{assetFormat.toUpperCase()}
											</div>
										</button>
									))}
							</div>
						)}
					</PopoverContent>
				</Popover>
			</div>
			<div {...props}>
				<AssetBrowserPortal detailView={detailView} t={t}>
					{allDownloads
						.filter((download) => isDownloadDisplayed(download.kind, download.format))
						.slice(0, maxDisplayedAssets)
						.map((download) =>
							detailView ? (
								<AssetDownloadDetail
									key={`${download.kind}-${download.format}-${simpleHash(resolveLocalizableField(download.label, lang))}`}
									download={download}
									lang={lang}
									t={t}
								/>
							) : (
								<AssetDownloadCard
									key={`${download.kind}-${download.format}-${simpleHash(resolveLocalizableField(download.label, lang))}`}
									download={download}
									lang={lang}
									t={t}
								/>
							),
						)}
				</AssetBrowserPortal>
				{maxDisplayedAssets < filteredAssetsCount && (
					<div className='mt-6 flex flex-col justify-center sm:flex-row sm:space-x-2'>
						{maxDisplayedAssets + MAX_DISPLAYED_ASSETS_INCREASE <= trueMaximum && (
							<AssetDownloadsBrowserDisplayIncreaseButton
								id='asset-downloads-show-more'
								onClick={showMore}
								className='bg-primary-main duration-150 hover:bg-primary-700'
							>
								{t.detailDownloadsShowMore}
							</AssetDownloadsBrowserDisplayIncreaseButton>
						)}
						{maxDisplayedAssets < trueMaximum && (
							<AssetDownloadsBrowserDisplayIncreaseButton
								id='asset-downloads-show-all'
								onClick={showAll}
								className={
									maxDisplayedAssets + MAX_DISPLAYED_ASSETS_INCREASE
									<= trueMaximum
										? 'border border-secondary-800 bg-secondary-900 duration-100 hover:bg-secondary-800'
										: 'bg-primary-main duration-150 hover:bg-primary-700'
								}
							>
								{t.detailDownloadsShowAll}
							</AssetDownloadsBrowserDisplayIncreaseButton>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
