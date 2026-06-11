import React from 'react';
import Hero from '../components/Hero';

export default function Home({ setActiveTab }) {
  return (
    <div className="w-full">
      <Hero setActiveTab={setActiveTab} />
    </div>
  );
}
