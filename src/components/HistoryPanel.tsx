import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, Eye, Trash2 } from 'lucide-react';
import { AnalysisHistory } from '../types/sentiment';
import { format } from 'date-fns';

interface HistoryPanelProps {
  history: AnalysisHistory[];
  onLoadAnalysis: (item: AnalysisHistory) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoadAnalysis }) => {
  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/5 rounded-2xl shadow-xl p-6 border border-white/10 text-center backdrop-blur-sm"
      >
        <Clock className="h-12 w-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-white mb-2">Analysis History</h2>
        <p className="text-slate-300">Your previous analyses will appear here</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white/5 rounded-2xl shadow-xl p-6 border border-white/10 backdrop-blur-sm"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="h-5 w-5 text-emerald-400" />
        <h2 className="text-xl font-semibold text-white">Analysis History</h2>
        <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full">
          {history.length}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-white/10 rounded-xl p-4 hover:bg-white/5 transition-colors duration-200 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-white">{item.name}</span>
                  </div>
                  <div className="text-sm text-slate-400 mb-2">
                    {format(item.date, 'PPp')}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-slate-300">
                    <span>{item.analysis.summary.totalTexts} texts</span>
                    <span>{(item.analysis.summary.averageConfidence * 100).toFixed(0)}% avg confidence</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>{item.analysis.summary.sentimentDistribution.positive}+</span>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{item.analysis.summary.sentimentDistribution.negative}-</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onLoadAnalysis(item)}
                  className="flex items-center space-x-1 px-3 py-2 text-slate-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">View</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};