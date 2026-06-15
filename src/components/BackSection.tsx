import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

interface BackSectionProps extends PropsWithChildren {
	href: Url;
}

const BackSection = ({ href, children }: BackSectionProps) => {
	return (
		<section className='flex items-center justify-center'>
			<Link
				href={href}
				tabIndex={0}
				className='group flex w-full cursor-pointer items-center rounded-md bg-foreground outline-none ring-0 ring-primary-main px-6 py-3 text-background transition-all duration-300 hover:pl-3 hover:pr-12 hover:opacity-80 focus-visible:pl-3 focus-visible:pr-12 focus-visible:opacity-80 focus-visible:ring-4 sm:w-3/4 md:w-96'
				aria-label='Volver a la lista de música'>
				<FontAwesomeIcon
					icon={faAngleLeft}
					size='1x'
					className='max-w-2 flex-shrink-0 cursor-pointer transition-all duration-700 group-hover:mr-4 group-hover:animate-pulse group-focus-visible:mr-4 group-focus-visible:animate-pulse'
				/>
				<div className='flex-grow cursor-pointer select-none text-center transition-all duration-300 group-hover:flex-grow-0 group-focus-visible:flex-grow-0'>
					{children}
				</div>
			</Link>
		</section>
	);
};

export default BackSection;
