'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SenatorPhotoProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  party?: 'R' | 'D' | 'I';
}

export function SenatorPhoto({ src, alt, size = 160, className, party }: SenatorPhotoProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fallback photo URLs to try
  const getFallbackUrl = (bioguideId: string) => {
    // Try multiple sources for photos
    const sources = [
      `https://www.congress.gov/img/member/${bioguideId}_200.jpg`,
      `https://bioguide.congress.gov/bioguide/photo/${bioguideId.charAt(0)}/${bioguideId}.jpg`,
      `https://theunitedstates.io/images/congress/225x275/${bioguideId}.jpg`,
    ];
    return sources;
  };

  const partyColors = {
    R: 'from-red-500 to-red-600',
    D: 'from-blue-500 to-blue-600',
    I: 'from-purple-500 to-purple-600',
  };

  if (error) {
    // Fallback to initials/icon
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br',
          party ? partyColors[party] : 'from-gray-600 to-gray-700',
          className
        )}
        style={{ width: size, height: size }}
      >
        <User className="w-1/2 h-1/2 text-white/80" />
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)} style={{ width: size, height: size }}>
      {loading && (
        <div className="absolute inset-0 bg-white/[0.04] animate-pulse flex items-center justify-center">
          <User className="w-1/3 h-1/3 text-[#3d3d4a]" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn(
          'object-cover transition-opacity duration-300',
          loading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        unoptimized
      />
    </div>
  );
}
