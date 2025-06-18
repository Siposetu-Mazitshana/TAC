import { useState, useCallback } from 'react';
import { SentimentAnalysis, SentimentResult, AnalysisHistory } from '../types/sentiment';
import { sentimentApi } from '../services/sentimentApi';

export const useSentimentAnalysis = () => {
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);

  const analyzeTexts = useCallback(async (texts: string[], saveToHistory = true) => {
    if (texts.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const results = await sentimentApi.analyzeSentiment(texts);
      
      const newAnalysis: SentimentAnalysis = {
        results,
        summary: {
          totalTexts: results.length,
          averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
          sentimentDistribution: {
            positive: results.filter(r => r.sentiment === 'POSITIVE').length,
            negative: results.filter(r => r.sentiment === 'NEGATIVE').length,
            neutral: results.filter(r => r.sentiment === 'NEUTRAL').length,
          },
        },
      };

      setAnalysis(newAnalysis);

      if (saveToHistory) {
        const historyItem: AnalysisHistory = {
          id: `history-${Date.now()}`,
          name: `Analysis ${new Date().toLocaleString()}`,
          date: new Date(),
          analysis: newAnalysis,
        };
        setHistory(prev => [historyItem, ...prev].slice(0, 10)); // Keep last 10
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  const loadFromHistory = useCallback((historyItem: AnalysisHistory) => {
    setAnalysis(historyItem.analysis);
    setError(null);
  }, []);

  return {
    analysis,
    loading,
    error,
    history,
    analyzeTexts,
    clearAnalysis,
    loadFromHistory,
  };
};