import type React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface SimpleTooltipProps extends React.PropsWithChildren {
	content: string;
	className: string;
}

function SimpleTooltip({ content, children }: SimpleTooltipProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent className={cn()}>{content}</TooltipContent>
		</Tooltip>
	);
}

export default SimpleTooltip;
