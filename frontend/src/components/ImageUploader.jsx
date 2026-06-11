import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiTrash2, FiDollarSign, FiCamera, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ImageUploader({ onUpload, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [budget, setBudget] = useState(2000);
  const [gender, setGender] = useState("Women's Fashion");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile, budget, gender);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glassmorphism p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl">
      <h2 className="text-xl font-bold text-slate-100 mb-2">Upload Fashion Image</h2>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        Upload a picture of a garment or an entire outfit. StyleSense will detect the details, score your style, and query matching budget-aligned products.
      </p>

      {/* Drag & drop zone */}
      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-10 flex flex-col items-center text-center transition-all ${
            isDragOver 
              ? 'border-gold-500 bg-gold-500/5' 
              : 'border-white/10 bg-white/1 hover:border-gold-500/30 hover:bg-white/2'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            accept="image/*"
            className="hidden"
          />
          <div className="bg-white/5 p-4 rounded-full text-gold-400 border border-white/5 mb-4 hover:scale-110 transition-transform">
            <FiUploadCloud className="text-3xl" />
          </div>
          <span className="text-sm font-semibold text-slate-200 mb-1">
            Drag & drop your outfit photo here
          </span>
          <span className="text-xs text-slate-400">
            or click to browse local files (PNG, JPG, JPEG)
          </span>
        </div>
      ) : (
        <div className="relative rounded-xl border border-white/10 overflow-hidden bg-white/2 max-h-[300px] flex items-center justify-center mb-6">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="object-contain max-h-[300px] w-full"
          />
          <button
            onClick={clearSelection}
            className="absolute top-3 right-3 bg-slate-950/80 hover:bg-rose-600 border border-white/10 text-white p-2.5 rounded-lg transition-colors"
            title="Remove image"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      )}

      {/* Gender Selection */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-200">
          <FiUser className="text-gold-400" /> Target Gender / Preference
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setGender("Women's Fashion")}
            className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              gender === "Women's Fashion"
                ? 'bg-gold-500/10 border-gold-500 text-gold-400 shadow-md shadow-gold-500/5'
                : 'bg-white/1 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
            }`}
          >
            Women's Fashion
          </button>
          <button
            type="button"
            onClick={() => setGender("Men's Fashion")}
            className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              gender === "Men's Fashion"
                ? 'bg-gold-500/10 border-gold-500 text-gold-400 shadow-md shadow-gold-500/5'
                : 'bg-white/1 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
            }`}
          >
            Men's Fashion
          </button>
        </div>
      </div>

      {/* Budget configuration */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-200">
            <FiDollarSign className="text-gold-400" /> Max Budget Limit
          </div>
          <span className="text-base font-extrabold text-gold-400">
            ₹{budget.toLocaleString('en-IN')}
          </span>
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
        <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
          <span>₹500</span>
          <span>₹5,000</span>
          <span>₹10,000</span>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
        className={`w-full mt-8 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
          !selectedFile 
            ? 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 hover:scale-105 active:scale-95 shadow-lg shadow-gold-500/10'
        }`}
      >
        <FiCamera className="text-lg" />
        {isLoading ? 'Analyzing Outfit Aesthetics...' : 'Analyze Outfit Details'}
      </button>
    </div>
  );
}
