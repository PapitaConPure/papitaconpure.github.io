import type { Metadata } from 'next';
import { Outfit, M_PLUS_2, Vollkorn, Noto_Serif_JP } from 'next/font/google';
import { defaultLocale, isValidLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTopButton from '@/components/BackToTopButton';

const outfit = Outfit({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
});

const mPlus2 = M_PLUS_2({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
});

const vollkorn = Vollkorn({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
});

const notoSerifJp = Noto_Serif_JP({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Papita con Puré',
	description: 'Personal website for Papita con Puré',
};

interface Props {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: Readonly<Props>) {
	const lang = params ? (await params)?.lang : defaultLocale;

	if (!isValidLocale(lang)) return notFound();

	return (
		<html
			lang={lang}
			className={`${outfit.className} ${mPlus2.className} ${vollkorn.className} ${notoSerifJp.className}`}>
			<head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
			</head>
			<body className='w-full bg-background pt-[60px] font-default-sans text-foreground antialiased'>
				<div className='fixed left-0 top-0 -z-50 h-screen w-screen bg-gradient-to-b from-transparent to-accent-main/10 contrast-more:hidden' />
				<Header lang={lang} />
				{children}
				<Footer lang={lang} />
				<BackToTopButton lang={lang} />
			</body>
		</html>
	);
}
