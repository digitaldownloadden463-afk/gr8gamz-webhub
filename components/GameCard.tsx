'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface GameCardProps {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  url: string;
  isNew?: boolean;
}

export default function GameCard({ id, title, category, imageUrl, url, isNew }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Link href={url} className="glass-card block overflow-hidden relative group">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-black/40">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101217]/90 via-transparent to-transparent opacity-80" />
          
          {isNew && (
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-3 left-3 px-3 py-1 bg-brand text-[#07110b] text-xs font-black uppercase tracking-wider rounded-md shadow-[0_0_15px_rgba(53,255,141,0.5)]"
            >
              New
            </motion.span>
          )}
        </div>
        
        <div className="p-5 relative z-10">
          <span className="text-cyan-400 text-xs font-black uppercase tracking-widest block mb-2 opacity-90">
            {category}
          </span>
          <h3 className="text-xl font-bold text-white leading-tight mb-1 group-hover:text-brand transition-colors duration-300">
            {title}
          </h3>
          
          <div className="mt-4 flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <span className="text-sm font-semibold text-white/80">Play Now</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-brand group-hover:border-brand/50 group-hover:text-black transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
