'use client';

import { motion } from 'framer-motion';
import { Sparkles, UserRound } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <main className="page-shell flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Decorative background glows */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                <UserRound size={32} className="text-brand" />
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-center text-white mb-2">GR8 Passport</h1>
            <p className="text-center text-white/60 text-sm mb-8">Sign in to save your progress, earn XP, and join the global chatroom.</p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Username</label>
                <input 
                  type="text" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
                  placeholder="player1"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button className="w-full mt-6 bg-brand hover:bg-white text-black font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors duration-300 shadow-[0_0_20px_rgba(53,255,141,0.3)]">
                Access Granted
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/50 text-sm">
                Don't have a Passport? <Link href="#" className="text-brand font-bold hover:underline">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
