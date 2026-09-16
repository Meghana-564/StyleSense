import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUploadCloud, FiCheck, FiStar, FiShoppingBag,
  FiX, FiRefreshCw, FiExternalLink, FiGrid, FiTrendingUp, FiSettings, FiShare2
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api';
import { ScoreRing, Badge } from '../components/UI';

/* ─────────── Step labels for the progress indicator ─────────── */
const STEP_LABELS = ['Category', 'Upload Photo', 'Set Budget', 'Analyze'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                done
                  ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-slate-950 shadow-lg shadow-gold-500/30'
                  : active
                    ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-slate-950 shadow-lg shadow-gold-500/30 ring-4 ring-gold-500/20'
                    : 'bg-white/5 text-slate-500'
              }`}>
                {done ? <FiCheck size={15} /> : i + 1}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${
                active ? 'text-gold-400' : 'text-slate-500'
              }`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-16 h-0.5 mx-1 mb-5 transition-colors duration-300 ${
                i < current
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600'
                  : 'bg-white/5'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────── Store badge color mapper ─────────── */
function getStoreStyle(storeName) {
  switch (storeName?.toLowerCase()) {
    case 'amazon':   return 'bg-[#ff9900]/10 text-[#ff9900]';
    case 'flipkart': return 'bg-[#2874f0]/10 text-[#2874f0]';
    default:         return 'bg-white/10 text-slate-300';
  }
}

/* ═══════════════════════════════════════════════════════════════
   Main AnalysisPage component — 4‑step wizard
   ═══════════════════════════════════════════════════════════════ */
export default function AnalysisPage() {
  const [step, setStep]             = useState(0);
  const [gender, setGender]         = useState(null);
  const [file, setFile]             = useState(null);
  const [preview, setPreview]       = useState(null);
  const [budget, setBudget]         = useState('');
  const [garmentName, setGarmentName] = useState('');
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);

  const budgetNum = parseInt(budget.replace(/[^\d]/g, ''), 10);
  const budgetValid = !isNaN(budgetNum) && budgetNum > 0;

  /* ── Dropzone handler ── */
  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setStep(2); // jump to budget step
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  /* ── Analyze handler ── */
  const analyze = async () => {
    if (!file || !budgetValid) return;
    setLoading(true);
    setResult(null);
    setStep(3);
    try {
      const genderStr = gender === 'male' ? "Men's Fashion" : "Women's Fashion";
      const data = await api.analyzeImage(file, budgetNum, genderStr, garmentName.trim() || null);
      setResult(data);
      // Save to history
      const history = JSON.parse(localStorage.getItem('stylesense_history') || '[]');
      history.unshift({
        ...data,
        preview: URL.createObjectURL(file),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
      localStorage.setItem('stylesense_history', JSON.stringify(history.slice(0, 20)));
    } catch (err) {
      console.error(err);
      toast.error('Analysis failed. Please try again.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const shareOutfit = () => {
    if (!result) return;
    const text = `✨ My outfit analysis on StyleSense!\n👗 ${result.detected_item}\n🎨 Colors: ${result.colors?.join(', ')}\n⭐ Fashion Score: ${result.fashion_score}/10\n💡 Style: ${result.style}\n\nAnalyze your outfits at StyleSense AI!`;
    if (navigator.share) {
      navigator.share({ title: 'StyleSense Outfit', text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Outfit details copied to clipboard!');
    }
  };

  /* ── Reset everything ── */
  const reset = () => {
    setStep(0);
    setGender(null);
    setFile(null);
    setPreview(null);
    setBudget('');
    setGarmentName('');
    setResult(null);
  };

  /* ── Shared card style ── */
  const card = 'rounded-2xl glassmorphism border border-white/5 p-6 md:p-8 shadow-xl';

  /* ── Animation presets ── */
  const stepMotion = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="w-full min-h-screen pt-8 pb-16 px-4">
      {/* Toast container */}
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1a1f2e', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px' },
      }} />

      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-400 text-[10px] font-extrabold tracking-widest border border-gold-500/20 mb-4">
              AI OUTFIT ANALYSIS
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Shop Your Look</h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Upload any outfit image → AI detects every item → Finds best-price deals within your budget
            </p>
          </motion.div>
        </div>

        {/* ── Step indicator ── */}
        <StepIndicator current={step} />

        {/* ════════════ Animated step panels ════════════ */}
        <AnimatePresence mode="wait">

          {/* ── Step 0: Select Category ── */}
          {step === 0 && (
            <motion.div key="s0" {...stepMotion} className={card}>
              <h2 className="text-xl font-black mb-2">Who is this outfit for?</h2>
              <p className="text-sm text-slate-400 mb-8">This helps AI give more accurate shopping recommendations</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: 'female', emoji: '👩', label: 'Women', desc: 'Sarees, dresses, kurtas, tops & more' },
                  { val: 'male',   emoji: '👨', label: 'Men',   desc: 'Shirts, trousers, kurtas, suits & more' },
                ].map(g => (
                  <button
                    key={g.val}
                    onClick={() => { setGender(g.val); setStep(1); }}
                    className="group p-8 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl
                      border-white/5 hover:border-gold-500/40 bg-white/2 hover:bg-gold-500/5"
                  >
                    <div className="text-5xl mb-4">{g.emoji}</div>
                    <div className="font-black text-xl mb-1 text-slate-100">{g.label}</div>
                    <div className="text-sm text-slate-500">{g.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 1: Upload Photo ── */}
          {step === 1 && (
            <motion.div key="s1" {...stepMotion} className={card}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black mb-1">Upload Outfit Photo</h2>
                  <p className="text-sm text-slate-400">
                    For {gender === 'male' ? '👨 Men' : '👩 Women'} ·{' '}
                    <button onClick={() => setStep(0)} className="text-gold-400 underline underline-offset-2 hover:text-gold-300 transition">Change</button>
                  </p>
                </div>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-gold-500 bg-gold-500/5 scale-[1.01]'
                    : 'border-white/10 hover:border-gold-500/30 bg-white/2 hover:bg-white/3'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mx-auto mb-4">
                  <FiUploadCloud size={28} className="text-slate-950" />
                </div>
                <p className="font-bold text-base mb-1 text-slate-200">
                  {isDragActive ? 'Drop your photo here' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-sm text-slate-500">JPG, PNG, WEBP · max 10 MB</p>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Set Budget ── */}
          {step === 2 && (
            <motion.div key="s2" {...stepMotion} className={card}>
              <h2 className="text-xl font-black mb-6">Set Your Budget</h2>

              {/* Preview thumbnail */}
              {preview && (
                <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl border border-white/5 bg-white/2 relative">
                  <img src={preview} alt="outfit preview" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-sm text-slate-100">Outfit uploaded ✓</p>
                    <p className="text-xs text-slate-500">For {gender === 'male' ? 'Men' : 'Women'}</p>
                  </div>
                  <button
                    onClick={() => { setFile(null); setPreview(null); setStep(1); }}
                    className="ml-auto p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}

              {/* Preset budget buttons */}
              <div className="space-y-3 mb-8">
                {[500, 1000, 2000, 5000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setBudget(String(amt))}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all font-semibold text-sm ${
                      budgetNum === amt
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                        : 'border-white/5 text-slate-300 hover:border-white/10'
                    }`}
                  >
                    <span>Under ₹{amt.toLocaleString('en-IN')}</span>
                    {budgetNum === amt && <FiCheck className="text-gold-400" />}
                  </button>
                ))}

                {/* Custom amount */}
                <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all ${
                  budgetValid && ![500, 1000, 2000, 5000].includes(budgetNum)
                    ? 'border-gold-500'
                    : 'border-white/5'
                }`}>
                  <span className="font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    placeholder="Enter custom amount"
                    className="flex-1 bg-transparent text-sm font-semibold outline-none text-slate-100 placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Garment name input */}
              <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all ${
                garmentName.trim() ? 'border-gold-500' : 'border-white/5'
              }`}>
                <span className="text-slate-500 text-sm">👗</span>
                <input
                  type="text"
                  value={garmentName}
                  onChange={e => setGarmentName(e.target.value)}
                  placeholder="What is this garment? (e.g. Co-ord Set, Maxi Dress, Kurti)"
                  className="flex-1 bg-transparent text-sm font-semibold outline-none text-slate-100 placeholder-slate-600"
                />
              </div>

              {/* Analyze CTA */}
              <button
                onClick={analyze}
                disabled={!budgetValid || loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 font-bold text-base hover:shadow-xl hover:shadow-gold-500/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading
                  ? <><div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> Analyzing...</>
                  : `✦ Analyze & Shop Within ₹${budgetValid ? budgetNum.toLocaleString('en-IN') : '...'}`}
              </button>
            </motion.div>
          )}

          {/* ── Step 3: Loading / Results ── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* ─── Loading state ─── */}
              {loading && (
                <div className={`${card} text-center py-16`}>
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
                  </div>
                  <h3 className="font-black text-xl mb-2">Analyzing Your Outfit</h3>
                  <p className="text-sm text-slate-400">
                    AI is detecting items, colors, and finding the best deals within ₹{budgetNum?.toLocaleString('en-IN')}...
                  </p>
                  <div className="flex justify-center gap-1.5 mt-8">
                    {['Detecting items', 'Scoring style', 'Finding deals'].map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border bg-white/3 border-white/5 text-slate-400 animate-pulse"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      >
                        {s}...
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Results ─── */}
              {result && !loading && (
                <div className="space-y-5">

                  {/* ── Score card ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={card}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-black">{result.detected_item || 'Outfit Analysis'}</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.style && <Badge color="gold">{result.style}</Badge>}
                          {result.category && <Badge color="violet">{result.category}</Badge>}
                          <Badge color={gender === 'male' ? 'blue' : 'pink'}>
                            {gender === 'male' ? '👨 Men' : '👩 Women'}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={reset}
                        className="flex items-center gap-1.5 p-2 px-3 rounded-xl text-xs font-medium transition bg-white/5 text-slate-400 hover:text-gold-400 hover:bg-white/10 border border-white/5"
                      >
                        <FiRefreshCw size={12} /> New
                      </button>
                      <button
                        onClick={shareOutfit}
                        className="flex items-center gap-1.5 p-2 px-3 rounded-xl text-xs font-medium transition bg-white/5 text-slate-400 hover:text-gold-400 hover:bg-white/10 border border-white/5"
                      >
                        <FiShare2 size={12} /> Share
                      </button>
                    </div>

                    {/* Scores + image side by side */}
                    <div className="flex items-center gap-8 flex-wrap">
                      {preview && (
                        <img src={preview} alt="outfit" className="w-32 h-40 rounded-2xl object-cover flex-shrink-0 border border-white/5" />
                      )}
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex gap-8 mb-6 justify-center md:justify-start">
                          <div className="text-center">
                            <ScoreRing score={result.fashion_score || 5} size={90} outOf10={true} />
                            <p className="text-xs mt-2 font-semibold text-slate-400">Fashion Score</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fashion Attributes Detail Chips */}
                    {(result.garment_type || result.neckline || result.pattern || result.fabric) && (
                      <div className="mt-5 pt-5 border-t border-white/5">
                        <p className="text-[10px] font-extrabold tracking-widest mb-3 text-slate-500 uppercase">Fashion Details</p>
                        <div className="flex flex-wrap gap-2">
                          {result.garment_type && (
                            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                              👗 {result.garment_type}
                            </span>
                          )}
                          {result.neckline && (
                            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {result.neckline}
                            </span>
                          )}
                          {result.sleeve_type && (
                            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {result.sleeve_type}
                            </span>
                          )}
                          {result.silhouette && (
                            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                              {result.silhouette}
                            </span>
                          )}
                          {result.pattern && (
                            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {result.pattern}
                            </span>
                          )}
                          {result.fit && (
                            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {result.fit}
                            </span>
                          )}
                          {result.fabric && (
                            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20">
                              {result.fabric}
                            </span>
                          )}
                          {result.occasion && (
                            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              🎯 {result.occasion}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Detected colors */}
                    {result.colors?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] font-extrabold tracking-widest mb-3 text-slate-500 uppercase">Detected Colors</p>
                        <div className="flex flex-wrap gap-2">
                          {result.colors.map((c, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 border border-white/5">
                              🎨 {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths + Improvements */}
                    <div className="mt-5 grid sm:grid-cols-2 gap-4">
                      {result.strengths?.length > 0 && (
                        <div className="p-4 rounded-2xl bg-emerald-950/10 border border-emerald-500/10">
                          <p className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">✓ Strengths</p>
                          {result.strengths.map((s, i) => (
                            <p key={i} className="text-xs flex items-start gap-2 mb-1.5 text-slate-300">
                              <FiCheck size={11} className="text-emerald-400 mt-0.5 flex-shrink-0" />{s}
                            </p>
                          ))}
                        </div>
                      )}
                      {result.improvements?.length > 0 && (
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                          <p className="text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">⚡ Improvements</p>
                          {result.improvements.map((s, i) => (
                            <p key={i} className="text-xs mb-1.5 text-slate-300">• {s}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* ── Shopping Results ── */}
                  {result.shopping_matches?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className={card}
                    >
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-black text-lg">🛍 Best Deals Found</h3>
                        <span className="text-xs font-semibold text-slate-500">
                          Budget: ₹{budgetNum?.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {result.shopping_matches.filter(p => p.price <= budgetNum).map((product, i) => (
                          <motion.div
                            key={product.id || i}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md
                              bg-white/2 border-white/5 hover:border-gold-500/20 hover:bg-white/4"
                          >
                            {/* Product image */}
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-white/5"
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300'; }}
                            />

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-bold text-sm text-slate-100 truncate">{product.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  ✓ In budget
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mb-1">
                                <span className={`font-semibold ${getStoreStyle(product.store)} px-1.5 py-0.5 rounded text-[10px]`}>
                                  {product.store}
                                </span>
                                <span className="ml-2">{product.similarity}% match</span>
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-base font-black text-emerald-400">
                                  ₹{product.price?.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>

                            {/* Shop button */}
                            <a
                              href={product.product_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 text-xs font-bold hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-gold-500/10"
                            >
                              <FiShoppingBag size={12} /> Buy
                            </a>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Styling Recommendations ── */}
                  {result.styling_recommendations && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={card}
                    >
                      <h4 className="font-black text-lg mb-5">💡 Styling Coordinations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Bottoms */}
                        <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex gap-3.5 items-start">
                          <div className="bg-violet-500/10 p-2.5 rounded-lg text-violet-400 border border-violet-500/20">
                            <FiGrid className="text-lg" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Bottoms</h5>
                            <ul className="text-sm text-slate-200 font-semibold mt-1 space-y-1">
                              {result.styling_recommendations.matching_bottoms?.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Footwear */}
                        <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex gap-3.5 items-start">
                          <div className="bg-gold-500/10 p-2.5 rounded-lg text-gold-400 border border-gold-500/20">
                            <FiTrendingUp className="text-lg" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Footwear</h5>
                            <ul className="text-sm text-slate-200 font-semibold mt-1 space-y-1">
                              {result.styling_recommendations.matching_footwear?.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Accessories */}
                        <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex gap-3.5 items-start">
                          <div className="bg-rose-500/10 p-2.5 rounded-lg text-rose-400 border border-rose-500/20">
                            <FiSettings className="text-lg" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Accessories</h5>
                            <ul className="text-sm text-slate-200 font-semibold mt-1 space-y-1">
                              {result.styling_recommendations.matching_accessories?.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Reset button */}
                  <button
                    onClick={reset}
                    className="w-full py-3 rounded-xl border text-sm font-semibold transition border-white/5 text-slate-400 hover:bg-white/5 hover:text-gold-400"
                  >
                    🔄 Analyze Another Outfit
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
