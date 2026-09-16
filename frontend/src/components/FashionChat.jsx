import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiInfo } from 'react-icons/fi';
import { GiClothespin } from 'react-icons/gi';
import api from '../api';

export default function FashionChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am StyleSense AI, your personal luxury fashion assistant. Ask me anything about outfit recommendations, color combinations, styling details, trends, or wardrobe planning!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const styleSuggestions = [
    "How to style beige cargo pants?",
    "What goes well with a black kurti?",
    "Recommend a budget casual dinner outfit",
    "What color shoes match grey chinos?",
    "Explain summer fashion trends"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!textToSend) setInput('');

    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: query }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Prepare history structure for the API
      // Send last 8 messages to conserve tokens
      const history = updatedMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      const response = await api.chat(query, history);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: typeof error === 'string' ? error : 'I apologize, but I encountered an issue contacting the styling servers. Let\'s try that again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const isWarningMessage = (content) => {
    return content.includes("I am StyleSense AI and can only assist with fashion");
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col h-[75vh] glassmorphism rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative">
      {/* Chat header */}
      <div className="bg-white/3 border-b border-white/5 py-4 px-6 flex items-center gap-3">
        <div className="bg-gradient-to-tr from-gold-500 to-gold-600 p-2 rounded-xl text-[#07090e] shadow-lg shadow-gold-500/10">
          <GiClothespin className="text-lg" />
        </div>
        <div>
          <h2 className="font-bold text-slate-100 text-base leading-none">StyleSense AI Stylist</h2>
          <span className="text-xs text-gold-400 font-medium">Ready to style your outfit</span>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const isWarning = isWarningMessage(msg.content);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isUser 
                  ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' 
                  : isWarning
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    : 'bg-gold-500/10 border-gold-500/20 text-gold-400'
              }`}>
                {isUser ? <FiUser /> : <GiClothespin />}
              </div>

              {/* Message bubble */}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                isUser
                  ? 'bg-violet-600/15 border-violet-500/20 text-slate-100 rounded-tr-none'
                  : isWarning
                    ? 'bg-rose-600/10 border-rose-500/30 text-rose-200 shadow-md shadow-rose-500/5 rounded-tl-none font-medium'
                    : 'bg-white/5 border-white/5 text-slate-200 rounded-tl-none'
              }`}>
                {isWarning && (
                  <div className="flex items-center gap-2 text-rose-400 mb-1.5 font-bold text-xs uppercase tracking-wider">
                    <FiInfo className="text-sm" /> Restricted Topic
                  </div>
                )}
                {msg.content}
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
              <GiClothespin className="animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 rounded-tl-none flex items-center gap-1">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested queries */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-white/5 bg-white/1 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mr-1">Try asking:</span>
          {styleSuggestions.map((suggest, index) => (
            <button
              key={index}
              onClick={() => handleSend(suggest)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/30 text-slate-300 hover:text-gold-200 transition-all"
            >
              {suggest}
            </button>
          ))}
        </div>
      )}

      {/* Input container */}
      <div className="p-4 border-t border-white/5 bg-white/2 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Consult your stylist about colors, clothing, trends..."
          className="flex-1 bg-white/5 border border-white/5 hover:border-white/10 focus:border-gold-500/50 outline-none rounded-xl px-4 py-3.5 text-sm placeholder-slate-500 text-slate-100 transition-all"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSend()}
          className="bg-gradient-to-r from-gold-500 to-gold-600 hover:scale-105 active:scale-95 text-[#07090e] p-3.5 rounded-xl transition-all shadow-md shadow-gold-500/10"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          <FiSend className="text-base" />
        </button>
      </div>
    </div>
  );
}
