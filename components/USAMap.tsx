'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { fetchSenators, Senator } from '@/lib/data';
import { cn, getPartyColor } from '@/lib/utils';
import { AlertTriangle, Loader2 } from 'lucide-react';

// US Atlas TopoJSON - high quality state boundaries
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// State FIPS codes to abbreviations
const fipsToAbbr: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY', '72': 'PR',
};

// State names
const stateNames: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'Washington D.C.', 'PR': 'Puerto Rico',
};

// State center coordinates [longitude, latitude]
const stateCenters: Record<string, [number, number]> = {
  'AL': [-86.9, 32.8], 'AK': [-153.5, 64.2], 'AZ': [-111.4, 34.0], 'AR': [-92.2, 35.0], 'CA': [-119.4, 36.8],
  'CO': [-105.3, 39.1], 'CT': [-72.8, 41.6], 'DE': [-75.5, 39.0], 'FL': [-81.5, 27.8], 'GA': [-83.5, 32.9],
  'HI': [-155.5, 19.9], 'ID': [-114.5, 44.2], 'IL': [-89.4, 40.6], 'IN': [-86.1, 40.3], 'IA': [-93.2, 41.9],
  'KS': [-98.5, 38.5], 'KY': [-84.3, 37.8], 'LA': [-91.2, 30.5], 'ME': [-69.4, 45.3], 'MD': [-76.6, 39.0],
  'MA': [-71.5, 42.2], 'MI': [-84.5, 43.3], 'MN': [-94.6, 46.4], 'MS': [-89.4, 32.7], 'MO': [-91.8, 38.5],
  'MT': [-110.4, 46.9], 'NE': [-99.9, 41.5], 'NV': [-116.4, 38.8], 'NH': [-71.6, 43.2], 'NJ': [-74.4, 40.1],
  'NM': [-105.9, 34.5], 'NY': [-75.0, 43.0], 'NC': [-79.0, 35.8], 'ND': [-101.0, 47.5], 'OH': [-82.9, 40.4],
  'OK': [-97.5, 35.0], 'OR': [-120.5, 43.8], 'PA': [-77.2, 41.2], 'RI': [-71.5, 41.7], 'SC': [-81.2, 34.0],
  'SD': [-99.9, 43.9], 'TN': [-86.6, 35.5], 'TX': [-99.9, 31.0], 'UT': [-111.1, 39.3], 'VT': [-72.6, 44.0],
  'VA': [-78.2, 37.8], 'WA': [-120.7, 47.4], 'WV': [-80.5, 38.9], 'WI': [-89.6, 43.8], 'WY': [-107.3, 43.1],
  'DC': [-77.0, 38.9], 'PR': [-66.5, 18.2],
};

// Memoized Geography component for performance
const StateGeography = memo(function StateGeography({
  geo,
  stateAbbr,
  hasSenators,
  isHovered,
  onHover,
  onLeave,
}: {
  geo: any;
  stateAbbr: string;
  hasSenators: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <Geography
      geography={geo}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        default: {
          fill: hasSenators ? '#1e293b' : '#0f172a',
          stroke: '#334155',
          strokeWidth: 0.75,
          outline: 'none',
          transition: 'all 0.2s ease',
        },
        hover: {
          fill: '#334155',
          stroke: '#60a5fa',
          strokeWidth: 1.5,
          outline: 'none',
          cursor: 'pointer',
          filter: 'drop-shadow(0 0 8px rgba(96,165,250,0.4))',
        },
        pressed: {
          fill: '#475569',
          stroke: '#60a5fa',
          strokeWidth: 1.5,
          outline: 'none',
        },
      }}
    />
  );
});

