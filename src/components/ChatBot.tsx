import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot, User, X, Lightbulb, MessageSquare } from 'lucide-react';
import { SentimentResult } from '../types/sentiment';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  relatedSentiment?: SentimentResult;
}

interface ChatBotProps {
  sentimentResults: SentimentResult[];
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ sentimentResults, isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when chat opens
      const welcomeMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "Hi! I'm your sentiment analysis assistant. I can help you craft appropriate responses based on the sentiment analysis results. Try asking me about specific texts or how to respond to different sentiments!",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user is asking about a specific text number
    const textNumberMatch = lowerMessage.match(/text\s*(\d+)/);
    if (textNumberMatch) {
      const textIndex = parseInt(textNumberMatch[1]) - 1;
      if (textIndex >= 0 && textIndex < sentimentResults.length) {
        const result = sentimentResults[textIndex];
        return generateResponseForSentiment(result);
      }
    }

    // Check for sentiment-specific questions
    if (lowerMessage.includes('positive') || lowerMessage.includes('good')) {
      const positiveResults = sentimentResults.filter(r => r.sentiment === 'POSITIVE');
      if (positiveResults.length > 0) {
        return `Great! I found ${positiveResults.length} positive sentiment(s). For positive feedback, consider responses like: "Thank you for your positive feedback!", "We're delighted to hear this!", or "Your satisfaction means everything to us!"`;
      }
    }

    if (lowerMessage.includes('negative') || lowerMessage.includes('bad')) {
      const negativeResults = sentimentResults.filter(r => r.sentiment === 'NEGATIVE');
      if (negativeResults.length > 0) {
        return `I found ${negativeResults.length} negative sentiment(s). For negative feedback, try: "We sincerely apologize for your experience", "Thank you for bringing this to our attention", or "We're committed to making this right for you."`;
      }
    }

    if (lowerMessage.includes('neutral')) {
      const neutralResults = sentimentResults.filter(r => r.sentiment === 'NEUTRAL');
      if (neutralResults.length > 0) {
        return `There are ${neutralResults.length} neutral sentiment(s). For neutral feedback, consider: "Thank you for your feedback", "We appreciate you taking the time to share", or "Is there anything specific we can help you with?"`;
      }
    }

    // General response suggestions
    if (lowerMessage.includes('how to respond') || lowerMessage.includes('what to say')) {
      return generateGeneralResponseSuggestions();
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
      return generateSummaryResponse();
    }

