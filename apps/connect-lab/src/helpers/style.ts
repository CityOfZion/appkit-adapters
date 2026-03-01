import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export class StyleHelper {
  static merge(...inputs: Array<ClassValue>) {
    return twMerge(clsx(inputs))
  }
}
