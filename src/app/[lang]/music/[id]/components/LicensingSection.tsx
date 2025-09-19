import { assetStyles } from '@/data/music';
import { Locale } from '@/lib/i18n';
import { trStr } from '@/lib/i18n/Tr';
import { getLocalizedArtistNames, resolveLocalizableField } from '@/lib/music';
import { SectionAcrossLocales } from '@/types/i18n';
import { MusicItem } from '@/types/music';
import { faExternalLinkAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface LicensingSectionProps {
	item: MusicItem;
	lang: Locale;
	t: SectionAcrossLocales<'Music'>;
}

function LicensingSection({ item, lang, t }: LicensingSectionProps) {
	if (!item.licensing) return;

	return (
		<section>
			<h2 className='section-h2'>{t.detailLicensingTitle}</h2>
			{typeof item.licensing === 'string' ? (
				<p className='mt-2'>{item.licensing}</p>
			) : (
				<ul className='mt-4 flex flex-col space-y-4'>
					{item.licensing.map((licenseSpecification, i) => (
						<li
							key={i}
							className='rounded-md border border-secondary-700 bg-secondary-800 p-4'>
							<div className='flex'>
								<div className='flex min-h-10 flex-grow flex-col justify-center'>
									<h3 className='section-h3'>{licenseSpecification.license.label}</h3>
									<div className='mt-3 rounded-md bg-secondary-900 p-4'>
										<h4 className='font-semibold'>
											{t.detailLicensingLicenseWorksListName}
										</h4>
										{licenseSpecification.targets?.length ? (
											<ul className='mt-2 flex flex-col space-y-3'>
												{licenseSpecification.targets.map((target, j) => (
													<li
														key={j}
														className='flex items-center space-x-2 font-light leading-tight'>
														<FontAwesomeIcon
															icon={assetStyles[target.kind].icon}
															className={
																assetStyles[target.kind].className
															}
														/>
														<div>
															{target.workUrl ? (
																<a
																	href={target.workUrl}
																	className='text-link'>
																	{target.work}
																</a>
															) : (
																<i>{target.work}</i>
															)}{' '}
															© {target.year} by{' '}
															{target.creators.map((creator, k) =>
																typeof creator === 'string' ? (
																	<strong key={k}>{creator}</strong>
																) : creator.url ? (
																	<a
																		href={creator.url}
																		className='text-link'
																		key={k}>
																		{creator.name}
																	</a>
																) : (
																	<strong key={k}>
																		{creator.name}
																	</strong>
																),
															)}
															.
														</div>
													</li>
												))}
											</ul>
										) : (
											<p className='mt-1 font-light'>
												<i>{resolveLocalizableField(item.title, lang)}</i> ©{' '}
												{item.date.getUTCFullYear()} by{' '}
												<strong>
													{getLocalizedArtistNames(item, 'es').join(' & ')}
												</strong>
												.
											</p>
										)}
									</div>
									{licenseSpecification.license.url && (
										<Link
											href={licenseSpecification.license.url}
											aria-label={trStr(t.detailLicensingLicenseViewAriaLabel, {
												licensename: licenseSpecification.license.label,
											})}
											rel='noopener noreferrer'
											target='_blank'
											tabIndex={0}
											className='mt-4 flex flex-shrink-0 items-center justify-center rounded-md bg-secondary-700 px-5 py-4 text-white transition-colors duration-100 hover:bg-secondary-600 md:hidden'>
											<FontAwesomeIcon
												icon={faEye}
												className='mr-2 text-xl md:text-base'
											/>
											<span className='cursor-pointer select-none text-center'>
												{t.detailLicensingLicenseView}
											</span>
											<FontAwesomeIcon
												icon={faExternalLinkAlt}
												size='xs'
												className='mb-0.5 ml-2 cursor-pointer opacity-80'
											/>
										</Link>
									)}
								</div>
								{licenseSpecification.license.url && (
									<Link
										href={licenseSpecification.license.url}
										aria-label={trStr(t.detailLicensingLicenseViewAriaLabel, {
											licensename: licenseSpecification.license.label,
										})}
										rel='noopener noreferrer'
										target='_blank'
										tabIndex={0}
										className='ml-4 hidden flex-shrink-0 items-center justify-center rounded-md bg-secondary-700 px-4 py-3 text-white transition-colors duration-100 hover:bg-secondary-600 md:flex'>
										<FontAwesomeIcon
											icon={faEye}
											className='text-xl md:text-base'
										/>
										<FontAwesomeIcon
											icon={faExternalLinkAlt}
											size='xs'
											className='mb-0.5 ml-2 cursor-pointer opacity-80'
										/>
									</Link>
								)}
							</div>
							<div className='mt-2 font-light text-xs text-foreground/70'>
								For derivative works, this license only applies to the derivative contribution(s) and does not override the license of the original works, but rather coexists with it. Should any contradiction occur, the original takes precedence.
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

export default LicensingSection;
