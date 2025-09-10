import { SectionAcrossLocales } from '@/types/i18n';
import { MusicItem } from '@/types/music';
import React from 'react';

interface TagsSectionProps {
    item: MusicItem;
    t: SectionAcrossLocales<'Music'>;
}

function TagsSection({ item, t }: TagsSectionProps) {
    if(!item.tags || item.tags.length === 0) return;

	return (
		<section>
			<h2 className='section-h2'>{t.detailTagsTitle}</h2>
			<div className='mt-2 flex flex-wrap space-x-2'>
				{item.tags.map((tag, index) => (
					<span
						key={index}
						className='my-2 rounded-md bg-secondary-800 px-3 py-1 text-sm text-secondary-300'>
						{tag.toUpperCase()}
					</span>
				))}
			</div>
		</section>
	);
}

export default TagsSection;
