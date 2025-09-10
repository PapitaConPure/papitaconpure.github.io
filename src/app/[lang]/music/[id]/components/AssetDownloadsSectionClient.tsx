'use client';

import React, { AnchorHTMLAttributes, HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { AssetDownloadCard } from './AssetDownloadsSection';
import { MusicItem } from '@/types/music';
import { SectionComponentProps } from '@/types/i18n';
import { Locale } from '@/lib/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

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

const MAX_DISPLAYED_ASSETS_DEFAULT = 12;

const MAX_DISPLAYED_ASSETS_INCREASE = 12;

interface AssetDownloadsBrowserProps
	extends SectionComponentProps<'Music'>,
		HTMLAttributes<HTMLDivElement> {
	item: MusicItem;
	lang: Locale;
}

export function AssetDownloadsBrowser({ item, lang, t, ...props }: AssetDownloadsBrowserProps) {
	const [maxDisplayedAssets, setMaxDisplayedAssets] = useState(MAX_DISPLAYED_ASSETS_DEFAULT);

	const allDownloads = item.downloadUrls;
	const trueMaximum = allDownloads?.length || 0;

	const showMore = () => {
		setMaxDisplayedAssets((prev) =>
			Math.min(trueMaximum, prev + MAX_DISPLAYED_ASSETS_INCREASE),
		);
	};

	const showAll = () => {
		setMaxDisplayedAssets(trueMaximum);
	};

	useEffect(() => {
		setMaxDisplayedAssets(() => MAX_DISPLAYED_ASSETS_DEFAULT);
	}, []);

	if (!allDownloads || allDownloads.length <= 0) return;

	//TODO: Añadir filtros, ordenamiento y selector de vista de miniaturas/listado

	return (
		<div {...props}>
			<div
				id='asset-downloads-browser-view'
				className='grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3'>
				{allDownloads.slice(0, maxDisplayedAssets).map((download, index) => (
					<AssetDownloadCard key={index} download={download} lang={lang} t={t} />
				))}
			</div>
			{maxDisplayedAssets < allDownloads.length && (
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
								maxDisplayedAssets + MAX_DISPLAYED_ASSETS_INCREASE <= trueMaximum
									? 'border border-secondary-800 bg-secondary-900 duration-100 hover:bg-secondary-800'
									: 'bg-primary-main duration-150 hover:bg-primary-700'
							}>
							{t.detailDownloadsShowAll}
						</AssetDownloadsBrowserDisplayIncreaseButton>
					)}
				</div>
			)}
		</div>
	);
}
