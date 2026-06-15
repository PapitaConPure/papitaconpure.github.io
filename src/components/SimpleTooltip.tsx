import type React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface SimpleTooltipProps extends React.PropsWithChildren {
	content: string;
	className?: string;
	side?: 'left' | 'top' | 'bottom' | 'right';
}

function SimpleTooltip({ content, side = 'top', className = '', children }: SimpleTooltipProps) {
	return (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent
				side={side}
				className={cn(
					'text-base font-default-sans min-w-12 max-w-[50vw] border border-secondary-400/20 bg-background bg-opacity-10 px-3 py-2 shadow-none shadow-black outline-none ring-0 backdrop-blur-md transition-all sm:bottom-20 sm:right-4 md:bottom-20 md:right-8 md:inline-flex md:min-h-9 md:min-w-9 md:rounded-md',
					className,
				)}
			>
				{content}
			</TooltipContent>
		</Tooltip>
	);
}

export default SimpleTooltip;
