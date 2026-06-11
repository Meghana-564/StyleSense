import React, { useState, useEffect } from 'react';
import TrendSection from '../components/TrendSection';
import Loader from '../components/Loader';
import api from '../api';
import { FiAlertCircle } from 'react-icons/fi';

export default function TrendsPage() {
  const [trends, setTrends] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrends = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const data = await api.getFashionTrends();
      setTrends(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch fashion trends. Serving styling guidelines fallback.');
      
      // Fallback fallback static object in case of complete API failure
      setTrends({
        trending_colors: [
          { name: "Sage Green", popularity: 88, hex: "#87A96B" },
          { name: "Midnight Charcoal", popularity: 82, hex: "#343E40" },
          { name: "Terracotta Rust", popularity: 79, hex: "#C35237" },
          { name: "Buttery Cream", popularity: 74, hex: "#F9F6EE" }
        ],
        trending_styles: [
          { name: "Oversized Fit Utility", description: "Multi-pocket cargo accents combined with boxy street tees." }
        ],
        seasonal_trends: [
          { name: "Linen Co-ord Sets", description: "Breezy and matching sets in lightweight pastel shades." }
        ],
        occasion_advice: [
          { occasion: "Dinner Outing", tips: ["Combine silk shirts with dark slim denim pants."] }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(false);
  }, []);

  return (
    <div className="w-full py-8 px-4 max-w-6xl mx-auto space-y-8">
      {/* Error display */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl max-w-2xl mx-auto flex items-start gap-3">
          <FiAlertCircle className="text-xl shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Trends Service Alert</h4>
            <p className="text-xs mt-1 text-rose-200">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <Loader type="spinner" message="Analyzing worldwide fashion trends..." />
      ) : (
        <TrendSection trends={trends} />
      )}
    </div>
  );
}
