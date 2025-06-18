import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, Sparkles, BarChart3, FileText, Zap, Target, TrendingUp } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced sentiment detection with high accuracy"
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description: "Interactive charts and comprehensive reporting"
    },
    {
      icon: FileText,
      title: "Multi-Format Support",
      description: "Process PDF, Word, Excel, and text files"
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Instant analysis with detailed insights"
    }
  ];

  useEffect(() => {
    setShowLogo(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const TACLogo = () => (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: showLogo ? 1 : 0, rotate: showLogo ? 0 : -180 }}
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
        className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 blur-sm"
      />
      
      {/* Main Logo Container */}
      <div className="relative w-32 h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-full flex items-center justify-center border-4 border-emerald-400/30 shadow-2xl">
        {/* Animated Background Particles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-emerald-400/20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border border-blue-400/20"
        />
        
        {/* TAC Letters */}
        <div className="relative z-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"
          >
            TAC
          </motion.div>
        </div>
        
        {/* Floating Brain Icon */}
        <motion.div
          animate={{ 
            y: [-2, 2, -2],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Brain className="h-4 w-4 text-white" />
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
          className="absolute -top-1 -left-1"
        >
          <Sparkles className="h-4 w-4 text-yellow-400" />
        </motion.div>
        
        <motion.div
          animate={{ 
            scale: [0, 1, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: 1.5
          }}
          className="absolute -bottom-1 -right-1"
        >
          <Sparkles className="h-3 w-3 text-blue-400" />
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <TACLogo />
          </motion.div>

          {/* Title and Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
                TAC Analysis
              </span>
              <br />
              <span className="text-slate-300">Dashboard</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Transform your text data into actionable insights with our advanced 
              <span className="text-emerald-400 font-semibold"> AI-powered sentiment analysis</span> platform
            </p>
          </motion.div>

          {/* Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className={`p-6 rounded-2xl border transition-all duration-300 ${
                      currentFeature === index
                        ? 'bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-400/50 shadow-xl scale-105'
                        : 'bg-white/5 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <motion.div
                      animate={currentFeature === index ? { 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 0.5 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto ${
                        currentFeature === index
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-500'
                          : 'bg-slate-700'
                      }`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl font-bold text-emerald-400 mb-2"
              >
                99.2%
              </motion.div>
              <p className="text-slate-400">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="text-4xl font-bold text-blue-400 mb-2"
              >
                <Target className="h-8 w-8 inline mr-2" />
                Real-time
              </motion.div>
              <p className="text-slate-400">Processing Speed</p>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="text-4xl font-bold text-purple-400 mb-2"
              >
                <TrendingUp className="h-8 w-8 inline mr-2" />
                Advanced
              </motion.div>
              <p className="text-slate-400">AI Analytics</p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button
              onClick={onGetStarted}
              className="group relative px-12 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span className="text-lg">Start Analyzing</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </span>
              
              {/* Button Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-slate-500 text-sm mt-4"
            >
              No signup required • Start analyzing immediately
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 right-20 opacity-20"
      >
        <Brain className="h-16 w-16 text-emerald-400" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -15, 15, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute bottom-32 left-20 opacity-20"
      >
        <BarChart3 className="h-12 w-12 text-blue-400" />
      </motion.div>
    </div>
  );
};