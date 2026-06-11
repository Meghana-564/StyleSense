import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiClock, FiShoppingBag } from 'react-icons/fi';

export default function OutfitHistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('stylesense_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const clearAll = () => {
    localStorage.removeItem('stylesense_history');
    setHistory([]);
  };

  const deleteOne = (idx) => {
    const updated = history.filter((_, i) => i !== idx);
    localStorage.setItem('stylesense_history', JSON.stringify(updated));
    setHistory(updated);
  };

  return (
    <div className="w-full py-8 px-4 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-400 text-[10px] font-extrabold tracking-widest border border-gold-500/20 mb-4">HISTORY</span>
        <h1 className="text-3xl font-black tracking-tight mb-2">Outfit History</h1>
        <p className="text-sm text-slate-400">All your previously analyzed outfits</p>
      </div>

      {history.length > 0 && (
        <div className="flex justify-end">
          <button onClick={clearAll} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/10 transition">
            <FiTrash2 size={12} /> Clear All
          </button>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-20 glassmorphism border border-white/5 rounded-2xl">
          <FiClock className="text-4xl text-slate-600 mx-auto mb-4" />
          <p className="font-bold text-slate-500">No outfit history yet</p>
          <p className="text-sm text-slate-600 mt-1">Analyze an outfit in Image Analysis to see it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {history.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glassmorphism border border-white/5 rounded-2xl p-5 relative">
              <button onClick={() => deleteOne(i)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition">
                <FiTrash2 size={13} />
              </button>
              <div className="flex gap-4">
                {item.preview && (
                  <img src={item.preview} alt="outfit" className="w-20 h-24 rounded-xl object-cover flex-shrink-0 border border-white/5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-slate-100 truncate pr-6">{item.detected_item}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/10 text-gold-400 border border-gold-500/20">{item.style}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">{item.category}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-slate-400 border border-white/10">{item.gender}</span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {item.colors?.slice(0, 3).map((c, j) => (
                      <span key={j} className="text-[10px] text-slate-500">🎨 {c}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-extrabold text-emerald-400">Score: {item.fashion_score}/10</span>
                    <span className="text-[10px] text-slate-600">{item.date}</span>
                  </div>
                </div>
              </div>
              {item.shopping_matches?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                    <FiShoppingBag size={10} /> Matched Products
                  </p>
                  <div className="space-y-1.5">
                    {item.shopping_matches.slice(0, 2).map((p, j) => (
                      <div key={j} className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 truncate">{p.name}</span>
                        <span className="text-xs font-bold text-emerald-400 ml-2 flex-shrink-0">₹{p.price?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
