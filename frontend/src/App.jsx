import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import AnalysisPage from './pages/AnalysisPage';
import OutfitsPage from './pages/OutfitsPage';
import ProductsPage from './pages/ProductsPage';
import TrendsPage from './pages/TrendsPage';
import SignPage from './pages/SignPage';
import ColorPalettePage from './pages/ColorPalettePage';
import StyleQuizPage from './pages/StyleQuizPage';
import OutfitHistoryPage from './pages/OutfitHistoryPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(() => {
    const session = localStorage.getItem('stylesense_session');
    return session ? JSON.parse(session) : null;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('stylesense_theme') || 'dark');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('stylesense_theme', next);
  };

  const handleAuth = (userData) => setUser(userData);

  const handleSignOut = () => {
    localStorage.removeItem('stylesense_session');
    setUser(null);
  };

  if (!user) return <SignPage onAuth={handleAuth} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'chat':
        return <ChatPage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'outfits':
        return <OutfitsPage />;
      case 'products':
        return <ProductsPage />;
      case 'trends':
        return <TrendsPage />;
      case 'palette':
        return <ColorPalettePage />;
      case 'quiz':
        return <StyleQuizPage />;
      case 'history':
        return <OutfitHistoryPage />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={`${theme === 'light' ? 'light' : ''} min-h-screen ${theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#f5f3ee] text-[#1a1a2e]'} flex flex-col justify-between selection:bg-gold-500/20 selection:text-gold-200`}>
      <div className="flex-1 flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onSignOut={handleSignOut} theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-grow">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
}
