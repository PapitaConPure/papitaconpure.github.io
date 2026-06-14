'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn('relative flex w-full touch-none select-none items-center', className)}
		{...props}>
		<SliderPrimitive.Track className='relative mx-auto h-full max-w-1.5 grow overflow-hidden rounded-full bg-secondary-700'>
			<SliderPrimitive.Range className='absolute h-full bg-primary-main' />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className='block h-4 w-4 rounded-full bg-accent-main shadow ring-primary-400 transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 md:h-2 md:rounded-sm' />
	</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
