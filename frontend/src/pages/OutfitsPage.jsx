import React, { useState } from 'react';
import OutfitCard from '../components/OutfitCard';
import Loader from '../components/Loader';
import api from '../api';
import { FiSliders, FiDollarSign, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { GiBowTie } from 'react-icons/gi';

export default function OutfitsPage() {
  const [gender, setGender] = useState('Women\'s Fashion');
  const [occasion, setOccasion] = useState('Casual Hangout');
  const [budget, setBudget] = useState(2500);
  const [stylePreference, setStylePreference] = useState('Casual');
  const [outfits, setOutfits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOutfits([]);

    try {
      const response = await api.recommendOutfit(gender, occasion, budget, stylePreference);
      setOutfits(response.outfits);
    } catch (err) {
      console.error(err);
      setError(typeof err === 'string' ? err : 'Failed to generate styling advice. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-8 px-4 max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">AI Outfit Builder</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Specify your preferences and let our LLM recommendation engine compile 3 unique styling outfits within your strict budget limits.
        </p>
      </div>

      {/* Input panel Form */}
      <form onSubmit={handleSubmit} className="glassmorphism p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Gender Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender Category</label>
          <div className="grid grid-cols-2 gap-3">
            {["Men's Fashion", "Women's Fashion"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${
                  gender === g
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 border-gold-500 font-bold'
                    : 'bg-white/3 border-white/5 text-slate-300 hover:bg-white/5'
                }`}
              >
                {g.replace("'s Fashion", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Style Preference */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Style preference</label>
          <select
            value={stylePreference}
            onChange={(e) => setStylePreference(e.target.value)}
            className="w-full bg-[#0a0d14] border border-white/5 focus:border-gold-500/50 outline-none rounded-xl px-4 py-3 text-sm text-slate-200 transition-colors"
          >
            {["Casual", "Formal", "Ethnic", "Sports", "Streetwear", "Athleisure"].map((opt) => (
              <option key={opt} value={opt} className="bg-slate-950">{opt}</option>
            ))}
          </select>
        </div>

        {/* Occasion */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Occasion / Event</label>
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g. Birthday Party, Office Meeting, Wedding"
            className="w-full bg-[#0a0d14] border border-white/5 focus:border-gold-500/50 outline-none rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 transition-colors"
            required
          />
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Max Outfit Budget Limit</span>
            <span className="text-gold-400 font-extrabold text-sm">₹{budget.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500 outline-none"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="md:col-span-2 w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 font-bold rounded-xl hover:scale-[1.02] active:scale-95 shadow-lg shadow-gold-500/10 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <FiSearch className="text-lg" />
          {isLoading ? 'Curating Custom Outfit Combos...' : 'Generate 3 Custom Outfits'}
        </button>
      </form>

      {/* Error alert */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl max-w-2xl mx-auto flex items-start gap-3">
          <FiAlertCircle className="text-xl shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Outfit Generator Error</h4>
            <p className="text-xs mt-1 text-rose-200">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-6 pt-4">
          <Loader type="spinner" message="Crafting outfit color matches..." />
          <Loader type="outfit" />
        </div>
      )}

      {/* Recommended Outfits Grid */}
      {!isLoading && outfits && outfits.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2 uppercase tracking-wider justify-center">
            <GiBowTie className="text-gold-500 text-2xl" /> Curated Style Outfits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {outfits.map((outfit, index) => (
              <OutfitCard key={index} outfit={outfit} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
