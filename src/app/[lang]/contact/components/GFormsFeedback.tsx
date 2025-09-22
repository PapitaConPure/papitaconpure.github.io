'use client';

import { SectionAcrossLocales } from '@/types/i18n';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

interface GFormsFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
	t: SectionAcrossLocales<'Contact'>;
}

function GFormsFeedback({ t, className }: GFormsFeedbackProps) {
	const [loaded, setLoaded] = useState(false);

	if (!loaded) {
		return (
			<div className='h-full w-full p-4'>
				<button
					onClick={() => setLoaded(true)}
					className={`group h-full w-full overflow-hidden rounded-md bg-secondary-main transition-colors duration-100 hover:bg-secondary-700 active:bg-secondary-600 ${className}`}>
					<FontAwesomeIcon
						icon={faClipboardList}
						size='5x'
						className='mb-0 text-foreground/70 transition-all duration-100 group-hover:mb-2 group-hover:text-foreground/80 group-active:mb-0 group-active:scale-[6] group-active:text-foreground/0 group-active:duration-300'
					/>
					<div className='flex h-8 flex-col justify-end text-foreground/70 transition-all group-hover:text-foreground/80 group-active:h-0 group-active:scale-y-0 group-active:text-foreground/30'>
						{t.feedbackFormCTA}
					</div>
				</button>
			</div>
		);
	}

	return (
		<iframe
			className={`h-full min-h-[50vh] w-full md:min-h-96 ${className}`}
			src={t.feedbackFormUrl}></iframe>
	);
}

export default GFormsFeedback;
