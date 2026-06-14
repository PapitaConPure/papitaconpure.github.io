'use client';

import { faAngleDown, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

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

function LeadDownwardsPanel() {
	return (
		<button
			type='button'
			onClick={scrollToVideo}
			className='group mt-4 hidden items-center justify-center h-full md:flex flex-col outline-none'
		>
			<FontAwesomeIcon
				icon={faCompactDisc}
				size='10x'
				className='block text-accent-300 opacity-15 group-hover:animate-spin group-focus-visible:animate-spin group-hover:text-accent-main group-focus-visible:text-accent-main group-hover:opacity-60 group-focus-visible:opacity-60 ease-out transition-all'
			/>
			<FontAwesomeIcon
				icon={faAngleDown}
				size='6x'
				className='block text-accent-main scale-y-0 h-0 -rotate-45 overflow-clip opacity-0 group-hover:rotate-0 group-focus-visible:rotate-0 group-hover:opacity-60 group-focus-visible:opacity-60 group-hover:scale-y-100 group-focus-visible:scale-y-100 group-hover:h-32 group-focus-visible:h-32 ease-out transition-all'
			/>
		</button>
	);
}

export default LeadDownwardsPanel;
