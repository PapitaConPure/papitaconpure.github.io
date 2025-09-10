import { getMessages, Locale } from '@/lib/i18n';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import BackToTopButtonClient from './BackToTopButtonClient';

interface BackToTopButtonProps {
	lang: Locale;
}

export default async function BackToTopButton({ lang }: BackToTopButtonProps) {
	const messages = await getMessages(lang);
	if (!messages) return <button />;
	const t = messages?.General;
	if (!t) return <button />;

	return (
		<BackToTopButtonClient
			className='group fixed bottom-16 right-2 z-50 flex min-h-12 min-w-12 cursor-pointer items-center justify-between rounded-full border border-secondary-800 border-opacity-60 bg-background bg-opacity-10 shadow-none shadow-black outline-none ring-0 ring-primary-main backdrop-blur-md transition-all after:absolute after:inset-0 hover:scale-110 hover:bg-opacity-20 hover:shadow-lg hover:after:-inset-1 focus:ring-2 active:scale-95 active:bg-opacity-30 active:after:-inset-6 sm:bottom-3.5 sm:right-4 md:bottom-6 md:right-8 md:inline-flex md:min-h-9 md:min-w-9 md:rounded-md'
			title={t.scrollToTopButton}
			aria-label={t.scrollToTopButton}>
			<div className='hidden w-0 scale-x-0 whitespace-nowrap p-0 text-center text-sm text-foreground/80 opacity-0 transition-all duration-200 group-hover:w-32 group-hover:scale-x-100 group-hover:pl-2 group-hover:opacity-100 md:block'>
				{t.scrollToTopButton}
			</div>
			<div className='my-auto p-2'>
				<FontAwesomeIcon
					icon={faArrowUp}
					className='block text-center text-2xl text-foreground md:text-base'
				/>
			</div>
		</BackToTopButtonClient>
	);
}
