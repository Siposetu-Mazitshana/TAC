import React from 'react';
import { Brain, BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const TACLogo = () => (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 1, ease: "backOut" }}
      className="relative"
    >
      {/* Outer Ring with Pulse */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 blur-sm"
      />
      
      {/* Main Logo Container */}
      <div className="relative w-12 h-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-full flex items-center justify-center border-2 border-emerald-400/30 shadow-2xl">
        {/* Animated Background Particles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-1 rounded-full border border-emerald-400/20"
        />
        
        {/* TAC Letters */}
        <div className="relative z-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"
          >
            TAC
          </motion.div>
        </div>
        
        {/* Floating Brain Icon */}
        <motion.div
          animate={{ 
            y: [-1, 1, -1],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Brain className="h-2 w-2 text-white" />
        </motion.div>
        
        {/* Sparkle Effects */}
        <motion.div
          animate={{ 
            scale: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: 1
          }}
          className="absolute -top-0.5 -left-0.5"
        >
          <Sparkles className="h-2 w-2 text-yellow-400" />
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <motion.header 
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-white/10 backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TACLogo />
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
                TAC Analysis Dashboard
              </h1>
              <p className="text-slate-300 text-sm">Advanced text emotion analytics platform</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">Real-time Analytics</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};