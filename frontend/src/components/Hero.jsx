import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUpload, FiMessageCircle, FiSmile } from 'react-icons/fi';

export default function Hero({ setActiveTab }) {
  const features = [
    {
      icon: <FiMessageCircle className="text-2xl text-gold-400" />,
      title: "AI Stylist Chat",
      desc: "Instant fashion and styling consultations tailored specifically to your wardrobe.",
      tab: "chat"
    },
    {
      icon: <FiUpload className="text-2xl text-violet-400" />,
      title: "Image Analysis",
      desc: "Upload photos to identify garments, colors, and get actionable fit improvement scores.",
      tab: "analysis"
    },
    {
      icon: <FiSmile className="text-2xl text-rose-400" />,
      title: "Outfit Builder",
      desc: "Custom-curate 3 complete outfit styling profiles matching your budget and occasion.",
      tab: "outfits"
    },
    {
      icon: <FiTrendingUp className="text-2xl text-emerald-400" />,
      title: "Fashion Trends",
      desc: "Browse the hottest color palettes, seasonal styles, and professional styling guidelines.",
      tab: "trends"
    }
  ];

  return (
    <div className="relative overflow-hidden py-16 md:py-24 px-6 md:px-12 flex flex-col items-center text-center max-w-7xl mx-auto">
      {/* Background glow graphics */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/5 text-gold-300 text-xs font-semibold uppercase tracking-widest mb-6"
      >
        Your Personal Generative AI Stylist
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight md:leading-none mb-6"
      >
        Elevate Your Wardrobe <br className="hidden md:block" />
        With <span className="gold-text-gradient">StyleSense AI</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-slate-400 text-base md:text-xl max-w-2xl leading-relaxed mb-10"
      >
        StyleSense utilizes advanced generative AI to analyze your outfits, search similar shopping deals, and build custom budget-aligned recommendation profiles.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24"
      >
        <button
          onClick={() => setActiveTab('analysis')}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 font-bold rounded-xl hover:scale-105 active:scale-95 shadow-lg shadow-gold-500/15 transition-all"
        >
          Analyze Your Outfit
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className="w-full sm:w-auto px-8 py-4 border border-white/10 hover:border-gold-500/50 bg-white/5 rounded-xl hover:scale-105 active:scale-95 hover:bg-white/10 transition-all font-medium text-slate-100"
        >
          Consult AI Stylist
        </button>
      </motion.div>

      {/* Feature grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left"
      >
        {features.map((feat, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(feat.tab)}
            className="group relative cursor-pointer glassmorphism p-6 rounded-2xl border border-white/5 hover:border-gold-500/30 transition-all duration-300 hover:translate-y-[-4px]"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/2 rounded-bl-full -z-10 group-hover:bg-gold-500/5 transition-colors" />
            <div className="mb-4 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
              {feat.icon}
            </div>
            <h3 className="font-bold text-lg text-slate-200 mb-2 group-hover:text-gold-400 transition-colors">
              {feat.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
