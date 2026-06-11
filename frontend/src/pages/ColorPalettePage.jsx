import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDroplet, FiSearch } from 'react-icons/fi';
import api from '../api';

const PRESET_COLORS = [
  { name: 'Black', hex: '#1a1a1a' }, { name: 'White', hex: '#f5f5f5' },
  { name: 'Red', hex: '#e53e3e' }, { name: 'Navy Blue', hex: '#1a365d' },
  { name: 'Sage Green', hex: '#87a96b' }, { name: 'Terracotta', hex: '#c35237' },
  { name: 'Mustard', hex: '#d4a017' }, { name: 'Blush Pink', hex: '#f4a0a0' },
  { name: 'Olive', hex: '#6b7c45' }, { name: 'Burgundy', hex: '#800020' },
  { name: 'Lavender', hex: '#9b8ec4' }, { name: 'Camel', hex: '#c19a6b' },
];

const THEORY_COLORS = {
  Complementary: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  Analogous: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Monochromatic: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Triadic: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
};

export default function ColorPalettePage() {
  const [selectedColor, setSelectedColor] = useState(null);
  const [customColor, setCustomColor] = useState('#c19a6b');
  const [gender, setGender] = useState("Women's Fashion");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (colorName) => {
    const color = colorName || selectedColor;
    if (!color) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await api.getColorPalette(color, gender);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-8 px-4 max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-400 text-[10px] font-extrabold tracking-widest border border-gold-500/20 mb-4">COLOR PALETTE</span>
        <h1 className="text-3xl font-black tracking-tight mb-2">Color Palette Generator</h1>
        <p className="text-sm text-slate-400">Pick a base color → AI builds complete outfit combos using color theory</p>
      </div>

      {/* Gender toggle */}
      <div className="flex justify-center gap-3">
        {["Women's Fashion", "Men's Fashion"].map(g => (
          <button key={g} onClick={() => setGender(g)}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${gender === g ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
            {g === "Women's Fashion" ? "👩 Women" : "👨 Men"}
          </button>
        ))}
      </div>

      {/* Color presets */}
      <div className="glassmorphism border border-white/5 rounded-2xl p-6">
        <p className="text-xs font-extrabold tracking-widest text-slate-500 uppercase mb-4">Choose a Base Color</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
          {PRESET_COLORS.map(c => (
            <button key={c.name} onClick={() => setSelectedColor(c.name)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${selectedColor === c.name ? 'border-gold-500 scale-105' : 'border-white/5 hover:border-white/20'}`}>
              <div className="w-10 h-10 rounded-lg shadow-md" style={{ backgroundColor: c.hex }} />
              <span className="text-[10px] font-semibold text-slate-400">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Custom color picker */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/2">
          <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
          <div>
            <p className="text-sm font-semibold text-slate-200">Custom Color</p>
            <p className="text-xs text-slate-500">{customColor}</p>
          </div>
          <button onClick={() => handleGenerate(customColor)}
            className="ml-auto px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-300 hover:text-gold-400 hover:border-gold-500/30 transition">
            Use This
          </button>
        </div>

        <button onClick={() => handleGenerate(null)} disabled={!selectedColor || loading}
          className="w-full mt-5 py-4 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 font-bold text-base hover:shadow-xl hover:shadow-gold-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> Generating...</> : <><FiDroplet /> Generate Outfit Palette</>}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <p className="text-center text-sm font-bold text-slate-400">
              Outfits built around <span className="text-gold-400">{result.base_color}</span>
            </p>
            {result.outfits?.map((outfit, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glassmorphism border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h3 className="font-black text-lg">{outfit.outfit_name}</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${THEORY_COLORS[outfit.color_theory] || 'text-slate-400 bg-white/5 border-white/10'}`}>
                    {outfit.color_theory}
                  </span>
                </div>
                {/* Color palette swatches */}
                <div className="flex gap-2 mb-5">
                  {outfit.palette?.map((hex, j) => (
                    <div key={j} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-lg shadow-md border border-white/10" style={{ backgroundColor: hex }} />
                      <span className="text-[9px] text-slate-500">{outfit.palette_names?.[j]}</span>
                    </div>
                  ))}
                </div>
                {/* Outfit items */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[['👕 Top', outfit.top], ['👖 Bottom', outfit.bottom], ['👟 Footwear', outfit.footwear], ['💍 Accessory', outfit.accessory]].map(([label, val]) => (
                    <div key={label} className="p-3 rounded-xl bg-white/3 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</p>
                      <p className="text-xs text-slate-200 font-semibold">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gold-500/5 border border-gold-500/10">
                  <span className="text-gold-400 text-sm">✨</span>
                  <div>
                    <p className="text-[10px] font-bold text-gold-400 uppercase mb-0.5">Styling Tip · {outfit.occasion}</p>
                    <p className="text-xs text-slate-300">{outfit.styling_tip}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
