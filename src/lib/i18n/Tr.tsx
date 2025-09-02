import {
	cloneElement,
	ElementType,
	isValidElement,
	ReactElement,
	ReactNode,
} from 'react';

interface TrProps {
	t: string;
	values?: Record<string, string>;
	components?: Record<string, ReactElement | ElementType>;
}

const tagRegex = /<(\d+)>(.*?)<\/\1>/g;

export function trStr(t: string, values: Record<string, string> = {}) {
	return t.replace(/\{\{(.*?)\}\}/g, (_, key) => values[key] ?? '');
}

function Tr({ t = '', values = {}, components = {} }: TrProps) {
	const template = trStr(t, values);
	const parts: ReactNode[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null = null;

	while ((match = tagRegex.exec(template))) {
		const [fullMatch, tagId, content] = match;

		if (match.index > lastIndex) {
			parts.push(template.slice(lastIndex, match.index));
		}

		const element = components[tagId];
		if (isValidElement(element)) {
			parts.push(cloneElement(element, { key: tagId }, content));
		} else if (typeof element === 'string' || typeof element === 'function') {
			const Tag = element as ElementType;
			parts.push(<Tag key={tagId + content}>{content}</Tag>);
		} else {
			parts.push(content);
		}

		lastIndex = match.index + fullMatch.length;
	}

	if (lastIndex < template.length) {
		parts.push(template.slice(lastIndex));
	}

	return parts;
}

export default Tr;
