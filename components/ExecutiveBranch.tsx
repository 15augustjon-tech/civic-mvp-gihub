'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Crown, Building2, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CabinetMember {
  id: string;
  name: string;
  title: string;
  department: string;
  photo: string;
  since: string;
  netWorth?: string;
  conflicts?: string[];
  party: 'R' | 'D' | 'I';
}

// Trump Administration (2025)
const president: CabinetMember = {
  id: 'trump',
  name: 'Donald J. Trump',
  title: 'President of the United States',
  department: 'Executive Office',
  photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/440px-Donald_Trump_official_portrait.jpg',
  since: 'January 2025',
  netWorth: '$2.6B',
  conflicts: ['Extensive business holdings worldwide'],
  party: 'R',
};

const vicePresident: CabinetMember = {
  id: 'vance',
  name: 'JD Vance',
  title: 'Vice President',
  department: 'Executive Office',
  photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Senator_Vance_official_portrait%2C_118th_Congress.jpg/440px-Senator_Vance_official_portrait%2C_118th_Congress.jpg',
  since: 'January 2025',
  netWorth: '$10M',
  party: 'R',
};

const cabinetMembers: CabinetMember[] = [
  {
    id: 'rubio',
    name: 'Marco Rubio',
    title: 'Secretary of State',
    department: 'State Department',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Senator_Rubio_official_portrait%2C_118th_Congress.jpg/440px-Senator_Rubio_official_portrait%2C_118th_Congress.jpg',
    since: 'January 2025',
    netWorth: '$500K',
    party: 'R',
  },
  {
    id: 'bessent',
    name: 'Scott Bessent',
    title: 'Secretary of the Treasury',
    department: 'Treasury Department',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Scott_Bessent_%28cropped%29.jpg/440px-Scott_Bessent_%28cropped%29.jpg',
    since: 'January 2025',
    netWorth: '$700M',
    conflicts: ['Former hedge fund manager', 'Key Square Group founder'],
    party: 'R',
  },
  {
    id: 'hegseth',
    name: 'Pete Hegseth',
    title: 'Secretary of Defense',
    department: 'Department of Defense',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Pete_Hegseth.jpg/440px-Pete_Hegseth.jpg',
    since: 'January 2025',
    netWorth: '$4M',
    conflicts: ['Former Fox News host'],
    party: 'R',
  },
  {
    id: 'bondi',
    name: 'Pam Bondi',
    title: 'Attorney General',
    department: 'Department of Justice',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Pam_Bondi_official_photo.jpg/440px-Pam_Bondi_official_photo.jpg',
    since: 'January 2025',
    netWorth: '$3M',
    party: 'R',
  },
  {
    id: 'kennedy',
    name: 'Robert F. Kennedy Jr.',
    title: 'Secretary of HHS',
    department: 'Health & Human Services',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Robert_F._Kennedy_Jr._%2853106730648%29_%28cropped%29.jpg/440px-Robert_F._Kennedy_Jr._%2853106730648%29_%28cropped%29.jpg',
    since: 'January 2025',
    netWorth: '$15M',
    conflicts: ['Vaccine skepticism', 'Environmental lawyer'],
    party: 'R',
  },
  {
    id: 'duffy',
    name: 'Sean Duffy',
    title: 'Secretary of Transportation',
    department: 'Department of Transportation',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Sean_Duffy%2C_Official_Portrait%2C_116th_Congress.jpg/440px-Sean_Duffy%2C_Official_Portrait%2C_116th_Congress.jpg',
    since: 'January 2025',
    netWorth: '$1M',
    party: 'R',
  },
  {
    id: 'lutnick',
    name: 'Howard Lutnick',
    title: 'Secretary of Commerce',
    department: 'Department of Commerce',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Howard_Lutnick_2017.jpg/440px-Howard_Lutnick_2017.jpg',
    since: 'January 2025',
    netWorth: '$1.5B',
    conflicts: ['Cantor Fitzgerald CEO', 'Financial industry ties'],
    party: 'R',
  },
  {
    id: 'rollins',
    name: 'Brooke Rollins',
    title: 'Secretary of Agriculture',
    department: 'Department of Agriculture',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Brooke_Rollins_official_photo.jpg/440px-Brooke_Rollins_official_photo.jpg',
    since: 'January 2025',
    netWorth: '$2M',
    party: 'R',
  },
];

