'use client';

import getRoot from '@/lib/getroot';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useState } from 'react';

interface VideoMockProps extends React.HTMLAttributes<HTMLDivElement> {
	thumbnailUrl?: string;
}

function YouTubeVideoMock({ thumbnailUrl, className = '', ...props }: VideoMockProps) {
	return (
		<div
			tabIndex={0}
			className={`group relative cursor-pointer outline-none ring-0 ring-primary-main transition-all focus:ring-2 ${className}`}
			{...props}>
			{thumbnailUrl && (
				<div className='absolute h-full w-full rounded-md transition-opacity group-hover:opacity-80 group-active:opacity-60'>
					<Image
						src={getRoot(thumbnailUrl)}
						alt='Video thumbnail'
						className='h-full w-full select-none rounded-md object-cover'
						width={1280}
						height={720}
					/>
				</div>
			)}
			<div
				className={`absolute flex h-full w-full items-center justify-center rounded-md ${thumbnailUrl ? '' : 'border'} border-secondary-main`}>
				<div className='relative'>
					<div className='absolute ml-6 mt-4 h-8 w-8 bg-white' />
					<FontAwesomeIcon
						icon={faYoutube}
						size='4x'
						className='relative text-[#ff0033] transition-all group-hover:scale-105 group-hover:text-[#ff1142] group-hover:drop-shadow-lg group-active:scale-95 group-active:text-[#e2002d] group-active:drop-shadow-md'
					/>
				</div>
			</div>
		</div>
	);
}

interface VideoProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
	src: string;
	thumbnailUrl?: string;
}

export function YouTubeVideo({ src, thumbnailUrl, className = '', ...props }: VideoProps) {
	const [clicked, setClicked] = useState(false);
	const [loading, setLoading] = useState(true);

	const embedSrc = src.replace(
		'https://www.youtube.com/watch?v=',
		'https://www.youtube.com/embed/',
	);

	const beginLoading = () => {
		setClicked(true);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			beginLoading();
		}
	};

	if (!clicked) {
		return (
			<YouTubeVideoMock
				onClick={beginLoading}
				onKeyDown={handleKeyDown}
				thumbnailUrl={thumbnailUrl}
				className={className}
			/>
		);
	}

	const appendix = embedSrc.includes('?') ? '&' : '?';
	const finalSrc = `${embedSrc}${appendix}&fs=0&iv_load_policy=3&rel=0&showinfo=0&autoplay=1${process.env.NODE_ENV === 'production' ? '&origin=https://papitaconpure.github.io' : ''}`;

	return (
		<div className={`relative ${className}`}>
			{loading && thumbnailUrl && (
				<div className='absolute h-full w-full rounded-md'>
					<Image
						src={getRoot(thumbnailUrl)}
						alt='Video thumbnail'
						className='h-full w-full rounded-md object-cover'
						width={1280}
						height={720}
					/>
				</div>
			)}
			{loading && (
				<div
					className={`absolute flex h-full w-full animate-pulse items-center justify-center rounded-md ${thumbnailUrl ? '' : 'border'} border-secondary-main`}>
					<FontAwesomeIcon icon={faYoutube} size='4x' className='text-secondary-700' />
				</div>
			)}
			<iframe
				loading='lazy'
				className={`absolute inset-0 h-full w-full rounded-md transition-opacity duration-300 ${
					loading ? 'opacity-0' : 'opacity-100'
				}`}
				src={finalSrc}
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
				allowFullScreen
				onLoad={() => setLoading(false)}
				{...props}
			/>
		</div>
	);
}