    // Default helpful response
    return "I can help you with response suggestions! Try asking me:\n• 'How should I respond to text 1?'\n• 'What about the negative feedback?'\n• 'Give me a summary of all sentiments'\n• 'How to respond to positive comments?'";
  };

  const generateResponseForSentiment = (result: SentimentResult): string => {
    const confidence = (result.confidence * 100).toFixed(1);
    const text = result.text.length > 100 ? result.text.substring(0, 100) + '...' : result.text;
    
    let response = `For the text: "${text}"\n\n`;
    response += `Sentiment: ${result.sentiment} (${confidence}% confidence)\n\n`;
    
    switch (result.sentiment) {
      case 'POSITIVE':
        response += "🎉 Suggested responses:\n";
        response += "• 'Thank you so much for your wonderful feedback!'\n";
        response += "• 'We're thrilled to hear about your positive experience!'\n";
        response += "• 'Your kind words truly make our day!'";
        if (result.keywords.length > 0) {
          response += `\n\n💡 Key terms to acknowledge: ${result.keywords.slice(0, 3).join(', ')}`;
        }
        break;
        
      case 'NEGATIVE':
        response += "🤝 Suggested responses:\n";
        response += "• 'We sincerely apologize for your disappointing experience.'\n";
        response += "• 'Thank you for bringing this to our attention. We take this seriously.'\n";
        response += "• 'We'd like to make this right. Please let us know how we can help.'";
        if (result.keywords.length > 0) {
          response += `\n\n⚠️ Address these concerns: ${result.keywords.slice(0, 3).join(', ')}`;
        }
        break;
        
      default:
        response += "💬 Suggested responses:\n";
        response += "• 'Thank you for taking the time to share your feedback.'\n";
        response += "• 'We appreciate your input and will consider it carefully.'\n";
        response += "• 'Is there anything specific we can help you with?'";
        break;
    }
    
    return response;
  };

  const generateGeneralResponseSuggestions = (): string => {
    const positive = sentimentResults.filter(r => r.sentiment === 'POSITIVE').length;
    const negative = sentimentResults.filter(r => r.sentiment === 'NEGATIVE').length;
    const neutral = sentimentResults.filter(r => r.sentiment === 'NEUTRAL').length;
    
    let response = "📊 Response Strategy Overview:\n\n";
    
    if (positive > 0) {
      response += `✅ ${positive} Positive feedback(s):\n`;
      response += "• Express gratitude and appreciation\n";
      response += "• Share the feedback with your team\n";
      response += "• Encourage continued engagement\n\n";
    }
    
    if (negative > 0) {
      response += `❌ ${negative} Negative feedback(s):\n`;
      response += "• Acknowledge the issue promptly\n";
      response += "• Apologize sincerely and take responsibility\n";
      response += "• Offer concrete solutions or next steps\n\n";
    }
    
    if (neutral > 0) {
      response += `➖ ${neutral} Neutral feedback(s):\n`;
      response += "• Thank them for their time\n";
      response += "• Ask clarifying questions if needed\n";
      response += "• Provide additional helpful information\n\n";
    }
    
    response += "💡 Pro tip: Always respond within 24 hours and personalize your responses!";
    
    return response;
  };

  const generateSummaryResponse = (): string => {
    const total = sentimentResults.length;
    const positive = sentimentResults.filter(r => r.sentiment === 'POSITIVE').length;
    const negative = sentimentResults.filter(r => r.sentiment === 'NEGATIVE').length;
    const neutral = sentimentResults.filter(r => r.sentiment === 'NEUTRAL').length;
    
    const avgConfidence = sentimentResults.reduce((sum, r) => sum + r.confidence, 0) / total;
    
    let response = `📈 Analysis Summary (${total} texts):\n\n`;
    response += `• Positive: ${positive} (${((positive/total)*100).toFixed(1)}%)\n`;
    response += `• Negative: ${negative} (${((negative/total)*100).toFixed(1)}%)\n`;
    response += `• Neutral: ${neutral} (${((neutral/total)*100).toFixed(1)}%)\n`;
    response += `• Average Confidence: ${(avgConfidence*100).toFixed(1)}%\n\n`;
    
    if (positive > negative) {
      response += "🎉 Overall sentiment is positive! Focus on:\n";
      response += "• Thanking customers for positive feedback\n";
      response += "• Sharing success stories with your team\n";
    } else if (negative > positive) {
      response += "⚠️ More negative feedback detected. Priority actions:\n";
      response += "• Address negative feedback immediately\n";
      response += "• Identify common issues and fix them\n";
    } else {
      response += "⚖️ Mixed sentiment detected. Balanced approach:\n";
      response += "• Celebrate the positives\n";
      response += "• Address the negatives promptly\n";
    }
    
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How should I respond to negative feedback?",
    "Give me a summary of all sentiments",
    "What about the positive comments?",
    "How to respond to text 1?",
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <MessageCircle className="h-6 w-6" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-white font-bold">!</span>
        </motion.div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Response Assistant</h3>
            <p className="text-xs text-slate-400">AI-powered sentiment guidance</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-emerald-500' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl p-3 ${
                  message.type === 'user'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-white border border-white/20'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white/10 rounded-2xl p-3 border border-white/20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex items-center space-x-1 mb-2">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-slate-400">Try asking:</span>
          </div>
          <div className="space-y-1">
            {suggestedQuestions.slice(0, 2).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="w-full text-left text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg p-2 transition-colors duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about sentiment responses..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '80px' }}
            />
          </div>
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: inputValue.trim() && !isTyping ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};