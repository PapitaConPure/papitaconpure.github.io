import { YouTubeVideo } from '@/components/YouTubeVideo';
import { SectionAcrossLocales } from '@/types/i18n';
import { MusicItem } from '@/types/music';

interface VideoPreviewSectionProps {
	item: MusicItem;
	t: SectionAcrossLocales<'Music'>;
}

export default function VideoPreviewSection({ item, t }: VideoPreviewSectionProps) {
	if (!item.videoUrl) return;

	return (
		<section id='video-preview'>
			<h2 className='section-h2'>{t.detailVideoTitle}</h2>
			<div className='mt-4 w-full'>
				<YouTubeVideo
					title={`${t.detailVideoTitle} - ${item.title} (YouTube)`}
					src={item.videoUrl}
					thumbnailUrl={item.thumbnailUrl || undefined}
					className='aspect-video w-full overflow-hidden rounded-md object-cover'
				/>
			</div>
		</section>
	);
}
