import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import api from '../api';
import { FiSliders, FiDollarSign, FiSearch, FiAlertCircle, FiGrid } from 'react-icons/fi';

export default function ProductsPage() {
  const [gender, setGender] = useState("Women's Fashion");
  const [category, setCategory] = useState('Topwear');
  const [detectedItem, setDetectedItem] = useState('');
  const [colorsInput, setColorsInput] = useState('Black');
  const [style, setStyle] = useState('Casual');
  const [budget, setBudget] = useState(1500);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setProducts([]);
    setSearched(true);

    try {
      // Split colors by comma and clean whitespace
      const colors = colorsInput.split(',').map(c => c.trim()).filter(Boolean);
      const response = await api.getSimilarProducts(
        gender,
        category,
        detectedItem || category, // fallback to category if empty
        colors,
        style,
        budget
      );
      setProducts(response.matches || []);
    } catch (err) {
      console.error(err);
      setError(typeof err === 'string' ? err : 'Failed to search products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-8 px-4 max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Similar Product Search</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Search details manually to find matching products from Amazon and Flipkart under your budget.
        </p>
      </div>

      {/* Filter panel Form */}
      <form onSubmit={handleSubmit} className="glassmorphism p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gender Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-[#0a0d14] border border-white/5 focus:border-gold-500/50 outline-none rounded-xl px-4 py-3 text-sm text-slate-200 transition-colors"
          >
            <option value="Men's Fashion">Men's Fashion</option>
            <option value="Women's Fashion">Women's Fashion</option>
          </select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Garment Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#0a0d14] border border-white/5 focus:border-gold-500/50 outline-none rounded-xl px-4 py-3 text-sm text-slate-200 transition-colors"
          >
            {["Topwear", "Bottomwear", "Footwear", "Accessories", "Ethnic Wear", "Dresses"].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Style Category</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-[#0a0d14] border border-white/5 focus:border-gold-500/50 outline-none rounded-xl px-4 py-3 text-sm text-slate-200 transition-colors"
          >
            {["Casual", "Formal", "Ethnic", "Sports", "Streetwear", "Athleisure"].map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Target Keyword / Item */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specific Garment Item (Optional)</label>
          <input
            type="text"
            value={detectedItem}
            onChange={(e) => setDetectedItem(e.target.value)}
            placeholder="e.g. Checked shirt, Denim jacket, High waist jeans"
            className="w-full bg-[#0a0d14] border border-white/5 focus:border-gold-500/50 outline-none rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 transition-colors"
          />
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Colors (Comma separated)</label>
          <input
            type="text"
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            placeholder="e.g. Black, White, Grey"
            className="w-full bg-[#0a0d14] border border-white/5 focus:border-gold-500/50 outline-none rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 transition-colors"
            required
          />
        </div>

        {/* Budget */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Maximum Price limit</span>
            <span className="text-gold-400 font-extrabold text-sm">₹{budget.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="500"
            max="10000"
            step="250"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500 outline-none"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 font-bold rounded-xl hover:scale-105 active:scale-95 shadow-lg shadow-gold-500/10 transition-all flex items-center justify-center gap-2 self-end h-[48px]"
        >
          <FiSearch className="text-lg" />
          {isLoading ? 'Searching...' : 'Search Products'}
        </button>
      </form>

      {/* Error display */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl max-w-2xl mx-auto flex items-start gap-3">
          <FiAlertCircle className="text-xl shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Product Search Error</h4>
            <p className="text-xs mt-1 text-rose-200">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <Loader type="product" count={4} />}

      {/* Results grid */}
      {!isLoading && searched && (
        <div className="space-y-6 pt-6">
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2 uppercase tracking-wider justify-center">
            <FiGrid className="text-gold-500" /> Catalog Matches
          </h3>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glassmorphism border border-white/5 rounded-2xl max-w-2xl mx-auto">
              <p className="text-sm text-slate-400 font-extrabold uppercase tracking-wider">
                Unable to find highly similar products.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Try raising your budget limit slider or matching other styles to retrieve catalog records.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
