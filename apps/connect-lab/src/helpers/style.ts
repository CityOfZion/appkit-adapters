import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export class StyleHelper {
  static merge(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
}