export function USAMap() {
  const [senators, setSenators] = useState<Senator[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchSenators()
      .then((data) => {
        setSenators(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch senators:', error);
        setLoading(false);
      });
  }, []);

  // Group senators by state abbreviation
  const senatorsByState = useMemo(() => {
    const grouped: Record<string, Senator[]> = {};
    senators.forEach((senator) => {
      const abbr = senator.stateAbbr || Object.entries(stateNames).find(([, name]) =>
        name.toLowerCase() === senator.state.toLowerCase()
      )?.[0];
      if (abbr) {
        if (!grouped[abbr]) grouped[abbr] = [];
        grouped[abbr].push(senator);
      }
    });
    return grouped;
  }, [senators]);

  if (loading) {
    return (
      <div className="relative aspect-[16/9] bg-[#050508] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-[#6b6b7a]">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[#050508] rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Map container */}
      <div
        className="relative"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
      >
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{
            scale: 1000,
          }}
          style={{
            width: '100%',
            height: 'auto',
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const fips = geo.id;
                const stateAbbr = fipsToAbbr[fips] || '';
                const stateSenators = senatorsByState[stateAbbr] || [];
                const hasSenators = stateSenators.length > 0;
                const isHovered = hoveredState === stateAbbr;

                return (
                  <StateGeography
                    key={geo.rsmKey}
                    geo={geo}
                    stateAbbr={stateAbbr}
                    hasSenators={hasSenators}
                    isHovered={isHovered}
                    onHover={() => setHoveredState(stateAbbr)}
                    onLeave={() => setHoveredState(null)}
                  />
                );
              })
            }
          </Geographies>

          {/* Senator markers */}
          {Object.entries(senatorsByState).map(([abbr, stateSenators]) => {
            const coords = stateCenters[abbr];
            if (!coords || stateSenators.length === 0) return null;

            return stateSenators.map((senator, idx) => {
              const offsetX = stateSenators.length > 1 ? (idx === 0 ? -0.8 : 0.8) : 0;
              const offsetY = stateSenators.length > 1 ? (idx === 0 ? -0.3 : 0.3) : 0;
              const partyColor = getPartyColor(senator.party);

              return (
                <Link key={senator.id} href={`/politician/${senator.id}`}>
                  <Marker coordinates={[coords[0] + offsetX, coords[1] + offsetY]}>
                    <g className="cursor-pointer">
                      {/* Pulse animation */}
                      <circle
                        r="10"
                        fill={partyColor}
                        opacity="0.3"
                        className="animate-ping"
                        style={{ animationDuration: '2s', transformOrigin: 'center' }}
                      />
                      {/* Glow */}
                      <circle r="8" fill={`${partyColor}40`} />
                      {/* Main dot */}
                      <circle
                        r="5"
                        fill={partyColor}
                        stroke="white"
                        strokeWidth="1.5"
                        style={{
                          filter: `drop-shadow(0 0 4px ${partyColor})`,
                        }}
                      />
                      {/* Conflict indicator */}
                      {senator.conflicts && senator.conflicts.length > 0 && (
                        <circle
                          cx="4"
                          cy="-4"
                          r="3"
                          fill="#f59e0b"
                          stroke="#0a0a0f"
                          strokeWidth="0.8"
                          className="animate-pulse"
                        />
                      )}
                      {/* Invisible larger hit area */}
                      <circle r="12" fill="transparent" />
                    </g>
                  </Marker>
                </Link>
              );
            });
          })}
        </ComposableMap>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredState && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-50 pointer-events-none"
              style={{
                left: Math.min(Math.max(tooltipPos.x - 130, 10), 450),
                top: Math.max(tooltipPos.y - 160, 10),
              }}
            >
              <div className="bg-[#0a0a0f]/95 border border-white/[0.15] rounded-lg p-4 shadow-2xl min-w-[280px] backdrop-blur-xl">
                <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span>{stateNames[hoveredState] || hoveredState}</span>
                  <span className="text-xs text-[#6b6b7a] font-mono">({hoveredState})</span>
                </div>

                {senatorsByState[hoveredState] && senatorsByState[hoveredState].length > 0 ? (
                  <div className="space-y-3">
                    {senatorsByState[hoveredState].map((senator) => (
                      <Link
                        key={senator.id}
                        href={`/politician/${senator.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.05] transition-colors pointer-events-auto"
                      >
                        <div
                          className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#1a1a24]"
                          style={{
                            boxShadow: `0 0 0 2px ${getPartyColor(senator.party)}`,
                          }}
                        >
                          <Image
                            src={senator.photo}
                            alt={senator.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {senator.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#6b6b7a]">
                            <span
                              className={cn(
                                senator.party === 'R'
                                  ? 'text-red-400'
                                  : senator.party === 'D'
                                  ? 'text-blue-400'
                                  : 'text-purple-400'
                              )}
                            >
                              {senator.party === 'R' ? 'Republican' : senator.party === 'D' ? 'Democrat' : 'Independent'}
                            </span>
                            <span>•</span>
                            <span>{senator.stockTrades || 0} trades</span>
                          </div>
                        </div>
                        {senator.conflicts && senator.conflicts.length > 0 && (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#6b6b7a]">No senators on file</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59,130,246,0.1) 2px, rgba(59,130,246,0.1) 4px)',
          }}
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-[#6b6b7a]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Democrat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Republican</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Independent</span>
        </div>
      </div>
    </div>
  );
}
