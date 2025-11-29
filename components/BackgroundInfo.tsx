'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, ChevronRight } from 'lucide-react';

interface BackgroundInfoProps {
  education?: string[];
  previousCareer?: string[];
}

export function BackgroundInfo({ education, previousCareer }: BackgroundInfoProps) {
  const hasEducation = education && education.length > 0;
  const hasCareer = previousCareer && previousCareer.length > 0;

  if (!hasEducation && !hasCareer) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
          <GraduationCap className="w-6 h-6 text-blue-400" />
        </div>
        <p className="text-sm text-[#6b6b7a]">Background data coming soon</p>
        <p className="text-xs text-[#3d3d4a] mt-1">Education & career history not yet available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Education */}
      {hasEducation && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Education</span>
          </div>
          <div className="space-y-2">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10"
              >
                <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-[#a0a0aa]">{edu}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Previous Career */}
      {hasCareer && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Previous Career</span>
          </div>
          <div className="relative pl-4 border-l-2 border-purple-500/30 space-y-3">
            {previousCareer.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[21px] top-2 w-3 h-3 rounded-full bg-purple-500/30 border-2 border-[#0a0a0f]">
                  <div className="w-1 h-1 rounded-full bg-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                  <span className="text-sm text-[#a0a0aa]">{job}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
