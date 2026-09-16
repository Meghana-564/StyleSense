import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiRefreshCw } from 'react-icons/fi';

const QUESTIONS = [
  {
    q: "What's your go-to weekend outfit?",
    options: [
      { label: 'Jeans + oversized tee', tags: ['Casual', 'Streetwear'] },
      { label: 'Flowy dress or co-ord set', tags: ['Boho', 'Feminine'] },
      { label: 'Joggers + hoodie', tags: ['Athleisure', 'Casual'] },
      { label: 'Tailored trousers + shirt', tags: ['Classic', 'Formal'] },
    ],
  },
  {
    q: "Pick your favorite color palette:",
    options: [
      { label: '🖤 Neutrals — Black, White, Grey', tags: ['Minimalist', 'Classic'] },
      { label: '🌿 Earthy — Olive, Terracotta, Camel', tags: ['Boho', 'Casual'] },
      { label: '💜 Bold — Cobalt, Burgundy, Emerald', tags: ['Streetwear', 'Feminine'] },
      { label: '🌸 Pastels — Blush, Lavender, Mint', tags: ['Feminine', 'Boho'] },
    ],
  },
  {
    q: "What matters most to you in an outfit?",
    options: [
      { label: 'Comfort above everything', tags: ['Athleisure', 'Casual'] },
      { label: 'Looking put-together and polished', tags: ['Classic', 'Formal'] },
      { label: 'Being on-trend and eye-catching', tags: ['Streetwear', 'Feminine'] },
      { label: 'Expressing my unique personality', tags: ['Boho', 'Minimalist'] },
    ],
  },
  {
    q: "Your ideal footwear is:",
    options: [
      { label: 'White sneakers or chunky shoes', tags: ['Streetwear', 'Casual'] },
      { label: 'Heels or block sandals', tags: ['Feminine', 'Classic'] },
      { label: 'Kolhapuris or juttis', tags: ['Boho', 'Ethnic'] },
      { label: 'Clean loafers or derby shoes', tags: ['Classic', 'Minimalist'] },
    ],
  },
  {
    q: "Which occasion do you dress up for most?",
    options: [
      { label: 'College / Casual outings', tags: ['Casual', 'Streetwear'] },
      { label: 'Office / Formal meetings', tags: ['Classic', 'Formal'] },
      { label: 'Parties / Night outs', tags: ['Feminine', 'Streetwear'] },
      { label: 'Festivals / Cultural events', tags: ['Boho', 'Ethnic'] },
    ],
  },
];

const STYLE_PROFILES = {
  Minimalist: {
    emoji: '🖤',
    title: 'The Minimalist',
    desc: 'You believe less is more. Clean lines, neutral tones, and quality basics define your wardrobe. Think COS, Uniqlo, and H&M basics.',
    tips: ['Invest in a perfect white shirt', 'Build a capsule wardrobe with 10 versatile pieces', 'Monochromatic outfits are your signature'],
    brands: ['H&M', 'Uniqlo', 'Zara Basics', 'Marks & Spencer'],
  },
  Classic: {
    emoji: '👔',
    title: 'The Classic',
    desc: 'Timeless, polished, and always appropriate. You gravitate towards structured silhouettes and traditional cuts that never go out of style.',
    tips: ['Tailored fits are your best friend', 'Invest in a good blazer — it elevates everything', 'Stick to a refined color palette: navy, white, camel'],
    brands: ['Allen Solly', 'Van Heusen', 'Fabindia', 'Peter England'],
  },
  Casual: {
    emoji: '👟',
    title: 'The Casual Comfort Lover',
    desc: "Comfort is your style mantra. You're the master of effortless dressing — looking great without trying too hard.",
    tips: ['Upgrade basics with interesting textures', 'A great pair of jeans is worth the investment', 'Sneakers tie every casual look together'],
    brands: ['Roadster', 'HRX', 'Levi\'s', 'WROGN', 'H&M'],
  },
  Streetwear: {
    emoji: '🔥',
    title: 'The Streetwear Icon',
    desc: "You're always ahead of the trends. Bold graphics, statement pieces, and sneaker culture define your aesthetic.",
    tips: ['Layer pieces for visual interest', 'Oversized + fitted combo is your formula', 'Accessories make or break the look'],
    brands: ['Jack & Jones', 'WROGN', 'Puma', 'Adidas', 'Dennis Lingo'],
  },
  Feminine: {
    emoji: '🌸',
    title: 'The Feminine Dresser',
    desc: 'Flowy fabrics, flattering silhouettes, and soft colors speak to your soul. You love feeling dressed up even on a regular day.',
    tips: ['Wrap dresses are universally flattering', 'A pop of color through accessories elevates any look', 'Invest in a good maxi and a midi dress'],
    brands: ['Zara', 'Mango', 'AND', 'Global Desi', 'Berrylush'],
  },
  Boho: {
    emoji: '🌿',
    title: 'The Free-Spirited Boho',
    desc: 'Earthy tones, ethnic prints, and natural fabrics are your language. You dress to express freedom and creativity.',
    tips: ['Layer necklaces and stack bangles', 'Earthy prints like block prints and ikat are your go-to', 'Kurtis, palazzos, and juttis are your holy trinity'],
    brands: ['Fabindia', 'W', 'Biba', 'Global Desi', 'Rang Manch'],
  },
  Athleisure: {
    emoji: '🏃',
    title: 'The Athleisure Enthusiast',
    desc: "You want to look sporty and stylish at the same time. Comfort-forward activewear-inspired fashion is your everyday look.",
    tips: ['Match your co-ords for an effortless look', 'Invest in a good pair of joggers and a bomber jacket', 'Chunky sneakers elevate any athleisure fit'],
    brands: ['HRX', 'Puma', 'Adidas', 'Nike', 'Decathlon'],
  },
  Ethnic: {
    emoji: '🪷',
    title: 'The Ethnic Elegance',
    desc: 'You celebrate Indian fashion. Traditional textiles, rich embroidery, and cultural fashion define your wardrobe.',
    tips: ['Mix ethnic tops with denim for fusion looks', 'Drape a dupatta differently each time for variety', 'Gold jewellery is always the right choice'],
    brands: ['Biba', 'W', 'Fabindia', 'Manyavar', 'Kalki Fashion'],
  },
};

