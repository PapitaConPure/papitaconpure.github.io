import items, { itemsById } from '@/data/music';
import BackSection from '@/components/BackSection';
import { Metadata, Viewport } from 'next';
import { getMessages, isValidLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Tr from '@/lib/i18n/Tr';
import {
	getLocalizedArtistNames,
	resolveLocalizableField,
} from '@/lib/music';
import TrackDetailsSection from './components/TrackDetailsSection';
import VideoPreviewSection from './components/VideoPreviewSection';
import DescriptionSection from './components/DescriptionSection';
import AssetDownloadsSection from './components/AssetDownloadsSection';
import ExtendedCreditsSection from './components/ExtendedCreditsSection';
import LicensingSection from './components/LicensingSection';
import TagsSection from './components/TagsSection';

interface MusicDetailProps {
	params: Promise<{
		id: string;
		lang: string;
	}>;
}

export const viewport: Viewport = {
	themeColor: '#c97f72',
};

export async function generateStaticParams() {
	return locales.flatMap((lang) =>
		items.map((item) => ({
			lang,
			id: item.id,
		})),
	);
}

export async function generateMetadata({ params }: MusicDetailProps): Promise<Metadata> {
	const { id = undefined, lang = undefined } = await params;
	const item = id ? itemsById[id] : undefined;

	if (!lang || !isValidLocale(lang)) return { title: 'Not Found' };

	const messages = await getMessages(lang);
	if (!messages) return { title: 'Not Found' };

	if (!item) return { title: messages.NotFound.notice };

	const bigImageUrl = item.thumbnailUrl || item.coverUrl;

	return {
		title: resolveLocalizableField(item.title, lang),
		description:
			resolveLocalizableField(item.description, lang) ||
			`${getLocalizedArtistNames(item, lang).join(' & ')}`,
		openGraph: {
			title: resolveLocalizableField(item.title, lang),
			description: resolveLocalizableField(item.description, lang),
			url: `https://papitaconpure.github.io/music/${item.id}`,
			images: [
				bigImageUrl.startsWith('http')
					? bigImageUrl
					: `https://papitaconpure.github.io/${bigImageUrl}`,
			],
			type: item.kind === 'single' ? 'music.song' : 'music.album',
			siteName: messages.General.metaSiteName,
		},
		twitter: {
			card: 'summary_large_image',
			title: resolveLocalizableField(item.title, lang),
			description:
				resolveLocalizableField(item.description, lang) ||
				'No description provided for this item.',
			creator:
				item.displayArtist ||
				item.artists
					.map((artist) =>
						typeof artist === 'string'
							? artist
							: resolveLocalizableField(artist.name, lang),
					)
					.join(' & '),
			site: 'https://papitaconpure.github.io',
			images: [
				bigImageUrl.startsWith('http')
					? bigImageUrl
					: `https://papitaconpure.github.io/${bigImageUrl}`,
			],
		},
	};
}

const MusicDetail = async ({ params }: MusicDetailProps) => {
	const { id = undefined, lang = undefined } = await params;
	const item = id ? itemsById[id] : undefined;

	if (!lang || !isValidLocale(lang)) return notFound();

	const messages = await getMessages(lang);
	if (!messages) return notFound();
	const t = messages.Music;

	if (item == undefined) {
		return (
			<main>
				<section>
					<div className='flex justify-center'>
						<div className='flex flex-col items-center space-y-8'>
							<div className='text-9xl'>🥔</div>
							<p>La ID de Música especificada no existe.</p>
						</div>
					</div>
				</section>
				<BackSection href={`/${lang}/music`}>
					<Tr
						t={t.backSectionButton}
						components={{ 1: <span className='font-semibold' /> }}
					/>
				</BackSection>
			</main>
		);
	}

	return (
		<main>
			<TrackDetailsSection item={item} lang={lang} t={t} />
			<VideoPreviewSection item={item} t={t} />
			<DescriptionSection item={item} lang={lang} t={t} />
			<AssetDownloadsSection item={item} lang={lang} t={t} />
			<ExtendedCreditsSection item={item} lang={lang} t={t} />
			<LicensingSection item={item} lang={lang} t={t} />
			<TagsSection item={item} t={t} />
			<BackSection href={`/${lang}/music`}>
				<Tr
					t={t.backSectionButton}
					components={{ 1: <span className='font-semibold' /> }}
				/>
			</BackSection>
		</main>
	);
};

export default MusicDetail;
