import { resolveLocalizableField } from '@/lib/music';
import React from 'react';

import { Locale } from '@/lib/i18n';
import { MusicItem } from '@/types/music';
import { SectionAcrossLocales } from '@/types/i18n';

interface DescriptionSectionProps {
	lang: Locale;
	item: MusicItem;
	t: SectionAcrossLocales<'Music'>;
}

function DescriptionSection({ lang, item, t }: DescriptionSectionProps) {
	if (!item.description) return;

	return (
		<section>
			<h2 className='section-h2'>{t.detailDescriptionTitle}</h2>
			<p className='mt-2'>
				{resolveLocalizableField(item.description, lang)
					.split('\n')
					.map((line, index, arr) => (
						<span key={index}>
							{line}
							{index < arr.length - 1 && <br />}
						</span>
					))}
			</p>
		</section>
	);
}

export default DescriptionSection;
