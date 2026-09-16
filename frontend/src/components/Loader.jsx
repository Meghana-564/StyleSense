import React from 'react';
import { GiClothespin } from 'react-icons/gi';

export function Spinner({ message = "Loading styling advice..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-gold-500/10 border-t-gold-500 animate-spin" />
        <GiClothespin className="text-2xl text-gold-400 animate-pulse" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-200 tracking-wide">{message}</p>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Querying AI model...</p>
      </div>
    </div>
  );
}

export function SkeletonProductGrid({ count = 3 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto mt-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className="border border-white/5 bg-[#121722]/40 rounded-xl overflow-hidden shadow-md space-y-4 flex flex-col"
        >
          {/* Image placeholder */}
          <div className="aspect-[4/5] skeleton-loading w-full" />
          
          {/* Details placeholder */}
          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-4 skeleton-loading rounded w-5/6" />
              <div className="h-3 skeleton-loading rounded w-2/3" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 skeleton-loading rounded w-1/3" />
              <div className="h-4 skeleton-loading rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonOutfitGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto mt-6">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div 
          key={idx} 
          className="border border-white/5 bg-[#121722]/40 rounded-2xl overflow-hidden shadow-xl p-6 space-y-6 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div className="h-4 skeleton-loading rounded w-1/3" />
            <div className="h-5 skeleton-loading rounded-full w-20" />
          </div>
          
          {/* Items */}
          <div className="space-y-3 flex-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="h-6 skeleton-loading rounded w-12 shrink-0" />
                <div className="h-4 skeleton-loading rounded w-2/3" />
              </div>
            ))}
          </div>

          {/* Logic */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="h-2 skeleton-loading rounded w-1/4" />
            <div className="h-3 skeleton-loading rounded w-full" />
            <div className="h-3 skeleton-loading rounded w-5/6" />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <div className="h-4 skeleton-loading rounded w-1/4" />
            <div className="h-5 skeleton-loading rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Loader({ type = "spinner", count = 3, message }) {
  if (type === "product") return <SkeletonProductGrid count={count} />;
  if (type === "outfit") return <SkeletonOutfitGrid />;
  return <Spinner message={message} />;
}
