'use client';

import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
	FocusEvent,
	HTMLAttributes,
	KeyboardEvent,
	ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react';

type OptionValue = string | number | readonly string[] | undefined;

interface SelectOption<TValues extends OptionValue> {
	label: string;
	value: TValues;
	ariaLabel?: string;
}

interface SelectExtraPreferences {
	placeholder?: string;
	noPickedDisplay?: boolean;
	icon?: ReactNode;
}

interface SelectProps<TValue extends OptionValue>
	extends HTMLAttributes<HTMLDivElement>,
		SelectExtraPreferences {
	options: SelectOption<TValue>[];
	value?: TValue;
	action?: (value: TValue) => void;
}

function Select<TValue extends OptionValue = undefined>({
	options,
	value = undefined,
	action = () => {},
	placeholder,
	noPickedDisplay = false,
	icon = undefined,
	className = '',
	'aria-label': ariaLabel,
	...props
}: SelectProps<TValue>) {
	const cid = useId();
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(value);
	const [activeIndex, setActiveIndex] = useState<number | null>(0);
	const searchBuffer = useRef('');
	const wrapperRef = useRef<HTMLDivElement>(null);
	const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (val: TValue) => {
		setSelected(val);
		action?.(val);
		setActiveIndex(-1);
		setIsOpen(false);
		buttonRef.current?.focus();
	};

	const handleBlur = (e: FocusEvent<HTMLDivElement, Element>) => {
		if (!wrapperRef.current?.contains(e.relatedTarget)) {
			setIsOpen(false);
		}
	};

	const openDropdown = () => {
		setIsOpen(true);
		setActiveIndex(null);
	};

	const handleButtonClick = () => {
		setIsOpen(!isOpen);
	};

	const handleButtonKeydown = (e: KeyboardEvent<HTMLButtonElement>) => {
		if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openDropdown();
		}
	};

	const handleListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
		if (!isOpen) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setActiveIndex((prev) => {
					const next = prev === null ? 0 : (prev + 1) % options.length;
					optionRefs.current[next]?.focus();
					return next;
				});
				break;

			case 'ArrowUp':
				e.preventDefault();
				setActiveIndex((prev) => {
					const next =
						prev === null
							? options.length - 1
							: (prev - 1 + options.length) % options.length;
					optionRefs.current[next]?.focus();
					return next;
				});
				break;
			case 'Escape':
				e.preventDefault();
				setIsOpen(false);
				break;

			case 'Enter':
			case ' ':
				e.preventDefault();
				if (activeIndex !== null && activeIndex >= 0) {
					const opt = options[activeIndex];
					handleSelect(opt.value);
				} else setActiveIndex(null);
				break;

			default:
				if (e.key.length === 1) {
					const prev = searchBuffer.current ?? '';
					const newBuffer = (searchBuffer.current = prev + e.key.toLowerCase());
					const foundIndex = options.findIndex((opt) =>
						opt.label.toLowerCase().startsWith(newBuffer),
					);

					if (foundIndex !== -1) {
						optionRefs.current[foundIndex]?.focus();
						setActiveIndex(foundIndex);
					}

					setTimeout(() => {
						searchBuffer.current = '';
					}, 500);
				}
				break;
		}
	};

	const selectedLabel = options.find((opt) => opt.value === selected)?.label;
	const selectLabelId = `select-label-${cid}`;
	const selectListId = `select-options-${cid}`;

	return (
		<div
			role='combobox'
			aria-label={ariaLabel}
			aria-expanded={isOpen}
			aria-haspopup='listbox'
			aria-controls={selectListId}
			aria-activedescendant={selected ? `option-${selected}` : undefined}
			ref={wrapperRef}
			className={`${className} relative inline-block w-fit rounded-md`}
			onBlur={handleBlur}
			{...props}>
			<button
				aria-label={ariaLabel}
				aria-labelledby={selectLabelId}
				onClick={handleButtonClick}
				className='inline-flex items-center justify-between space-x-2 rounded-md py-2 pl-4 pr-3.5 text-sm shadow-sm ring-0 ring-primary-main transition-all duration-150 focus:outline-none focus:ring-2'
				onKeyDown={handleButtonKeydown}>
				{icon}
				{noPickedDisplay ? (
					placeholder && <span className='opacity-50'>{placeholder}</span>
				) : (
					<span
						id={selectLabelId}
						className={selectedLabel ? '' : 'font-light opacity-50'}>
						{selectedLabel || placeholder || '...'}
					</span>
				)}
				<FontAwesomeIcon
					icon={faAngleDown}
					size='sm'
					className={`aspect-square text-secondary-300 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'} motion-reduce:transition-none`}
				/>
			</button>

			{isOpen && (
				<ul
					id={selectListId}
					role='listbox'
					ref={(el) => {
						if (el && isOpen && activeIndex === null) {
							const idx = options.findIndex((o) => o.value === selected);
							const initial = idx >= 0 ? idx : 0;
							setActiveIndex(initial);
							setTimeout(() => {
								optionRefs.current[initial]?.focus();
							}, 0);
						}
					}}
					onKeyDown={handleListKeyDown}
					className='absolute right-0 z-10 mt-1 max-h-60 min-w-20 overflow-auto rounded-md border border-secondary-800 bg-background'
					tabIndex={-1}>
					{options.map((option, i) => (
						<li
							key={i}
							id={`option-${option.value as NonNullable<TValue>}-${cid}`}
							role='option'
							aria-label={option.ariaLabel}
							aria-selected={selected === option.value}
							ref={(el) => {
								optionRefs.current[i] = el;
							}}
							onClick={() => handleSelect(option.value)}
							className='cursor-pointer px-4 py-2 hover:bg-secondary-900 focus:bg-secondary-800 focus:outline-none'
							tabIndex={activeIndex === i ? 0 : -1}>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default Select;
