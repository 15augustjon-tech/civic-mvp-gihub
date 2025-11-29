import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPartyColor(party: 'R' | 'D' | 'I'): string {
  switch (party) {
    case 'R': return '#ef4444';
    case 'D': return '#3b82f6';
    case 'I': return '#a855f7';
  }
}

export function getPartyBgClass(party: 'R' | 'D' | 'I'): string {
  switch (party) {
    case 'R': return 'bg-red-500/10 border-red-500/20 text-red-400';
    case 'D': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    case 'I': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
  }
}

export function getPartyName(party: 'R' | 'D' | 'I'): string {
  switch (party) {
    case 'R': return 'Republican';
    case 'D': return 'Democrat';
    case 'I': return 'Independent';
  }
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getDaysAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 60) return '1 month ago';
  return `${Math.floor(diffDays / 30)} months ago`;
}
