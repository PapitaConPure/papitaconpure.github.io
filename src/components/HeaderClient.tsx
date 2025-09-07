'use client';

import React, {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	ComponentProps,
	HTMLAttributes,
	MouseEventHandler,
	ReactElement,
	useId,
	useState,
} from 'react';
import Select from './Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { redirect, usePathname } from 'next/navigation';
import { faAngleDown, faLanguage, faListDots } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Link from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';

const toggleMenu = () => {
	const header = document.getElementById('header');
	const menu = document.getElementById('mobile-menu');

	if (!menu) return;

	menu.classList.toggle('!h-screen');

	const menuReveal = document.getElementById('menu-reveal');
	const menuCollapse = document.getElementById('menu-collapse');

	if (menuReveal) {
		const containsHidden = menuReveal.classList.contains('hidden');
		if (containsHidden) menuReveal.classList.remove('hidden');

		setTimeout(() => {
			menuReveal.classList.toggle('rotate-45');
			menuReveal.classList.toggle('opacity-0');

			if (!containsHidden) setTimeout(() => menuReveal.classList.toggle('hidden'), 150);
		}, 1);
	}

	if (menuCollapse) {
		const containsHidden = menuCollapse.classList.contains('hidden');
		if (containsHidden) menuCollapse.classList.remove('hidden');

		setTimeout(() => {
			menuCollapse.classList.toggle('-rotate-45');
			menuCollapse.classList.toggle('opacity-0');

			if (!containsHidden) setTimeout(() => menuCollapse.classList.toggle('hidden'), 150);
		}, 1);
	}

	if (header) {
		header.classList.toggle('backdrop-blur-md');
		header.classList.toggle('backdrop-blur-lg');
		header.classList.toggle('bg-opacity-60');
		header.classList.toggle('bg-opacity-80');
	}
};

export function HeaderNavButton(params: ComponentProps<'button'>) {
	return <button onClick={toggleMenu} {...params} />;
}

interface BaseMenuItemProps {
	icon?: IconProp;
	label: string;
	mobile?: boolean;
}

interface MenuItemProps extends BaseMenuItemProps, AnchorHTMLAttributes<HTMLAnchorElement> {}

export function MenuItem({
	icon,
	label,
	href,
	onClick: clickAction = undefined,
	mobile = false,
	...props
}: MenuItemProps) {
	if (!mobile) {
		return (
			<li role='menuitem' className='flex'>
				<Link
					href={href as Url}
					className='flex self-stretch rounded-md bg-secondary-400 bg-opacity-0 px-4 py-1 transition-all duration-75 hover:bg-opacity-20 hover:text-secondary-100'
					tabIndex={0}
					{...props}>
					{label}
				</Link>
			</li>
		);
	}

	const performLinkWithAction: MouseEventHandler<HTMLAnchorElement> = (e) => {
		toggleMenu();
		clickAction?.(e);
	};

	return (
		<li role='menuitem'>
			<Link
				href={href as Url}
				onClick={performLinkWithAction}
				className='block w-full select-none rounded-md bg-secondary-400 bg-opacity-0 px-5 py-5 text-secondary-100 transition-colors duration-75 hover:bg-opacity-10 hover:text-secondary-50 active:bg-opacity-20'
				tabIndex={0}
				{...props}>
				<FontAwesomeIcon icon={icon ?? faListDots} className='mr-3 w-6' />
				{label}
			</Link>
		</li>
	);
}

interface MobileMenuSubMenuProps
	extends BaseMenuItemProps,
		ButtonHTMLAttributes<HTMLButtonElement> {
	subMenu: ReactElement<HTMLAttributes<HTMLLIElement>, 'li'>[];
}

export function MobileMenuSubMenu({
	icon,
	label,
	subMenu,
	onClick: clickAction = undefined,
	...props
}: MobileMenuSubMenuProps) {
	const cid = useId();
	const [isOpen, setIsOpen] = useState(false);

	const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
		setIsOpen(!isOpen);
		clickAction?.(e);
	};

	const subMenuToggleId = `menu-subtoggle-${cid}`;
	const subMenuId = `menu-submenu-${cid}`;

	return (
		<li role='menuitem'>
			<button
				id={subMenuToggleId}
				aria-expanded={isOpen}
				aria-controls={subMenuId}
				onClick={handleButtonClick}
				className='block w-full select-none rounded-md bg-secondary-400 bg-opacity-0 px-5 py-5 text-left text-secondary-100 transition-colors duration-75 hover:bg-opacity-10 hover:text-secondary-50 active:bg-opacity-20'
				{...props}>
				<FontAwesomeIcon icon={icon ?? faListDots} className='mr-3 w-6' />
				{label}
				<FontAwesomeIcon
					icon={faAngleDown}
					size={'sm'}
					className={`ml-2 w-6 ${isOpen ? 'rotate-180 scale-[0.8] text-secondary-400' : 'rotate-0 text-secondary-300'} transition-transform duration-300 motion-reduce:scale-100 motion-reduce:transition-none`}
				/>
			</button>
			<div
				className={`relative ${isOpen ? 'my-1 max-h-48 scale-y-100 opacity-100' : 'max-h-0 scale-y-75 opacity-30'} flex items-stretch justify-start overflow-hidden px-5 transition-all duration-500 motion-reduce:transition-none`}>
				<div className='mr-1 w-1 rounded-sm bg-foreground opacity-10'></div>
				<ul
					role='menu'
					id={subMenuId}
					className={`${subMenu.length > 3 ? 'overflow-y-scroll' : ''} flex-grow pr-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-secondary-400 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-secondary-900 [&::-webkit-scrollbar]:w-1`}>
					{subMenu}
				</ul>
			</div>
		</li>
	);
}

interface HeaderLanguagePickerProps {
	mobile?: boolean;
	langPickerAria: string;
	label?: string;
}

export function HeaderLanguagePicker({ mobile, label, langPickerAria }: HeaderLanguagePickerProps) {
	const pathName = usePathname();

	const localeItems = [
		{ locale: 'es', label: 'Español', ariaLabel: 'Navegar en español' },
		{ locale: 'en', label: 'English', ariaLabel: 'Navigate in English' },
		{ locale: 'ja', label: '日本語', ariaLabel: '日本語で閲覧' },
	];

	if (mobile) {
		return (
			<MobileMenuSubMenu
				icon={faLanguage}
				label={label || ''}
				aria-label={langPickerAria}
				tabIndex={0}
				subMenu={localeItems.map((item, i) => (
					<MenuItem
						mobile
						key={i}
						href={`/${item.locale}${pathName.slice(3) || ''}`}
						label={item.label}
						aria-label={item.ariaLabel}
						tabIndex={0}
					/>
				))}
			/>
		);
	}

	return (
		<li role='menuitem'>
			<Select
				icon={<FontAwesomeIcon icon={faLanguage} size='lg' />}
				placeholder={label}
				options={localeItems.map(({ locale, label, ariaLabel }) => ({
					value: locale,
					label,
					ariaLabel,
				}))}
				action={(locale) => redirect(`/${locale}${pathName.slice(3) || ''}`)}
				className='hover:bg-secondary-800'
				aria-label={langPickerAria}
				noPickedDisplay
			/>
		</li>
	);
}
