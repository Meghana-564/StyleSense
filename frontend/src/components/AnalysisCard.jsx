import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiSettings, FiGrid, FiTrendingUp } from 'react-icons/fi';
import { GiBowTie } from 'react-icons/gi';

export default function AnalysisCard({ analysis }) {
  if (!analysis) return null;

  const {
    gender = 'N/A',
    detected_item = 'Unknown Item',
    category = 'N/A',
    colors = [],
    style = 'N/A',
    fashion_score = 0,
    strengths = [],
    improvements = [],
    styling_recommendations = {}
  } = analysis;

  const renderRecommendationList = (list) => {
    if (!list || !Array.isArray(list) || list.length === 0) {
      return <li className="text-slate-500 font-normal italic">No recommendations available</li>;
    }

    return list.map((item, i) => {
      const displayName = typeof item === 'object' ? (item.name || item.title || item.detected_item) : item;
      const itemUrl = item?.url || item?.link;

      return (
        <li key={item?.id || i} className="truncate">
          {itemUrl ? (
            <a
              href={itemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:underline transition-all font-semibold"
            >
              {displayName}
            </a>
          ) : (
            <span className="text-slate-200 font-semibold">{displayName}</span>
          )}
        </li>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto glassmorphism p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl space-y-8 mt-8"
    >
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-400 bg-gold-400/5 border border-gold-500/20 px-3 py-1 rounded-full">
            {gender}
          </span>
          <h2 className="text-2xl font-black text-slate-100 mt-2 tracking-tight">
            {detected_item}
          </h2>
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-400">
            <span className="bg-white/5 px-2.5 py-1 rounded-md">Category: <strong className="text-slate-200">{category}</strong></span>
            <span className="bg-white/5 px-2.5 py-1 rounded-md">Style: <strong className="text-slate-200">{style}</strong></span>
            <span className="bg-white/5 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              Colors:
              {colors.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-slate-200 font-semibold">
                  {c}
                </span>
              ))}
              {colors.length === 0 && <span className="text-slate-500 italic">None</span>}
            </span>
          </div>
        </div>

        {/* Fashion Score Radial */}
        <div className="flex items-center gap-4 bg-white/3 p-4 rounded-xl border border-white/5 self-stretch md:self-auto justify-center">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="28" className="stroke-white/5 fill-transparent" strokeWidth="4" />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-gold-500 fill-transparent transition-all duration-1000"
                strokeWidth="4"
                strokeDasharray="175"
                strokeDashoffset={175 - (175 * fashion_score) / 10}
              />
            </svg>
            <span className="text-xl font-black text-gold-400">{fashion_score}</span>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Fashion Score</h4>
            <span className="text-sm font-semibold text-slate-200">
              {fashion_score >= 8 ? 'Outstanding Style' : fashion_score >= 6 ? 'Good Harmony' : 'Needs Tweak'}
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-emerald-950/10 border border-emerald-500/10 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
            <FiCheckCircle className="text-base" /> Style Strengths
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1 shrink-0">•</span>
                <span>{str}</span>
              </li>
            ))}
            {strengths.length === 0 && <li>Highly balanced item coordinates.</li>}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-rose-950/10 border border-rose-500/10 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wider">
            <FiAlertCircle className="text-base" /> Styling Improvements
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 mt-1 shrink-0">•</span>
                <span>{imp}</span>
              </li>
            ))}
            {improvements.length === 0 && <li>No improvements needed, look is flawless!</li>}
          </ul>
        </div>
      </div>

      {/* Styling Recommendations */}
      <div className="border-t border-white/5 pt-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
          <GiBowTie className="text-lg text-gold-400" /> Styling Coordinations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex gap-3.5 items-start">
            <div className="bg-violet-500/10 p-2.5 rounded-lg text-violet-400 border border-violet-500/20">
              <FiGrid className="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Suggested Bottoms</h4>
              <ul className="text-sm mt-1 space-y-1">
                {renderRecommendationList(styling_recommendations.matching_bottoms)}
              </ul>
            </div>
          </div>

          <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex gap-3.5 items-start">
            <div className="bg-gold-500/10 p-2.5 rounded-lg text-gold-400 border border-gold-500/20">
              <FiTrendingUp className="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Suggested Footwear</h4>
              <ul className="text-sm mt-1 space-y-1">
                {renderRecommendationList(styling_recommendations.matching_footwear)}
              </ul>
            </div>
          </div>

          <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex gap-3.5 items-start">
            <div className="bg-rose-500/10 p-2.5 rounded-lg text-rose-400 border border-rose-500/20">
              <FiSettings className="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Suggested Accessories</h4>
              <ul className="text-sm mt-1 space-y-1">
                {renderRecommendationList(styling_recommendations.matching_accessories)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
