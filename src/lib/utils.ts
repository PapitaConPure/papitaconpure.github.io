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

// Source - https://stackoverflow.com/a/8831937
// Posted by Barak, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-29, License - CC BY-SA 4.0

/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
export function simpleHash(str: string) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
