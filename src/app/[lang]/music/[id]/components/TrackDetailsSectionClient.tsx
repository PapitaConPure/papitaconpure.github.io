'use client';

import React, { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

function scrollToVideo() {
	const videoPreviewSection = document.getElementById('video-preview');
	const videoPreviewPlayer = document.getElementById('video-preview-player');

	setTimeout(() => videoPreviewPlayer?.focus(), 200);

	if (!videoPreviewSection) {
		scrollBy({ behavior: 'smooth', top: 560 });
		return;
	}

	scrollTo({
		behavior: 'smooth',
		top: videoPreviewSection.offsetTop - 104,
	});
}

function LeadDownwardsPanel({
	children,
	className='',
	...props
}: React.PropsWithChildren & ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			type='button'
			onClick={scrollToVideo}
			className={cn(
				'group mt-4 hidden items-center justify-center h-full md:flex flex-col outline-none',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

export default LeadDownwardsPanel;
