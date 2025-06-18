import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Minus, Tag } from 'lucide-react';
import { SentimentResult } from '../types/sentiment';

interface SentimentCardProps {
  result: SentimentResult;
  index: number;
}

export const SentimentCard: React.FC<SentimentCardProps> = ({ result, index }) => {
  const getSentimentIcon = () => {
    switch (result.sentiment) {
      case 'POSITIVE':
        return <ThumbsUp className="h-5 w-5" />;
      case 'NEGATIVE':
        return <ThumbsDown className="h-5 w-5" />;
      default:
        return <Minus className="h-5 w-5" />;
    }
  };

  const getSentimentColor = () => {
    switch (result.sentiment) {
      case 'POSITIVE':
        return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30';
      case 'NEGATIVE':
        return 'text-red-300 bg-red-500/20 border-red-500/30';
      default:
        return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
    }
  };

  const getProgressColor = () => {
    switch (result.sentiment) {
      case 'POSITIVE':
        return 'bg-emerald-500';
      case 'NEGATIVE':
        return 'bg-red-500';
      default:
        return 'bg-amber-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white/5 rounded-xl shadow-lg border border-white/10 p-6 hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getSentimentColor()}`}>
          {getSentimentIcon()}
          <span className="font-semibold text-sm uppercase">
            {result.sentiment}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {(result.confidence * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400">Confidence</div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-slate-200 leading-relaxed line-clamp-3">
          "{result.text}"
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Sentiment Scores</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs w-16 text-emerald-400">Positive</span>
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${result.scores.positive * 100}%` }}
              />
            </div>
            <span className="text-xs w-12 text-right text-slate-300">{(result.scores.positive * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs w-16 text-red-400">Negative</span>
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${result.scores.negative * 100}%` }}
              />
            </div>
            <span className="text-xs w-12 text-right text-slate-300">{(result.scores.negative * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs w-16 text-amber-400">Neutral</span>
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${result.scores.neutral * 100}%` }}
              />
            </div>
            <span className="text-xs w-12 text-right text-slate-300">{(result.scores.neutral * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {result.keywords.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-1 mb-2">
            <Tag className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-400">Key Terms</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {result.keywords.map((keyword, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded-full border border-white/20"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-slate-400 border-t border-white/10 pt-3">
        <p className="italic">{result.explanation}</p>
        <p className="mt-1">Analyzed: {result.timestamp.toLocaleString()}</p>
      </div>
    </motion.div>
  );
};