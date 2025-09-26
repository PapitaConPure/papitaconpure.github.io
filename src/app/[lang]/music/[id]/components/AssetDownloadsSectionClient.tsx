'use client';

import React, { AnchorHTMLAttributes, HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { AssetDownloadCard } from './AssetDownloadsSection';
import { AssetFormat, AssetKind, MusicItem } from '@/types/music';
import { SectionComponentProps } from '@/types/i18n';
import { Locale } from '@/lib/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { assetStylesArray } from '@/data/music';
import { allAssetFormats, assetFormatKindsIndex } from '@/lib/music';

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
		<a
			{...props}
			rel='noopener noreferrer'
			className={`${className} ${downloading ? 'pointer-events-none opacity-60' : ''}`}
			tabIndex={0}
			onClick={() => {
				setDownloading(true);
				setTimeout(() => setDownloading(false), 2000);
			}}>
			{downloading ? downloadStageChildren : children}
		</a>
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
			{...props}>
			<FontAwesomeIcon
				icon={faEye}
				size='lg'
				className='text-lg sm:mr-3 md:mr-2 md:text-base'
			/>
			<span className='flex-grow'>{children}</span>
		</button>
	);
}

const MAX_DISPLAYED_ASSETS_DEFAULT = 6;

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

	const allDownloads = item.downloadUrls;
	const trueMaximum = allDownloads?.length || 0;

	const [filteredAssetsCount, setFilteredAssetsCount] = useState(trueMaximum);

	const showMore = () => {
		setMaxDisplayedAssets((prev) =>
			Math.min(trueMaximum, prev + MAX_DISPLAYED_ASSETS_INCREASE),
		);
	};

	const showAll = () => {
		setMaxDisplayedAssets(trueMaximum);
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

	function isDownloadFormatDisplayed(downloadFormat: AssetFormat | null = null) {
		if (activeKindFilters.size === 0) return true;
		if (downloadFormat == null) return true;

		return activeFormatFilters.has(downloadFormat);
	}

	const isDownloadDisplayed = (downloadKind: AssetKind, downloadFormat: AssetFormat) => {
		if (activeKindFilters.size === 0) return true;
		if (!activeKindFilters.has(downloadKind)) return false;
		if (activeFormatFilters.size === 0) return true;

		for (const activeFormatFilter of activeFormatFilters) {
			const activeFormatKind = assetFormatKindsIndex[activeFormatFilter];
			if (activeFormatKind && activeKindFilters.has(activeFormatKind))
				return activeFormatFilters.has(downloadFormat);
		}

		return true;
	};

	useEffect(() => {
		setMaxDisplayedAssets(() => MAX_DISPLAYED_ASSETS_DEFAULT);
	}, []);

	useEffect(() => {
		if (activeKindFilters.size === 0) setFilteredAssetsCount(trueMaximum);
		else
			setFilteredAssetsCount(
				() =>
					allDownloads?.filter(
						(download) =>
							activeKindFilters.has(download.kind) &&
							activeFormatFilters.has(download.format),
					).length ?? 0,
			);
	}, [allDownloads, activeKindFilters, activeFormatFilters, trueMaximum]);

	if (!allDownloads || allDownloads.length <= 0) return;

	//TODO: Añadir ordenamiento y selector de vista de miniaturas/listado

	return (
		<section>
			<div className='flex items-center justify-between'>
				<h2 className='section-h2'>
					<span>{t.detailDownloadsTitle}</span>{' '}
					<span className='text-sm font-normal text-foreground/70'>
						(
						{maxDisplayedAssets < allDownloads.length &&
							maxDisplayedAssets < filteredAssetsCount &&
							`${maxDisplayedAssets} / `}
						{activeKindFilters.size > 0 && `${filteredAssetsCount} / `}
						{allDownloads.length})
					</span>
				</h2>
				<Popover>
					<PopoverTrigger asChild>
						<button className='rounded-md p-1.5 outline-none ring-primary-main transition-all hover:bg-secondary-800 focus:ring-2'>
							<FontAwesomeIcon
								icon={faFilter}
								className='aspect-square h-4 w-4 text-foreground/70'
								size='lg'
							/>
						</button>
					</PopoverTrigger>
					<PopoverContent className='flex flex-col space-y-6'>
						<div className='flex space-x-4'>
							{assetStylesArray.map((assetStyle) => (
								<button
									key={assetStyle.key}
									onClick={() => toggleKindFilter(assetStyle.key)}
									className={`w-full rounded-md p-4 text-left outline-none ring-primary-main transition-all duration-100 hover:bg-secondary-800 focus-visible:ring-2 active:bg-secondary-700`}>
									<div className='relative h-6 w-6'>
										<FontAwesomeIcon
											icon={assetStyle.icon}
											className={`absolute inset-0 blur-md transition-all duration-200 ${assetStyle.className} ${isDownloadKindDisplayed(assetStyle.key) ? '' : 'opacity-0'}`}
											size='lg'
										/>
										<FontAwesomeIcon
											icon={assetStyle.icon}
											className={`absolute inset-0 transition-all duration-75 ${assetStyle.className} ${isDownloadKindDisplayed(assetStyle.key) ? '' : 'scale-75 opacity-70'}`}
											size='lg'
										/>
									</div>
								</button>
							))}
						</div>
						{activeKindFilters.size > 0 && (
							<div className='grid grid-cols-4 gap-2'>
								{allAssetFormats
									.filter(
										(assetFormat) =>
											assetFormatKindsIndex[assetFormat] &&
											activeKindFilters.has(
												assetFormatKindsIndex[assetFormat],
											) &&
											allDownloads.some(
												(download) => download.format === assetFormat,
											),
									)
									.map((assetFormat) => (
										<button
											key={assetFormat}
											onClick={() => toggleFormatFilter(assetFormat)}
											className={`flex aspect-video w-full items-center justify-center rounded-md p-2 outline-none ring-primary-main transition-all duration-100 hover:bg-secondary-800 focus-visible:ring-2 active:bg-secondary-700`}>
											<div
												className={`rounded-md text-sm font-medium transition-all duration-75 ${isDownloadFormatDisplayed(assetFormat) ? '' : 'scale-75 opacity-70'}`}>
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
				<div
					id='asset-downloads-browser-view'
					className='grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3'>
					{allDownloads
						.filter((download) => isDownloadDisplayed(download.kind, download.format))
						.slice(0, maxDisplayedAssets)
						.map((download) => (
							<AssetDownloadCard
								key={`${download.kind}-${download.format}-${download.url}`}
								download={download}
								lang={lang}
								t={t}
							/>
						))}
				</div>
				{maxDisplayedAssets < filteredAssetsCount && (
					<div className='mt-6 flex flex-col justify-center sm:flex-row sm:space-x-2'>
						{maxDisplayedAssets + MAX_DISPLAYED_ASSETS_INCREASE <= trueMaximum && (
							<AssetDownloadsBrowserDisplayIncreaseButton
								id='asset-downloads-show-more'
								onClick={showMore}
								className='bg-primary-main duration-150 hover:bg-primary-700'>
								{t.detailDownloadsShowMore}
							</AssetDownloadsBrowserDisplayIncreaseButton>
						)}
						{maxDisplayedAssets < trueMaximum && (
							<AssetDownloadsBrowserDisplayIncreaseButton
								id='asset-downloads-show-all'
								onClick={showAll}
								className={
									maxDisplayedAssets + MAX_DISPLAYED_ASSETS_INCREASE <=
									trueMaximum
										? 'border border-secondary-800 bg-secondary-900 duration-100 hover:bg-secondary-800'
										: 'bg-primary-main duration-150 hover:bg-primary-700'
								}>
								{t.detailDownloadsShowAll}
							</AssetDownloadsBrowserDisplayIncreaseButton>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