export default function StyleQuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('stylesense_quiz');
    return saved ? JSON.parse(saved) : null;
  });

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    if (current < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrent(current + 1);
    } else {
      // Calculate result
      const tagCount = {};
      newAnswers.forEach(a => a.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
      const topTag = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0][0];
      const result = STYLE_PROFILES[topTag] || STYLE_PROFILES['Casual'];
      setProfile(result);
      localStorage.setItem('stylesense_quiz', JSON.stringify(result));
    }
  };

  const reset = () => {
    setCurrent(0);
    setAnswers([]);
    setProfile(null);
    localStorage.removeItem('stylesense_quiz');
  };

  const card = 'glassmorphism border border-white/5 rounded-2xl p-6 md:p-8';

  return (
    <div className="w-full py-8 px-4 max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-400 text-[10px] font-extrabold tracking-widest border border-gold-500/20 mb-4">STYLE QUIZ</span>
        <h1 className="text-3xl font-black tracking-tight mb-2">Discover Your Style</h1>
        <p className="text-sm text-slate-400">5 quick questions to find your personal fashion identity</p>
      </div>

      <AnimatePresence mode="wait">
        {!profile ? (
          <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className={card}>
            {/* Progress */}
            <div className="flex gap-1.5 mb-6">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= current ? 'bg-gold-500' : 'bg-white/10'}`} />
              ))}
            </div>
            <p className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase mb-2">Question {current + 1} of {QUESTIONS.length}</p>
            <h2 className="text-xl font-black mb-6">{QUESTIONS[current].q}</h2>
            <div className="space-y-3">
              {QUESTIONS[current].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)}
                  className="w-full text-left px-5 py-4 rounded-2xl border-2 border-white/5 bg-white/2 hover:border-gold-500/40 hover:bg-gold-500/5 transition-all font-semibold text-sm text-slate-200">
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className={card}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{profile.emoji}</div>
                <h2 className="text-2xl font-black mb-2">{profile.title}</h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto">{profile.desc}</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gold-500/5 border border-gold-500/10">
                  <p className="text-xs font-extrabold tracking-widest text-gold-400 uppercase mb-3">✨ Style Tips For You</p>
                  {profile.tips.map((tip, i) => (
                    <p key={i} className="text-sm text-slate-300 flex items-start gap-2 mb-2">
                      <FiCheck className="text-gold-400 mt-0.5 flex-shrink-0" size={13} /> {tip}
                    </p>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-white/3 border border-white/5">
                  <p className="text-xs font-extrabold tracking-widest text-slate-500 uppercase mb-3">🛍 Your Brands</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.brands.map((b, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={reset} className="w-full mt-5 py-3 rounded-xl border border-white/10 text-sm font-semibold text-slate-400 hover:text-gold-400 hover:border-gold-500/30 flex items-center justify-center gap-2 transition">
                <FiRefreshCw size={13} /> Retake Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
