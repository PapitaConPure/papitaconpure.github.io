import clsx from 'clsx';
import { ClassValue } from 'class-variance-authority/types';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function linearToExponential(linear: number): number {
	return Math.pow(10, (linear - 1) * 2);
}

export function exponentialToLinear(audioVol: number): number {
	return Math.log10(audioVol) / 2 + 1;
}

export function clamp(value: number, min: number, max: number): number {
	if (min > max) [min, max] = [max, min];
	return Math.min(Math.max(min, value), max);
}
