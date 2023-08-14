import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatEther } from "viem"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEtherWithPrecison(eth: bigint, precision: number = 3) {
  const formattedEther = formatEther(eth);
  const dotPos = formattedEther.indexOf(".");
  return formattedEther.substring(0, dotPos + 1 + precision);
}
