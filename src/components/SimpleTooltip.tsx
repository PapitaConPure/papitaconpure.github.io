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
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent
				side={side}
				className={cn(
					'min-h-12 min-w-12 border border-secondary-800 border-opacity-60 bg-background bg-opacity-10 p-2 shadow-none shadow-black outline-none ring-0 backdrop-blur-md transition-all sm:bottom-20 sm:right-4 md:bottom-20 md:right-8 md:inline-flex md:min-h-9 md:min-w-9 md:rounded-md',
					className,
				)}
			>
				{content}
			</TooltipContent>
		</Tooltip>
	);
}

export default SimpleTooltip;
