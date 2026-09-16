import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';

export default function ProductCard({ product }) {
  if (!product) return null;

  const {
    name,
    price,
    store,
    image_url,
    product_url,
    similarity
  } = product;

  // Color theme mapper for stores
  const getStoreStyles = (storeName) => {
    switch (storeName.toLowerCase()) {
      case 'amazon':
        return 'bg-[#ff9900]/10 text-[#ff9900] border-[#ff9900]/20';
      case 'flipkart':
        return 'bg-[#2874f0]/10 text-[#2874f0] border-[#2874f0]/20';
      default:
        return 'bg-white/10 text-slate-300 border-white/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glassmorphism border border-white/5 hover:border-gold-500/30 rounded-xl overflow-hidden shadow-lg flex flex-col group transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] bg-white/2 overflow-hidden flex items-center justify-center">
        <img
          src={image_url}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Similarity Score Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/80 border border-white/10 text-gold-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-md">
          {similarity}% Match
        </div>

        {/* Store Badge */}
        <div className={`absolute top-3 right-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border shadow-md ${getStoreStyles(store)}`}>
          {store}
        </div>
      </div>

      {/* Product Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-gold-400 transition-colors">
            {name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-base font-black text-slate-100">
            ₹{price.toLocaleString('en-IN')}
          </span>
          <a
            href={product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 font-bold transition-colors uppercase tracking-wider"
          >
            Shop Now <FiExternalLink className="text-sm" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
