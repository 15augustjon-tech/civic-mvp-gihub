'use client';

import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
        <p className="text-[#6b6b7a] mb-6">
          There was a problem signing you in. Please try again.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg text-white font-medium transition-all"
          >
            Try Again
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="text-[#6b6b7a] hover:text-white transition-colors"
          >
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
