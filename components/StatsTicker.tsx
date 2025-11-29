'use client';

import { motion, useSpring, useTransform, useMotionValue, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { getTotalStats } from '@/lib/data';

function AnimatedNumber({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
    });

    return controls.stop;
  }, [value, duration, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });

    return unsubscribe;
  }, [springValue]);

  return <span ref={ref}>0</span>;
}

export function StatsTicker() {
  const stats = getTotalStats();

  const displayStats = [
    { label: 'Senators Tracked', value: stats.totalSenators, suffix: '' },
    { label: 'Stock Trades (2024)', value: stats.totalTrades, suffix: '' },
    { label: 'Active Conflicts', value: stats.totalConflicts, suffix: '' },
    { label: 'Avg Attendance', value: stats.avgAttendance, suffix: '%' },
  ];

  return (
    <div className="flex items-center justify-center gap-8 md:gap-12 py-6 border-y border-white/[0.04] bg-[#050508]/50">
      {displayStats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
          className="text-center"
        >
          <div className="text-2xl md:text-3xl font-bold font-mono text-white">
            <AnimatedNumber value={stat.value} />
            {stat.suffix}
          </div>
          <div className="text-[10px] md:text-xs text-[#6b6b7a] uppercase tracking-wider mt-1">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
