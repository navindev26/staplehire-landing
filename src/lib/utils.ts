import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getCurrencySymbol(code?: string): string {
  switch (code) {
    case 'AUD': return 'A$';
    case 'INR': return '₹';
    case 'GBP': return '£';
    case 'EUR': return '€';
    case 'USD':
    default: return '$';
  }
}

function getCurrencyLocale(code: string): string {
  switch (code) {
    case 'INR': return 'en-IN';
    case 'GBP': return 'en-GB';
    case 'EUR': return 'de-DE';
    case 'AUD': return 'en-AU';
    case 'USD':
    default: return 'en-US';
  }
}

export function formatCurrencyNumber(value: number, currency?: string): string {
  const code = currency || 'USD';
  return new Intl.NumberFormat(getCurrencyLocale(code)).format(value);
}

export function formatSalaryRange(min: number, max: number, currency?: string): string {
  const code = currency || 'USD';
  const symbol = getCurrencySymbol(code);
  const fmt = (n: number) => formatCurrencyNumber(n, code);
  return `${symbol}${fmt(min)} \u2013 ${symbol}${fmt(max)} ${code}`;
}
