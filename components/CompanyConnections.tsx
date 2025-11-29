'use client';

import { motion } from 'framer-motion';
import { Link2, Building2, TrendingUp, Users } from 'lucide-react';
import { CompanyConnection } from '@/lib/data';
import { cn } from '@/lib/utils';

interface CompanyConnectionsProps {
  connections: CompanyConnection[];
}

export function CompanyConnections({ connections }: CompanyConnectionsProps) {
  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
          <span className="text-xl">✓</span>
        </div>
        <p className="text-sm text-[#6b6b7a]">No corporate connections on file</p>
      </div>
    );
  }

  const getRelationshipIcon = (relationship: string) => {
    if (relationship.toLowerCase().includes('stock')) return <TrendingUp className="w-4 h-4" />;
    if (relationship.toLowerCase().includes('donor')) return <Users className="w-4 h-4" />;
    if (relationship.toLowerCase().includes('family')) return <Link2 className="w-4 h-4" />;
    return <Building2 className="w-4 h-4" />;
  };

  const getRelationshipColor = (relationship: string) => {
    if (relationship.toLowerCase().includes('stock')) return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    if (relationship.toLowerCase().includes('donor')) return 'bg-green-500/10 border-green-500/20 text-green-400';
    if (relationship.toLowerCase().includes('family')) return 'bg-red-500/10 border-red-500/20 text-red-400';
    return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
  };

  return (
    <div className="space-y-3">
      {connections.map((connection, index) => (
        <motion.div
          key={connection.company}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-blue-500/30 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center border shrink-0', getRelationshipColor(connection.relationship))}>
              {getRelationshipIcon(connection.relationship)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-white">{connection.company}</h4>
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium border', getRelationshipColor(connection.relationship))}>
                  {connection.relationship}
                </span>
              </div>
              {connection.details && (
                <p className="text-xs text-[#6b6b7a]">{connection.details}</p>
              )}
            </div>
          </div>

          {/* Connection line visual */}
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6b6b7a]" />
            <div className="flex-1 h-px bg-gradient-to-r from-[#6b6b7a] to-transparent" />
            <div className="w-2 h-2 rounded-full bg-blue-500/50" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
