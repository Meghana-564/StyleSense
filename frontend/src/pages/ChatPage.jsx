import React from 'react';
import FashionChat from '../components/FashionChat';

export default function ChatPage() {
  return (
    <div className="w-full py-8 px-4 flex flex-col items-center">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">AI Stylist Consultations</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Discuss styling advice, color harmonics, wardrobe planning, and fashion ideas with our strict fashion chatbot.
        </p>
      </div>
      <FashionChat />
    </div>
  );
}
