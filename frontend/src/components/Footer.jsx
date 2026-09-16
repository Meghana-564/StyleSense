import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-white/5 py-8 text-center text-xs text-slate-500 bg-[#07090e]">
      <p className="tracking-wide">
        © {new Date().getFullYear()} StyleSense AI. All rights reserved. Premium Generative AI Fashion Recommendation System.
      </p>
      <p className="mt-2 text-[10px] text-slate-600 font-semibold tracking-widest uppercase">
        Powered by Groq, Gemini & Hugging Face
      </p>
    </footer>
  );
}
