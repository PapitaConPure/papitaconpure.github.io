import type {
	assetMappings,
	audioAssetFormats,
	documentAssetFormats,
	imageAssetFormats,
	otherAssetFormats,
	videoAssetFormats,
} from '@/lib/music';
import type { LocalizableField } from './i18n';
import type { Digit, ElementsOf } from './utils';

export interface ExternalLink {
	source: 'youtube' | 'soundcloud' | 'spotify' | 'other';
	label: LocalizableField;
	url: string;
}

export type AudioAssetFormat = ElementsOf<typeof audioAssetFormats>;
export type ImageAssetFormat = ElementsOf<typeof imageAssetFormats>;
export type VideoAssetFormat = ElementsOf<typeof videoAssetFormats>;
export type DocumentAssetFormat = ElementsOf<typeof documentAssetFormats>;
export type OtherAssetFormat = ElementsOf<typeof otherAssetFormats> | '';

export type AssetFormat =
	| AudioAssetFormat
	| ImageAssetFormat
	| VideoAssetFormat
	| DocumentAssetFormat
	| OtherAssetFormat;

export type AssetKind = keyof typeof assetMappings;

export type AssetPreviewTheme = 'dark' | 'light';

interface AssetSpecificationTemplate<TKind extends AssetKind, TFormat extends AssetFormat> {
	kind: TKind;
	format: TFormat;
}

export type AssetSpecification =
	| AssetSpecificationTemplate<'audio', AudioAssetFormat>
	| AssetSpecificationTemplate<'image', ImageAssetFormat>
	| AssetSpecificationTemplate<'video', VideoAssetFormat>
	| AssetSpecificationTemplate<'document', DocumentAssetFormat>
	| AssetSpecificationTemplate<'file', OtherAssetFormat>;

export interface AssetPreviewData {
	previewUrl?: string;
	previewFormat?: AssetFormat;
	previewTheme?: AssetPreviewTheme;
}

type DownloadSizeMagnitude =
	| `${Digit}${Digit}${Digit}`
	| `${Digit}.${Digit}${Digit}`
	| `${Digit}${Digit}.${Digit}`;
type DownloadSizeUnit = `${'K' | 'M' | 'G' | ''}${'B' | 'b'}`;

export interface BaseDownloadData {
	url: string;
	size: `${DownloadSizeMagnitude} ${DownloadSizeUnit}` | '';
	label: LocalizableField;
}

interface ExternalDownloadData {
	external: true;
	direct?: boolean;
	provider?: string;
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

export interface ExtendedMusicItemLocalizationCredits {
	localization?: {
		[K: string]: CreditsField;
	};
}

export interface ExtendedMusicItemMiscellaneousCredits {
	misc?: {
		writing?: CreditsField;
		qa?: CreditsField;
	};
}

export interface ExtendedMusicItemCredits
	extends ExtendedMusicItemMusicCredits,
		ExtendedMusicItemVisualsCredits,
		ExtendedMusicItemLocalizationCredits,
		ExtendedMusicItemMiscellaneousCredits {}

export interface SingleMusicItem {
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

export interface AlbumMusicItem {
	kind: 'album' | 'ep';
	children: AnyChildMusicItem[];
};

export interface CompilationMusicItem {
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