export function ExecutiveBranch() {
  const membersWithConflicts = cabinetMembers.filter(m => m.conflicts && m.conflicts.length > 0);

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Crown className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Executive Branch</h3>
            <p className="text-xs text-[#6b6b7a]">Trump Administration 2025</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
          <Users className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400 font-medium">{cabinetMembers.length + 2} Officials</span>
        </div>
      </div>

      {/* President & VP Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ExecutiveCard member={president} isPresident />
        <ExecutiveCard member={vicePresident} isVP />
      </div>

      {/* Cabinet Grid */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-[#6b6b7a]" />
          <span className="text-sm text-[#6b6b7a]">Cabinet Members</span>
          {membersWithConflicts.length > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs">
              {membersWithConflicts.length} with potential conflicts
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cabinetMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <CabinetCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.03) 2px, rgba(239,68,68,0.03) 4px)',
          }}
        />
      </div>
    </div>
  );
}

function ExecutiveCard({ member, isPresident = false, isVP = false }: { member: CabinetMember; isPresident?: boolean; isVP?: boolean }) {
  const hasConflicts = member.conflicts && member.conflicts.length > 0;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl p-5 transition-all duration-300',
        'bg-gradient-to-br border',
        isPresident
          ? 'from-red-500/10 to-amber-500/10 border-red-500/20 hover:border-red-500/40'
          : 'from-blue-500/10 to-red-500/10 border-blue-500/20 hover:border-blue-500/40'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Photo */}
        <div
          className={cn(
            'w-20 h-20 rounded-xl overflow-hidden shrink-0',
            isPresident ? 'ring-2 ring-red-500/50' : 'ring-2 ring-blue-500/50'
          )}
        >
          <Image
            src={member.photo}
            alt={member.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isPresident && <Crown className="w-4 h-4 text-yellow-500" />}
            <h4 className="text-lg font-semibold text-white truncate">{member.name}</h4>
            {hasConflicts && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          </div>
          <p className={cn(
            'text-sm font-medium mb-1',
            isPresident ? 'text-red-400' : 'text-blue-400'
          )}>
            {member.title}
          </p>
          <p className="text-xs text-[#6b6b7a]">Since {member.since}</p>
          {member.netWorth && (
            <p className="text-xs text-[#6b6b7a] mt-1">
              Est. Net Worth: <span className="text-white font-mono">{member.netWorth}</span>
            </p>
          )}
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function CabinetCard({ member }: { member: CabinetMember }) {
  const hasConflicts = member.conflicts && member.conflicts.length > 0;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg p-3 transition-all duration-300',
        'bg-white/[0.02] border hover:translate-y-[-2px]',
        hasConflicts
          ? 'border-amber-500/20 hover:border-amber-500/40'
          : 'border-white/[0.04] hover:border-red-500/30'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Photo */}
        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/10">
          <Image
            src={member.photo}
            alt={member.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h5 className="text-sm font-medium text-white truncate">{member.name.split(' ').pop()}</h5>
            {hasConflicts && <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />}
          </div>
          <p className="text-[10px] text-[#6b6b7a] truncate">{member.title}</p>
        </div>
      </div>

      {/* Conflict tooltip on hover */}
      {hasConflicts && (
        <div className="mt-2 p-2 rounded bg-amber-500/5 border border-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-[10px] text-amber-300/80 line-clamp-2">{member.conflicts![0]}</p>
        </div>
      )}
    </div>
  );
}
