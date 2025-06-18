import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Header } from './components/Header';
import { TextInput } from './components/TextInput';
import { SentimentCard } from './components/SentimentCard';
import { SentimentChart } from './components/SentimentChart';
import { ExportPanel } from './components/ExportPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { ChatBot } from './components/ChatBot';
import { useSentimentAnalysis } from './hooks/useSentimentAnalysis';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const {
    analysis,
    loading,
    error,
    history,
    analyzeTexts,
    clearAnalysis,
    loadFromHistory,
  } = useSentimentAnalysis();

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const toggleChatBot = () => {
    setChatBotOpen(!chatBotOpen);
  };

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements - Same as welcome page */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Header with relative positioning */}
      <div className="relative z-10">
        <Header />
      </div>
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input and History */}
          <div className="lg:col-span-1 space-y-8">
            <TextInput onAnalyze={analyzeTexts} loading={loading} />
            <HistoryPanel history={history} onLoadAnalysis={loadFromHistory} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm"
              >
                <p className="font-medium">Analysis Error</p>
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {analysis ? (
              <>
                <SentimentChart analysis={analysis} />
                <ExportPanel analysis={analysis} />
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Detailed Results</h2>
                    <button
                      onClick={clearAnalysis}
                      className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                    >
                      Clear Results
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {analysis.results.map((result, index) => (
                      <SentimentCard key={result.id} result={result} index={index} />
                    ))}
                  </div>
                </div>
              </>
            ) : !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-2xl shadow-xl p-12 border border-white/10 text-center backdrop-blur-sm"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🧠</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ready for Analysis
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Enter text in the input panel to start analyzing sentiment patterns and emotional tone.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-1 border border-emerald-500/30">
                        <span className="text-emerald-400">😊</span>
                      </div>
                      <span className="text-slate-300">Positive</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-1 border border-amber-500/30">
                        <span className="text-amber-400">😐</span>
                      </div>
                      <span className="text-slate-300">Neutral</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-1 border border-red-500/30">
                        <span className="text-red-400">😞</span>
                      </div>
                      <span className="text-slate-300">Negative</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* ChatBot Component */}
      <AnimatePresence>
        <ChatBot 
          sentimentResults={analysis?.results || []} 
          isOpen={chatBotOpen}
          onToggle={toggleChatBot}
        />
      </AnimatePresence>
    </div>
  );
}

export default App;