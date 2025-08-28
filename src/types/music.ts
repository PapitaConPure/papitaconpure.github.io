import { LocalizableField } from './i18n';

export interface ExternalLink {
	source: 'youtube' | 'soundcloud' | 'spotify' | 'other';
	label: LocalizableField;
	url: string;
}

export type AudioAssetFormat = 'mp3' | 'flac' | 'wav' | 'other';
export type ImageAssetFormat = 'jpg' | 'png' | 'gif' | 'webp' | 'other';
export type VideoAssetFormat = 'mp4' | 'mov' | 'webm' | 'other';
export type OtherAssetFormat = 'zip' | 'rar' | 'midi' | 'pdf' | 'mscz' | 'other';

export type AssetFormat = AudioAssetFormat | ImageAssetFormat | VideoAssetFormat | OtherAssetFormat;

export type AssetKind = 'audio' | 'image' | 'video' | 'file';

interface AssetSpecificationTemplate<TKind extends AssetKind, TFormat extends AssetFormat> {
	kind: TKind;
	format: TFormat;
}

export type AssetSpecification =
	| AssetSpecificationTemplate<'audio', AudioAssetFormat>
	| AssetSpecificationTemplate<'image', ImageAssetFormat>
	| AssetSpecificationTemplate<'video', VideoAssetFormat>
	| AssetSpecificationTemplate<'file', OtherAssetFormat>;

export interface AssetPreviewData {
	previewUrl?: string;
	previewFormat?: AssetFormat;
}

export interface BaseDownloadData {
	url: string;
	size: `${number} ${'K' | 'M' | 'G' | ''}${'B' | 'b'}` | '';
	label: LocalizableField;
}

interface ExternalDownloadData {
	external: true;
	direct?: boolean;
}

export interface InternalDownloadData {
	external?: false;
}

export type AnyDownloadData = ExternalDownloadData | InternalDownloadData;

export type DownloadData = BaseDownloadData & AnyDownloadData;

export type DownloadUrl = AssetSpecification & AssetPreviewData & DownloadData;

export type CategoryKey = 'original' | 'arrangement' | 'collab' | 'touhou' | 'piano' | 'medley';

export interface FullArtistCredit {
	name: LocalizableField;
	clarification?: LocalizableField;
	url?: string;
}

export type ArtistCreditResolvable = string | FullArtistCredit;

export type CreditsField = ArtistCreditResolvable[];

export interface BaseMusicItem {
	id: string;
	artists: CreditsField;
	title: LocalizableField;
	date: Date;
	categories: CategoryKey[];
	coverUrl: string;
	thumbnailUrl: string;
}

export interface License {
	label: string;
	url?: string;
}

export interface ExtendedLicenseTargetCreator {
	name: string;
	url?: string;
}

export type LicenseTargetCreator = string | ExtendedLicenseTargetCreator;

export interface LicenseTarget {
	kind: AssetKind;
	work: string;
	year: number;
	creators: LicenseTargetCreator[];
	workUrl?: string;
	creatorUrl?: string;
}

export interface LicenseSpecification {
	license: License;
	targets?: LicenseTarget[];
}

export interface ExtendedMusicItemMetadata {
	description?: LocalizableField;
	displayArtist?: string;
	videoUrl?: string;
	credits?: ExtendedMusicItemCredits;
	licensing?: string | LicenseSpecification[];
	externalLinks?: ExternalLink[];
	downloadUrls?: DownloadUrl[];
	tags?: string[];
}

export interface MusicItemWithMetadata extends BaseMusicItem, ExtendedMusicItemMetadata {}

export interface ExtendedMusicItemMusicCredits {
	music?: {
		composers?: CreditsField;
		arrangers?: CreditsField;
		mixers?: CreditsField;
	};
}

export interface ExtendedMusicItemVisualsCredits {
	visuals?: {
		background?: CreditsField;
		foreground?: CreditsField;
		thumbnail?: CreditsField;
		cover?: CreditsField;
	};
}

export interface ExtendedMusicItemCredits
	extends ExtendedMusicItemMusicCredits,
		ExtendedMusicItemVisualsCredits {}

export type SingleMusicItem = {
	kind: 'single';
	parentId?: string;
};

export interface ChildMusicItemData<TKind extends string, TData> {
	kind: TKind;
	data: TData;
}

export type AnyChildMusicItem =
	| ChildMusicItemData<'id', string>
	| ChildMusicItemData<'name', LocalizableField>;

export type AlbumMusicItem = {
	kind: 'album' | 'ep';
	children: AnyChildMusicItem[];
};

export type CompilationMusicItem = {
	kind: 'compilation';
	parentId?: string;
	childrenTitles: LocalizableField[];
};

export type AnyMusicItem = SingleMusicItem | AlbumMusicItem | CompilationMusicItem;

export type MusicItem = MusicItemWithMetadata & AnyMusicItem;

export interface MusicItemSummary {
	id: string;
	artists: LocalizableField | CreditsField;
	title: LocalizableField;
	date: Date;
	categories: CategoryKey[];
	thumbnailUrl: string;
}
