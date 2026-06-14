'use client';

import { faAngleDown, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function scrollToVideo() {
	const videoPreview = document.getElementById('video-preview');

	videoPreview?.focus();

	if(!videoPreview) {
		scrollBy({ behavior: 'smooth', top: 560 });
		return;
	}

	scrollTo({
		behavior: 'smooth',
		top: videoPreview.offsetTop - 104,
	});
}

function LeadDownwardsPanel() {
	return (
		<button
			type='button'
			onClick={scrollToVideo}
			className='group mt-4 hidden items-center justify-center h-full md:flex flex-col'
		>
			<FontAwesomeIcon
				icon={faCompactDisc}
				size='10x'
				className='block text-accent-300 opacity-15 group-hover:animate-spin group-hover:text-accent-main group-hover:opacity-60 ease-out transition-all'
			/>
			<FontAwesomeIcon
				icon={faAngleDown}
				size='6x'
				className='block text-accent-main scale-y-0 h-0 -rotate-45 overflow-clip opacity-0 group-hover:rotate-0 group-hover:opacity-60 group-hover:scale-y-100 group-hover:h-32 ease-out transition-all'
			/>
		</button>
	);
}

export default LeadDownwardsPanel;
