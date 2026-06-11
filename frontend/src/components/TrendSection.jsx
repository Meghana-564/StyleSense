import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiGrid, FiCompass, FiZap } from 'react-icons/fi';

export default function TrendSection({ trends }) {
  if (!trends) return null;

  const {
    trending_colors = [],
    trending_styles = [],
    seasonal_trends = [],
    occasion_advice = []
  } = trends;

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-8">
      {/* Upper header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">Fashion Trends & Insights</h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Generated in real-time. Discover trending colors, structural styles, and guides curated by our expert AI models.
        </p>
      </div>

      {/* Grid of trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Trending Colors */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <FiZap className="text-gold-400 text-lg animate-pulse" /> Popular Color Palettes
          </h3>
          <div className="space-y-3 pt-2">
            {trending_colors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {/* Color preview circle */}
                <div
                  className="w-8 h-8 rounded-full border border-white/20 shadow-md shrink-0"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-semibold mb-1">
                    <span className="text-slate-200">{color.name}</span>
                    <span className="text-gold-400">{color.popularity}% popularity</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${color.popularity}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="bg-gold-500 h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Styles */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <FiGrid className="text-violet-400 text-lg" /> Style Trends
          </h3>
          <div className="space-y-4 pt-2">
            {trending_styles.map((style, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white/2 p-3.5 rounded-xl border border-white/5">
                <div className="bg-violet-500/10 text-violet-400 p-2 rounded-lg text-xs font-bold uppercase shrink-0 mt-0.5 border border-violet-500/10">
                  Trend {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{style.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{style.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Seasonal Trends */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <FiCompass className="text-rose-400 text-lg" /> Seasonal Highlights
          </h3>
          <div className="space-y-4 pt-2">
            {seasonal_trends.map((trend, idx) => (
              <div key={idx} className="bg-white/2 p-4 rounded-xl border border-white/5 space-y-1">
                <h4 className="text-sm font-extrabold text-gold-400">{trend.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{trend.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Occasion Advice */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <FiTarget className="text-emerald-400 text-lg" /> Occasion Styling Guide
          </h3>
          <div className="space-y-4 pt-2">
            {occasion_advice.map((advice, idx) => (
              <div key={idx} className="bg-white/2 p-4 rounded-xl border border-white/5 space-y-2">
                <h4 className="text-sm font-extrabold text-slate-200 border-b border-white/5 pb-1">{advice.occasion}</h4>
                <ul className="text-xs text-slate-400 space-y-1.5 pl-1">
                  {advice.tips?.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
