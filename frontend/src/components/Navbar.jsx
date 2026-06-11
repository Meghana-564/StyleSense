import React, { useState } from 'react';
import { GiClothespin } from 'react-icons/gi';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar({ activeTab, setActiveTab, user, onSignOut, theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'chat', label: 'AI Stylist Chat' },
    { id: 'analysis', label: 'Image Analysis' },
    { id: 'outfits', label: 'Outfit Builder' },
    { id: 'products', label: 'Similar Products' },
    { id: 'trends', label: 'Fashion Trends' },
    { id: 'palette', label: 'Color Palette' },
    { id: 'quiz', label: 'Style Quiz' },
    { id: 'history', label: 'My History' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glassmorphism border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
      {/* Brand logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setActiveTab('home')}
      >
        <div className="bg-gradient-to-tr from-gold-600 to-gold-400 p-2 rounded-lg text-[#07090e] shadow-lg shadow-gold-500/20">
          <GiClothespin className="text-xl" />
        </div>
        <span className="font-extrabold text-2xl tracking-wide gold-text-gradient">
          StyleSense
        </span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 shadow-md shadow-gold-500/10 font-semibold scale-105'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* User + Sign Out */}
      {user && (
        <div className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
          <span className="text-sm text-slate-400">
            Hi, <span className="text-gold-400 font-semibold">{user.name.split(' ')[0]}</span>
          </span>
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="p-2 rounded-full text-slate-400 hover:text-gold-400 hover:bg-white/5 border border-white/[0.06] transition-all duration-300"
          >
            {theme === 'dark' ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
          </button>
          <button
            onClick={onSignOut}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/[0.06] hover:border-red-500/20 transition-all duration-300"
          >
            <FiLogOut className="text-sm" />
            Sign Out
          </button>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-200 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-[73px] left-0 w-full glassmorphism border-b border-white/10 flex flex-col p-4 lg:hidden gap-2 z-40 transition-all duration-300">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          {user && (
            <>
              <button
                onClick={() => { toggleTheme(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 transition-all flex items-center gap-2"
              >
                {theme === 'dark' ? <FiSun /> : <FiMoon />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={() => { onSignOut(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
              >
                <FiLogOut /> Sign Out ({user.name.split(' ')[0]})
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
