import clsx from "clsx"
import { ClassValue } from "class-variance-authority/types"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
