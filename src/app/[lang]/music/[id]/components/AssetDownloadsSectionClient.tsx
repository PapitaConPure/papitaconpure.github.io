'use client';

import React, { AnchorHTMLAttributes, HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { AssetDownloadCard } from './AssetDownloadsSection';
import { AssetKind, MusicItem } from '@/types/music';
import { SectionComponentProps } from '@/types/i18n';
import { Locale } from '@/lib/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { assetStylesArray } from '@/data/music';

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
	const [activeFilters, setActiveFilters] = useState(() => new Set<AssetKind>());
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

	const toggleFilter = (kind: AssetKind) => {
		setActiveFilters((prev) => {
			const newSet = new Set(prev);

			if (newSet.has(kind)) {
				newSet.delete(kind);
			} else {
				newSet.add(kind);
			}

			return newSet;
		});
	};

	const isDownloadKindDisplayed = (downloadKind: AssetKind) =>
		activeFilters.size === 0 || activeFilters.has(downloadKind);

	useEffect(() => {
		setMaxDisplayedAssets(() => MAX_DISPLAYED_ASSETS_DEFAULT);
	}, []);

	useEffect(() => {
		if (activeFilters.size === 0) setFilteredAssetsCount(trueMaximum);
		else
			setFilteredAssetsCount(
				() =>
					allDownloads?.filter((download) => activeFilters.has(download.kind))
						.length ?? 0,
			);
	}, [allDownloads, activeFilters, trueMaximum]);

	if (!allDownloads || allDownloads.length <= 0) return;

	//TODO: Añadir ordenamiento y selector de vista de miniaturas/listado

	return (
		<section>
			<div className='flex items-center justify-between md:justify-start md:space-x-4'>
				<h2 className='section-h2'>
					<span>{t.detailDownloadsTitle}</span>{' '}
					<span className='text-sm font-normal text-foreground/70'>
						(
						{maxDisplayedAssets < allDownloads.length && maxDisplayedAssets < filteredAssetsCount && `${maxDisplayedAssets} / `}
						{activeFilters.size > 0 && `${filteredAssetsCount} / `}
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
					<PopoverContent className='flex space-x-4 text-foreground'>
						{assetStylesArray.map((assetStyle) => (
							<button
								key={assetStyle.key}
								onClick={() => toggleFilter(assetStyle.key)}
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
					</PopoverContent>
				</Popover>
			</div>
			<div {...props}>
				<div
					id='asset-downloads-browser-view'
					className='grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3'>
					{allDownloads
						.filter((download) => isDownloadKindDisplayed(download.kind))
						.slice(0, maxDisplayedAssets)
						.map((download, index) => (
							<AssetDownloadCard key={index} download={download} lang={lang} t={t} />
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
