import { Locale } from '@/lib/i18n';
import { SectionAcrossLocales } from '@/types/i18n';
import { CreditsField, MusicItem } from '@/types/music';
import React from 'react';
import { CreditedArtist } from './CreditedArtist';

interface CreditsFieldDescriptor {
	title: string;
	creditsField: CreditsField;
}

interface ExtendedCreditsCategoryProps {
	localizedCategoryTitle: string;
	creditsFieldDescriptors: CreditsFieldDescriptor[];
	lang: Locale;
}

function ExtendedCreditsCategory({
	localizedCategoryTitle,
	creditsFieldDescriptors,
	lang,
}: ExtendedCreditsCategoryProps) {
	return (
		<div>
			<h3 className='section-h3'>{localizedCategoryTitle}</h3>
			<div className='mt-4 grid grid-cols-1 gap-x-2 gap-y-5 lg:grid-cols-2'>
				{creditsFieldDescriptors.map(({ title, creditsField }, i, arr) => (
					<div
						key={i}
						className={
							arr.length % 2 !== 0 && i === arr.length - 1 ? 'lg:col-span-full' : ''
						}>
						<h4 className='section-h4 mb-2.5'>{title}</h4>
						<ul className='flex list-disc flex-col gap-y-2 break-all pl-6 text-secondary-100 sm:mx-auto sm:w-max sm:list-none sm:pl-0 md:w-full'>
							{creditsField.map((artist, index) => (
								<li key={index}>
									{<CreditedArtist artist={artist} lang={lang} />}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}

interface ExtendedCreditsSectionProps {
	item: MusicItem;
	lang: Locale;
	t: SectionAcrossLocales<'Music'>;
}

function ExtendedCreditsSection({ item, lang, t }: ExtendedCreditsSectionProps) {
	if (!item.credits || (!item.credits.music && !item.credits.visuals)) return;

	return (
		<section>
			<h2 className='section-h2'>{t.detailCreditsTitle}</h2>
			<div className='mt-4 grid grid-cols-1 gap-x-6 gap-y-8 rounded-md border border-secondary-800 px-4 pb-4 pt-3 text-left sm:grid-cols-2 sm:text-center lg:gap-x-8'>
				{item.credits.music && (
					<ExtendedCreditsCategory
						localizedCategoryTitle={t.detailCreditsMusic}
						creditsFieldDescriptors={
							[
								{
									title: t.detailCreditsMusicComposers,
									creditsField: item.credits.music.composers,
								},
								{
									title: t.detailCreditsMusicArrangers,
									creditsField: item.credits.music.arrangers,
								},
								{
									title: t.detailCreditsMusicMixers,
									creditsField: item.credits.music.mixers,
								},
							].filter(
								(cfd) => cfd.creditsField != undefined,
							) as CreditsFieldDescriptor[]
						}
						lang={lang}
					/>
				)}
				{item.credits.visuals && (
					<ExtendedCreditsCategory
						localizedCategoryTitle={t.detailCreditsVisuals}
						creditsFieldDescriptors={
							[
								{
									title: t.detailCreditsVisualsForeground,
									creditsField: item.credits.visuals.foreground,
								},
								{
									title: t.detailCreditsVisualsBackground,
									creditsField: item.credits.visuals.background,
								},
								{
									title: t.detailCreditsVisualsCover,
									creditsField: item.credits.visuals.cover,
								},
								{
									title: t.detailCreditsVisualsThumbnail,
									creditsField: item.credits.visuals.thumbnail,
								},
							].filter(
								(cfd) => cfd.creditsField != undefined,
							) as CreditsFieldDescriptor[]
						}
						lang={lang}
					/>
				)}
				{item.credits.localization && (
					<ExtendedCreditsCategory
						localizedCategoryTitle={t.detailCreditsLocalization}
						creditsFieldDescriptors={
							Object.getOwnPropertyNames(item.credits.localization).map(name => ({
								title: name,
								creditsField: item.credits?.localization?.[name],
							})).filter(
								(cfd) => cfd.creditsField != undefined,
							) as CreditsFieldDescriptor[]
						}
						lang={lang}
					/>
				)}
				{item.credits.misc && (
					<ExtendedCreditsCategory
						localizedCategoryTitle={t.detailCreditsMisc}
						creditsFieldDescriptors={
							[
								{
									title: t.detailCreditsMiscWriting,
									creditsField: item.credits.misc.writing,
								},
								{
									title: t.detailCreditsMiscQA,
									creditsField: item.credits.misc.qa,
								},
							].filter(
								(cfd) => cfd.creditsField != undefined,
							) as CreditsFieldDescriptor[]
						}
						lang={lang}
					/>
				)}
			</div>
		</section>
	);
}

export default ExtendedCreditsSection;
