import AudioPreview from '@/components/AudioPreview';
import {
	DirectDownloadButton,
	AssetDownloadsBrowser,
} from '@/app/[lang]/music/[id]/components/AssetDownloadsSectionClient';
import VideoPreview from '@/components/VideoPreview';
import { assetStyles } from '@/data/music';
import getRoot from '@/lib/getroot';
import { Locale } from '@/lib/i18n';
import { trStr } from '@/lib/i18n/Tr';
import { resolveLocalizableField } from '@/lib/music';
import {
	SectionComponentProps,
	SectionAcrossLocales,
	LocalizedSectionComponentProps,
} from '@/types/i18n';
import { DownloadUrl, MusicItem } from '@/types/music';
import {
	faCheck,
	faClock,
	faDownload,
	faExternalLinkAlt,
	faEye,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React from 'react';

interface PropsWithDownload {
	download: DownloadUrl;
}

interface AssetDownloadCardThumbnailProps
	extends React.HTMLAttributes<HTMLDivElement>,
		PropsWithDownload {}

function AssetDownloadCardThumbnail({
	download,
	className = '',
	...props
}: Readonly<AssetDownloadCardThumbnailProps>) {
	return (
		<div
			className={`relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-secondary-900 ${className}`}
			{...props}>
			{download.kind === 'audio' && download.previewUrl && (
				<div className='absolute inset-0 opacity-50'>
					<Image
						src={getRoot(download.previewUrl)}
						alt='Preview'
						loading='lazy'
						fill
						className='absolute inset-0 rounded-md object-fill'
					/>
				</div>
			)}
			{download.kind === 'image' && (download.previewUrl || download.url) && (
				<div className='absolute inset-0 opacity-25'>
					<Image
						src={getRoot(download.url)}
						alt='Preview Backdrop'
						loading='lazy'
						fill
						className='absolute inset-0 rounded-md object-cover blur-md'
					/>
					<Image
						src={getRoot(download.url)}
						alt='Preview'
						loading='lazy'
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
							format={download.previewFormat || download.format}
							className='absolute inset-0 my-auto'
						/>
					) : (
						download.url && (
							<VideoPreview
								url={download.url}
								format={download.format}
								className='absolute inset-0 my-auto'
							/>
						)
					)}
				</div>
			)}
			<div className='absolute flex w-full flex-col items-center space-y-1'>
				<FontAwesomeIcon
					icon={assetStyles[download.kind].icon}
					className={`text-7xl sm:text-9xl md:text-8xl ${assetStyles[download.kind].className || ''}`}
				/>
				{download.format !== '' && (
					<div className='text-2xl font-bold sm:text-4xl md:text-3xl'>
						{download.format.toUpperCase()}
					</div>
				)}
			</div>
		</div>
	);
}

function AssetDownloadCardLabel({
	children,
	className = '',
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h2 className={`mb-4 flex-grow ${className}`} {...props}>
			{children}
		</h2>
	);
}

function AssetDownloadActionRow({
	children,
	className = '',
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={`flex w-full flex-shrink-0 space-x-2 ${className}`} {...props}>
			{children}
		</div>
	);
}

function UnavailableDownloadButton({ t }: SectionComponentProps<'Music'>) {
	return (
		<button
			aria-disabled
			className='flex flex-grow cursor-not-allowed items-center justify-center rounded-md bg-secondary-main px-5 py-4 text-secondary-200 transition-colors duration-100 hover:bg-secondary-700 sm:px-4 sm:py-3 md:py-2'
			title={t.detailDownloadsDownloadUnavailable}
			aria-label={t.detailDownloadsDownloadUnavailable}>
			<FontAwesomeIcon icon={faClock} className='cursor-not-allowed text-xl md:text-base' />
		</button>
	);
}

interface AssetDownloadCardProps extends React.HTMLAttributes<HTMLDivElement> {
	download: DownloadUrl;
	lang: Locale;
	t: SectionAcrossLocales<'Music'>;
}

export function AssetDownloadCard({
	download,
	lang,
	t,
	className = '',
	...props
}: Readonly<AssetDownloadCardProps>) {
	return (
		<div
			className={`relative flex flex-col items-center justify-start rounded-md border border-secondary-700 bg-secondary-800 p-4 transition-transform duration-500 md:hover:scale-105 md:hover:motion-reduce:scale-100 ${className}`}
			{...props}>
			<AssetDownloadCardThumbnail download={download} />
			<AssetDownloadCardLabel>
				<span>{resolveLocalizableField(download.label, lang)}</span>
				{download.external && download.provider && <span className='text-foreground/70 font-light text-sm'> ({download.provider})</span>}
			</AssetDownloadCardLabel>
			{download.kind === 'audio' && download.url && (
				<AudioPreview
					{...download}
					className='h-13 mb-2 w-full rounded-md bg-white sm:h-12 md:h-9'
				/>
			)}
			<AssetDownloadActionRow>
				{!download.url && <UnavailableDownloadButton t={t} />}
				{download.url && (
					<DirectDownloadButton
						href={getRoot(download.url)}
						aria-label={trStr(t.detailDownloadsDownloadAriaLabel, {
							assetlabel: resolveLocalizableField(download.label, lang),
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
						<FontAwesomeIcon icon={faEye} className='text-xl md:text-base' />
						{download.external && (
							<FontAwesomeIcon
								icon={faExternalLinkAlt}
								size='xs'
								className='mb-0.5 ml-2 cursor-pointer opacity-80'
							/>
						)}
					</a>
				)}
			</AssetDownloadActionRow>
		</div>
	);
}

interface AssetDownloadsSectionProps extends LocalizedSectionComponentProps<'Music'> {
	item: MusicItem;
}

export default function AssetDownloadsSection({
	item,
	lang,
	t,
}: Readonly<AssetDownloadsSectionProps>) {
	if (!item.downloadUrls || item.downloadUrls.length === 0) return;

	return <AssetDownloadsBrowser item={item} lang={lang} t={t} className='mt-4' />;
}
