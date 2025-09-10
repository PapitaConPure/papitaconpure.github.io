import { SectionAcrossLocales } from '@/types/i18n';
import { MusicItem } from '@/types/music';
import React from 'react';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
	name: string;
}

function Tag({ name, ...props }: TagProps) {
	return (
		<span
			{...props}
			className='my-2 rounded-md border border-secondary-700 bg-secondary-800 px-3 py-1 text-sm text-secondary-300'>
			{name.toUpperCase()}
		</span>
	);
}

interface TagsSectionProps {
	item: MusicItem;
	t: SectionAcrossLocales<'Music'>;
}

function TagsSection({ item, t }: TagsSectionProps) {
	if (!item.tags || item.tags.length === 0) return;

	return (
		<section>
			<h2 className='section-h2'>{t.detailTagsTitle}</h2>
			<div className='mt-2 flex flex-wrap space-x-2'>
				{item.tags.map((tag, index) => (
					<Tag key={index} name={tag} />
				))}
			</div>
		</section>
	);
}

export default TagsSection;
