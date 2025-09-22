import { defaultLocale, getMessages, isValidLocale, locales } from '@/lib/i18n';
import { faDiscord, faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import GFormsFeedback from './components/GFormsFeedback';

export const viewport: Viewport = {
	themeColor: '#c97f72',
};

interface ContactProps {
	params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ContactProps): Promise<Metadata> {
	const lang = params ? (await params)?.lang : defaultLocale;

	if (!lang || !isValidLocale(lang)) return { title: 'Not Found' };

	const messages = await getMessages(lang);
	if (!messages) return { title: 'Not Found' };
	const t = messages.Contact;

	return {
		title: t.title,
		description: t.subtitle,
		openGraph: {
			title: t.title,
			description: t.subtitle,
			images: ['https://papitaconpure.github.io/potato.webp'],
			type: 'website',
			siteName: messages.General.metaSiteName,
		},
		twitter: {
			card: 'summary_large_image',
			title: t.title,
			description: t.subtitle,
			creator: messages.General.papitaName,
			site: 'https://papitaconpure.github.io',
			images: ['https://papitaconpure.github.io/potato.webp'],
		},
	};
}

export async function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

const Contact = async ({ params }: ContactProps) => {
	const lang = (await params).lang;

	if (!isValidLocale(lang)) return notFound();

	const messages = await getMessages(lang);
	if (!messages) return notFound();
	const t = messages.Contact;

	return (
		<main>
			<section className='header'>
				<h1 className='title'>{t.title}</h1>
				<p className='subtitle'>{t.subtitle}</p>
			</section>

			<div className='flex flex-col md:flex-row md:items-stretch'>
				<div className='w-full md:w-1/2 md:pr-2'>
					<section>
						<div className='rounded-md border border-secondary-800 px-6 py-2'>
							<h3 className='section-h3 mb-1'>{t.businessCardTitle}</h3>
							<p className='font-sm'>{t.businessCard}</p>
							<p className='font-sm'>
								<a href='mailto:papitapurecontact@gmail.com' className='text-link'>
									papitapurecontact@gmail.com
								</a>
							</p>

							<div className='mt-4 grid w-full grid-cols-1 sm:w-max sm:grid-cols-2 sm:pr-0 md:grid-cols-4'>
								<a
									tabIndex={0}
									href='mailto:papitapurecontact@gmail.com'
									target='_blank'
									className='social-btn flex border-transparent bg-primary-main transition-colors hover:bg-primary-500 active:bg-primary-700 sm:w-64 md:w-36 md:px-4 lg:mx-1 lg:w-44'
									aria-label='Enviar correo a Papita con Puré'>
									<FontAwesomeIcon icon={faEnvelope} fontSize={24} />
									<span className='w-full text-center'>
										{t.businessCardMailCTA}
									</span>
								</a>
								<a
									tabIndex={0}
									href='https://github.com/PapitaConPure'
									target='_blank'
									className='social-btn flex border-transparent bg-[#1e2327] transition-colors duration-75 hover:bg-[#252c34] active:bg-[#292f38] sm:w-64 md:w-36 md:px-4 lg:mx-1 lg:w-44'
									aria-label='GitHub'>
									<FontAwesomeIcon icon={faGithub} fontSize={24} />
									<span className='w-full text-center'>GitHub</span>
								</a>
							</div>
						</div>
					</section>

					<section>
						<div className='rounded-md border border-secondary-800 px-6 py-2'>
							<h3 className='section-h3 mb-1'>{t.socialCardTitle}</h3>
							<p className='font-sm'>{t.socialCard}</p>
							<div className='mt-4 grid w-full grid-cols-1 sm:w-max sm:grid-cols-2 sm:pr-0 md:grid-cols-4'>
								<a
									tabIndex={0}
									href='https://discord.com/users/423129757954211880'
									target='_blank'
									className='social-btn flex border-transparent bg-[#5865f2] transition-colors duration-75 hover:bg-[#4752c4] active:bg-[#3c45a5] sm:w-64 md:w-36 md:px-4 lg:mx-1 lg:w-44'
									aria-label='Discord'>
									<FontAwesomeIcon icon={faDiscord} fontSize={24} />
									<span className='w-full text-center'>Discord</span>
								</a>

								<a
									tabIndex={0}
									href='https://x.com/PapitaPure'
									target='_blank'
									className='social-btn flex border-secondary-900 bg-black transition-colors duration-75 hover:bg-[#181919] active:bg-[#2e2f2f] sm:w-64 md:w-36 md:px-4 lg:mx-1 lg:w-44'
									aria-label='X (Twitter)'>
									<FontAwesomeIcon icon={faXTwitter} fontSize={24} />
									<span className='w-full text-center'>X (Twitter)</span>
								</a>
							</div>
						</div>
					</section>
				</div>
				<section className='w-full md:w-1/2 md:pl-2'>
					<div className='h-full min-h-[50vh] overflow-hidden rounded-md border border-secondary-800 md:min-h-96'>
						<GFormsFeedback t={t} />
					</div>
				</section>
			</div>
		</main>
	);
};

export default Contact;
