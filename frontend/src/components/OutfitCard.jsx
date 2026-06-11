import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiTag, FiAward, FiArrowRight } from 'react-icons/fi';

export default function OutfitCard({ outfit, index }) {
  if (!outfit) return null;

  const {
    top,
    bottom,
    footwear,
    accessories,
    why_it_works,
    estimated_cost,
    confidence_score
  } = outfit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glassmorphism border border-white/5 hover:border-gold-500/20 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:translate-y-[-4px]"
    >
      {/* Card Header */}
      <div className="bg-white/3 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <span className="text-sm font-extrabold text-gold-400 uppercase tracking-widest">
          Outfit Option #{index + 1}
        </span>
        <div className="flex items-center gap-1 bg-gold-400/10 border border-gold-500/20 text-gold-400 text-xs px-2.5 py-1 rounded-full font-bold">
          <FiAward className="text-xs" /> {confidence_score}% Match
        </div>
      </div>

      {/* Outfit Components List */}
      <div className="p-6 space-y-4 flex-1">
        <div className="grid grid-cols-1 gap-3">
          {/* Topwear */}
          <div className="flex items-start gap-2.5">
            <div className="bg-violet-500/10 text-violet-400 p-1.5 rounded text-xs font-extrabold uppercase mt-0.5 min-w-[70px] text-center border border-violet-500/10">
              Top
            </div>
            <p className="text-sm text-slate-200 font-semibold">{top}</p>
          </div>

          {/* Bottomwear */}
          <div className="flex items-start gap-2.5">
            <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded text-xs font-extrabold uppercase mt-0.5 min-w-[70px] text-center border border-emerald-500/10">
              Bottom
            </div>
            <p className="text-sm text-slate-200 font-semibold">{bottom}</p>
          </div>

          {/* Footwear */}
          <div className="flex items-start gap-2.5">
            <div className="bg-gold-500/10 text-gold-400 p-1.5 rounded text-xs font-extrabold uppercase mt-0.5 min-w-[70px] text-center border border-gold-500/10">
              Shoes
            </div>
            <p className="text-sm text-slate-200 font-semibold">{footwear}</p>
          </div>

          {/* Accessories */}
          <div className="flex items-start gap-2.5">
            <div className="bg-rose-500/10 text-rose-400 p-1.5 rounded text-xs font-extrabold uppercase mt-0.5 min-w-[70px] text-center border border-rose-500/10">
              Accs
            </div>
            <p className="text-sm text-slate-200 font-semibold">{accessories}</p>
          </div>
        </div>

        {/* Styling Logic description */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Styling Logic</h4>
          <p className="text-xs text-slate-400 leading-relaxed italic">
            "{why_it_works}"
          </p>
        </div>
      </div>

      {/* Card Footer Cost Panel */}
      <div className="bg-white/1 px-6 py-4 flex items-center justify-between border-t border-white/5 group-hover:bg-gold-500/5 transition-colors">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <FiTag className="text-gold-500" /> Estimated Cost
        </div>
        <span className="text-lg font-black text-slate-100">
          ₹{estimated_cost.toLocaleString('en-IN')}
        </span>
      </div>
    </motion.div>
  );
}
