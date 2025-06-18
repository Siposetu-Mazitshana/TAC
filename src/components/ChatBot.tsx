import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot, User, X, Lightbulb, MessageSquare, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { SentimentResult } from '../types/sentiment';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  relatedSentiment?: SentimentResult;
  actionable?: boolean;
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
      // Dynamic welcome message based on current analysis
      const welcomeMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: generateWelcomeMessage(),
        timestamp: new Date(),
        actionable: true,
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, sentimentResults]);

  const generateWelcomeMessage = (): string => {
    if (sentimentResults.length === 0) {
      return "Hi! I'm your sentiment analysis assistant. Once you analyze some text, I can help you understand the results and craft appropriate responses. Upload some text or enter it manually to get started!";
    }

    const analysis = analyzeCurrentResults();
    let message = `Hi! I've analyzed your ${sentimentResults.length} text(s). Here's what I found:\n\n`;
    
    message += `📊 **Quick Overview:**\n`;
    message += `• ${analysis.positive} positive, ${analysis.negative} negative, ${analysis.neutral} neutral\n`;
    message += `• Average confidence: ${analysis.avgConfidence}%\n\n`;

    if (analysis.dominant === 'positive') {
      message += `🎉 Great news! Your content is predominantly positive. I can help you leverage this success!\n\n`;
    } else if (analysis.dominant === 'negative') {
      message += `⚠️ I notice some negative sentiment. Let me help you address these concerns effectively.\n\n`;
    } else {
      message += `📈 Your content shows mixed sentiment. I can help you optimize your approach.\n\n`;
    }

    message += `Ask me about:\n• Specific response strategies\n• Detailed text analysis\n• Improvement recommendations\n• Priority actions`;

    return message;
  };

  const analyzeCurrentResults = () => {
    const positive = sentimentResults.filter(r => r.sentiment === 'POSITIVE').length;
    const negative = sentimentResults.filter(r => r.sentiment === 'NEGATIVE').length;
    const neutral = sentimentResults.filter(r => r.sentiment === 'NEUTRAL').length;
    const avgConfidence = Math.round((sentimentResults.reduce((sum, r) => sum + r.confidence, 0) / sentimentResults.length) * 100);
    
    let dominant = 'neutral';
    if (positive > negative && positive > neutral) dominant = 'positive';
    else if (negative > positive && negative > neutral) dominant = 'negative';

    return { positive, negative, neutral, avgConfidence, dominant };
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (sentimentResults.length === 0) {
      return "I don't see any analysis results yet. Please analyze some text first, then I can provide detailed insights and recommendations based on your specific data!";
    }

    const analysis = analyzeCurrentResults();
    
    // Handle specific text queries
    const textNumberMatch = lowerMessage.match(/text\s*(\d+)/);
    if (textNumberMatch) {
      const textIndex = parseInt(textNumberMatch[1]) - 1;
      if (textIndex >= 0 && textIndex < sentimentResults.length) {
        return generateDetailedTextAnalysis(sentimentResults[textIndex], textIndex + 1);
      } else {
        return `I only have analysis for ${sentimentResults.length} text(s). Please specify a number between 1 and ${sentimentResults.length}.`;
      }
    }

    // Handle sentiment-specific questions with real data
    if (lowerMessage.includes('positive') || lowerMessage.includes('good')) {
      return generatePositiveAnalysis(analysis);
    }

    if (lowerMessage.includes('negative') || lowerMessage.includes('bad') || lowerMessage.includes('concern')) {
      return generateNegativeAnalysis(analysis);
    }

    if (lowerMessage.includes('neutral')) {
      return generateNeutralAnalysis(analysis);
    }

    // Priority and action-based queries
    if (lowerMessage.includes('priority') || lowerMessage.includes('urgent') || lowerMessage.includes('first')) {
      return generatePriorityActions(analysis);
    }

    if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('optimize')) {
      return generateImprovementSuggestions(analysis);
    }

    // Response strategy queries
    if (lowerMessage.includes('how to respond') || lowerMessage.includes('what to say') || lowerMessage.includes('response')) {
      return generateResponseStrategy(analysis);
    }

    // Summary and overview queries
    if (lowerMessage.includes('summary') || lowerMessage.includes('overview') || lowerMessage.includes('report')) {
      return generateComprehensiveSummary(analysis);
    }

    // Confidence and quality queries
    if (lowerMessage.includes('confidence') || lowerMessage.includes('accuracy') || lowerMessage.includes('reliable')) {
      return generateConfidenceAnalysis();
    }

    // Keyword and theme analysis
    if (lowerMessage.includes('keyword') || lowerMessage.includes('theme') || lowerMessage.includes('topic')) {
      return generateKeywordAnalysis();
    }

    // Trend and pattern analysis
    if (lowerMessage.includes('trend') || lowerMessage.includes('pattern') || lowerMessage.includes('insight')) {
      return generateTrendAnalysis();
    }

    // Default intelligent response based on current data
    return generateContextualResponse(analysis, lowerMessage);
  };

  const generateDetailedTextAnalysis = (result: SentimentResult, textNumber: number): string => {
    const text = result.text.length > 150 ? result.text.substring(0, 150) + '...' : result.text;
    const confidence = (result.confidence * 100).toFixed(1);
    
    let response = `📝 **Text ${textNumber} Deep Analysis:**\n\n`;
    response += `"${text}"\n\n`;
    
    response += `🎯 **Classification:** ${result.sentiment} (${confidence}% confidence)\n\n`;
    
    response += `📊 **Score Breakdown:**\n`;
    response += `• Positive: ${(result.scores.positive * 100).toFixed(1)}%\n`;
    response += `• Negative: ${(result.scores.negative * 100).toFixed(1)}%\n`;
    response += `• Neutral: ${(result.scores.neutral * 100).toFixed(1)}%\n\n`;
    
    if (result.keywords.length > 0) {
      response += `🔍 **Key Terms:** ${result.keywords.slice(0, 5).join(', ')}\n\n`;
    }
    
    response += `💡 **AI Explanation:** ${result.explanation}\n\n`;
    
    // Contextual recommendations based on sentiment
    switch (result.sentiment) {
      case 'POSITIVE':
        response += `✅ **Recommended Actions:**\n`;
        response += `• Amplify this positive feedback publicly\n`;
        response += `• Use as a testimonial or case study\n`;
        response += `• Thank the author and encourage sharing\n`;
        response += `• Identify what made this experience positive`;
        break;
        
      case 'NEGATIVE':
        response += `🚨 **Immediate Actions Required:**\n`;
        response += `• Respond within 2-4 hours if possible\n`;
        response += `• Acknowledge the specific concerns mentioned\n`;
        response += `• Offer concrete solutions or next steps\n`;
        response += `• Follow up to ensure resolution`;
        break;
        
      default:
        response += `📋 **Engagement Strategy:**\n`;
        response += `• Ask clarifying questions to understand needs\n`;
        response += `• Provide additional helpful information\n`;
        response += `• Guide toward a more positive experience\n`;
        response += `• Monitor for follow-up sentiment changes`;
        break;
    }
    
    return response;
  };

  const generatePositiveAnalysis = (analysis: any): string => {
    const positiveResults = sentimentResults.filter(r => r.sentiment === 'POSITIVE');
    
    if (positiveResults.length === 0) {
      return `I don't see any positive sentiment in your current analysis. This might be an opportunity to:\n\n• Review what could make experiences more positive\n• Look for neutral feedback that could be improved\n• Consider proactive engagement strategies`;
    }

    const avgPositiveConfidence = Math.round((positiveResults.reduce((sum, r) => sum + r.confidence, 0) / positiveResults.length) * 100);
    const topKeywords = getTopKeywords(positiveResults);
    
    let response = `🎉 **Positive Sentiment Analysis (${positiveResults.length} texts):**\n\n`;
    response += `📈 **Performance:** ${avgPositiveConfidence}% average confidence\n`;
    response += `📊 **Impact:** ${((positiveResults.length / sentimentResults.length) * 100).toFixed(1)}% of total feedback\n\n`;
    
    if (topKeywords.length > 0) {
      response += `🔥 **Success Drivers:** ${topKeywords.slice(0, 5).join(', ')}\n\n`;
    }
    
    response += `💪 **Leverage Strategies:**\n`;
    response += `• Feature these testimonials prominently\n`;
    response += `• Identify and replicate success patterns\n`;
    response += `• Engage with positive reviewers for case studies\n`;
    response += `• Use positive language patterns in marketing\n\n`;
    
    if (positiveResults.length > 1) {
      const highestConfidence = positiveResults.reduce((max, r) => r.confidence > max.confidence ? r : max);
      response += `⭐ **Star Feedback:** Your highest confidence positive text (${(highestConfidence.confidence * 100).toFixed(1)}%):\n`;
      response += `"${highestConfidence.text.substring(0, 100)}${highestConfidence.text.length > 100 ? '...' : ''}"`;
    }
    
    return response;
  };

  const generateNegativeAnalysis = (analysis: any): string => {
    const negativeResults = sentimentResults.filter(r => r.sentiment === 'NEGATIVE');
    
    if (negativeResults.length === 0) {
      return `🎉 Great news! No negative sentiment detected in your analysis. Your content is performing well! Consider:\n\n• Maintaining current quality standards\n• Monitoring for future negative trends\n• Proactively addressing neutral feedback`;
    }

    const avgNegativeConfidence = Math.round((negativeResults.reduce((sum, r) => sum + r.confidence, 0) / negativeResults.length) * 100);
    const topConcerns = getTopKeywords(negativeResults);
    
    let response = `⚠️ **Negative Sentiment Analysis (${negativeResults.length} texts):**\n\n`;
    response += `🎯 **Confidence Level:** ${avgNegativeConfidence}% average\n`;
    response += `📊 **Scope:** ${((negativeResults.length / sentimentResults.length) * 100).toFixed(1)}% of total feedback\n\n`;
    
    if (topConcerns.length > 0) {
      response += `🚨 **Key Concerns:** ${topConcerns.slice(0, 5).join(', ')}\n\n`;
    }
    
    response += `🛠️ **Immediate Action Plan:**\n`;
    response += `1. **Triage:** Address highest confidence negative feedback first\n`;
    response += `2. **Respond:** Acknowledge concerns within 24 hours\n`;
    response += `3. **Resolve:** Offer specific solutions or compensation\n`;
    response += `4. **Follow-up:** Ensure satisfaction after resolution\n\n`;
    
    response += `📝 **Response Templates:**\n`;
    response += `• "We sincerely apologize for your experience..."\n`;
    response += `• "Thank you for bringing this to our attention..."\n`;
    response += `• "We're committed to making this right..."\n\n`;
    
    if (negativeResults.length > 0) {
      const mostCritical = negativeResults.reduce((max, r) => r.confidence > max.confidence ? r : max);
      response += `🔥 **Most Critical Issue (${(mostCritical.confidence * 100).toFixed(1)}% confidence):**\n`;
      response += `"${mostCritical.text.substring(0, 100)}${mostCritical.text.length > 100 ? '...' : ''}"`;
    }
    
    return response;
  };

  const generateNeutralAnalysis = (analysis: any): string => {
    const neutralResults = sentimentResults.filter(r => r.sentiment === 'NEUTRAL');
    
    if (neutralResults.length === 0) {
      return `Your analysis shows clear sentiment polarization - no neutral feedback detected. This suggests:\n\n• Strong reactions (positive or negative)\n• Clear value propositions\n• Opportunity for more balanced engagement`;
    }

    const avgNeutralConfidence = Math.round((neutralResults.reduce((sum, r) => sum + r.confidence, 0) / neutralResults.length) * 100);
    
    let response = `📊 **Neutral Sentiment Analysis (${neutralResults.length} texts):**\n\n`;
    response += `🎯 **Confidence:** ${avgNeutralConfidence}% average\n`;
    response += `📈 **Opportunity:** ${((neutralResults.length / sentimentResults.length) * 100).toFixed(1)}% conversion potential\n\n`;
    
    response += `🚀 **Conversion Strategies:**\n`;
    response += `• Ask follow-up questions to understand needs\n`;
    response += `• Provide additional value or information\n`;
    response += `• Guide toward positive experiences\n`;
    response += `• Personalize engagement based on context\n\n`;
    
    response += `💡 **Engagement Approaches:**\n`;
    response += `• "Is there anything specific we can help you with?"\n`;
    response += `• "We'd love to hear more about your experience"\n`;
    response += `• "Here are some additional resources that might help"\n\n`;
    
    response += `📋 **Next Steps:**\n`;
    response += `• Monitor neutral feedback for sentiment shifts\n`;
    response += `• Implement proactive engagement strategies\n`;
    response += `• Track conversion rates from neutral to positive`;
    
    return response;
  };

  const generatePriorityActions = (analysis: any): string => {
    const negativeResults = sentimentResults.filter(r => r.sentiment === 'NEGATIVE');
    const lowConfidenceResults = sentimentResults.filter(r => r.confidence < 0.7);
    
    let response = `🎯 **Priority Action Dashboard:**\n\n`;
    
    if (negativeResults.length > 0) {
      const mostUrgent = negativeResults.reduce((max, r) => r.confidence > max.confidence ? r : max);
      response += `🚨 **URGENT - Negative Feedback:**\n`;
      response += `• ${negativeResults.length} negative sentiment(s) need immediate attention\n`;
      response += `• Highest priority: ${(mostUrgent.confidence * 100).toFixed(1)}% confidence negative\n`;
      response += `• Action: Respond within 2-4 hours\n\n`;
    }
    
    if (lowConfidenceResults.length > 0) {
      response += `⚠️ **MEDIUM - Low Confidence Results:**\n`;
      response += `• ${lowConfidenceResults.length} text(s) with <70% confidence\n`;
      response += `• Action: Manual review recommended\n`;
      response += `• May need human interpretation\n\n`;
    }
    
    const positiveResults = sentimentResults.filter(r => r.sentiment === 'POSITIVE');
    if (positiveResults.length > 0) {
      response += `✅ **OPPORTUNITY - Positive Leverage:**\n`;
      response += `• ${positiveResults.length} positive feedback(s) to amplify\n`;
      response += `• Action: Feature as testimonials\n`;
      response += `• Engage for case studies\n\n`;
    }
    
    response += `📋 **Recommended Sequence:**\n`;
    response += `1. Address all negative feedback immediately\n`;
    response += `2. Review low-confidence classifications\n`;
    response += `3. Leverage positive feedback for marketing\n`;
    response += `4. Engage neutral feedback for conversion`;
    
    return response;
  };

  const generateComprehensiveSummary = (analysis: any): string => {
    const totalTexts = sentimentResults.length;
    const avgConfidence = analysis.avgConfidence;
    const topKeywords = getTopKeywords(sentimentResults);
    
    let response = `📊 **Comprehensive Analysis Report:**\n\n`;
    response += `📈 **Dataset Overview:**\n`;
    response += `• Total texts analyzed: ${totalTexts}\n`;
    response += `• Average confidence: ${avgConfidence}%\n`;
    response += `• Analysis quality: ${avgConfidence >= 80 ? 'High' : avgConfidence >= 60 ? 'Medium' : 'Needs Review'}\n\n`;
    
    response += `🎯 **Sentiment Breakdown:**\n`;
    response += `• Positive: ${analysis.positive} (${((analysis.positive / totalTexts) * 100).toFixed(1)}%)\n`;
    response += `• Negative: ${analysis.negative} (${((analysis.negative / totalTexts) * 100).toFixed(1)}%)\n`;
    response += `• Neutral: ${analysis.neutral} (${((analysis.neutral / totalTexts) * 100).toFixed(1)}%)\n\n`;
    
    if (topKeywords.length > 0) {
      response += `🔍 **Key Themes:** ${topKeywords.slice(0, 8).join(', ')}\n\n`;
    }
    
    response += `📋 **Strategic Insights:**\n`;
    if (analysis.dominant === 'positive') {
      response += `• Strong positive sentiment dominance\n`;
      response += `• Focus on amplifying success factors\n`;
      response += `• Leverage for testimonials and marketing\n`;
    } else if (analysis.dominant === 'negative') {
      response += `• Negative sentiment requires immediate attention\n`;
      response += `• Implement crisis management protocols\n`;
      response += `• Focus on issue resolution and recovery\n`;
    } else {
      response += `• Mixed sentiment presents optimization opportunities\n`;
      response += `• Balance positive amplification with negative resolution\n`;
      response += `• Convert neutral feedback through engagement\n`;
    }
    
    response += `\n🎯 **Next Steps:**\n`;
    response += `• Review individual high-impact texts\n`;
    response += `• Implement sentiment-specific response strategies\n`;
    response += `• Monitor trends over time for improvements`;
    
    return response;
  };

  const generateConfidenceAnalysis = (): string => {
    const confidenceScores = sentimentResults.map(r => r.confidence);
    const avgConfidence = confidenceScores.reduce((sum, c) => sum + c, 0) / confidenceScores.length;
    const minConfidence = Math.min(...confidenceScores);
    const maxConfidence = Math.max(...confidenceScores);
    const lowConfidenceCount = confidenceScores.filter(c => c < 0.7).length;
    
    let response = `🎯 **Confidence & Reliability Analysis:**\n\n`;
    response += `📊 **Confidence Metrics:**\n`;
    response += `• Average: ${(avgConfidence * 100).toFixed(1)}%\n`;
    response += `• Range: ${(minConfidence * 100).toFixed(1)}% - ${(maxConfidence * 100).toFixed(1)}%\n`;
    response += `• Low confidence (<70%): ${lowConfidenceCount} texts\n\n`;
    
    response += `✅ **Reliability Assessment:**\n`;
    if (avgConfidence >= 0.8) {
      response += `• HIGH reliability - Results are highly trustworthy\n`;
      response += `• Confident in automated decision making\n`;
      response += `• Suitable for immediate action\n`;
    } else if (avgConfidence >= 0.6) {
      response += `• MEDIUM reliability - Generally trustworthy\n`;
      response += `• Consider human review for critical decisions\n`;
      response += `• Good for trend analysis\n`;
    } else {
      response += `• LOW reliability - Requires careful review\n`;
      response += `• Human oversight strongly recommended\n`;
      response += `• Use for preliminary insights only\n`;
    }
    
    if (lowConfidenceCount > 0) {
      response += `\n⚠️ **Low Confidence Texts:**\n`;
      response += `${lowConfidenceCount} text(s) need manual review. These might be:\n`;
      response += `• Ambiguous or sarcastic language\n`;
      response += `• Mixed sentiment within single text\n`;
      response += `• Complex or nuanced expressions\n`;
      response += `• Technical or domain-specific content`;
    }
    
    return response;
  };

  const generateKeywordAnalysis = (): string => {
    const allKeywords = sentimentResults.flatMap(r => r.keywords);
    const keywordFreq = allKeywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const sortedKeywords = Object.entries(keywordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    const positiveKeywords = sentimentResults
      .filter(r => r.sentiment === 'POSITIVE')
      .flatMap(r => r.keywords);
    const negativeKeywords = sentimentResults
      .filter(r => r.sentiment === 'NEGATIVE')
      .flatMap(r => r.keywords);
    
    let response = `🔍 **Keyword & Theme Analysis:**\n\n`;
    
    if (sortedKeywords.length > 0) {
      response += `📈 **Most Frequent Terms:**\n`;
      sortedKeywords.slice(0, 5).forEach(([keyword, count]) => {
        response += `• "${keyword}" (${count} times)\n`;
      });
      response += `\n`;
    }
    
    if (positiveKeywords.length > 0) {
      const topPositive = [...new Set(positiveKeywords)].slice(0, 5);
      response += `✅ **Positive Indicators:** ${topPositive.join(', ')}\n\n`;
    }
    
    if (negativeKeywords.length > 0) {
      const topNegative = [...new Set(negativeKeywords)].slice(0, 5);
      response += `⚠️ **Concern Indicators:** ${topNegative.join(', ')}\n\n`;
    }
    
    response += `💡 **Strategic Applications:**\n`;
    response += `• Use positive keywords in marketing copy\n`;
    response += `• Address negative keywords in improvements\n`;
    response += `• Monitor keyword trends over time\n`;
    response += `• Create content around popular themes`;
    
    return response;
  };

  const generateTrendAnalysis = (): string => {
    // Analyze patterns in the current dataset
    const timeOrderedResults = [...sentimentResults].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const confidenceTrend = timeOrderedResults.map(r => r.confidence);
    const sentimentPattern = timeOrderedResults.map(r => r.sentiment);
    
    let response = `📈 **Pattern & Trend Analysis:**\n\n`;
    
    // Confidence trend
    const avgEarlyConfidence = confidenceTrend.slice(0, Math.ceil(confidenceTrend.length / 2)).reduce((sum, c) => sum + c, 0) / Math.ceil(confidenceTrend.length / 2);
    const avgLateConfidence = confidenceTrend.slice(Math.floor(confidenceTrend.length / 2)).reduce((sum, c) => sum + c, 0) / Math.floor(confidenceTrend.length / 2);
    
    response += `🎯 **Confidence Trend:**\n`;
    if (avgLateConfidence > avgEarlyConfidence + 0.05) {
      response += `• Improving - Later texts show higher confidence\n`;
      response += `• Suggests clearer sentiment patterns\n`;
    } else if (avgEarlyConfidence > avgLateConfidence + 0.05) {
      response += `• Declining - Later texts show lower confidence\n`;
      response += `• May indicate more complex or mixed sentiment\n`;
    } else {
      response += `• Stable - Consistent confidence levels throughout\n`;
    }
    
    // Sentiment distribution patterns
    const firstHalf = sentimentPattern.slice(0, Math.ceil(sentimentPattern.length / 2));
    const secondHalf = sentimentPattern.slice(Math.floor(sentimentPattern.length / 2));
    
    const firstHalfPositive = firstHalf.filter(s => s === 'POSITIVE').length / firstHalf.length;
    const secondHalfPositive = secondHalf.filter(s => s === 'POSITIVE').length / secondHalf.length;
    
    response += `\n📊 **Sentiment Evolution:**\n`;
    if (secondHalfPositive > firstHalfPositive + 0.1) {
      response += `• Positive trend - Sentiment improving over time\n`;
      response += `• Recent feedback more favorable\n`;
    } else if (firstHalfPositive > secondHalfPositive + 0.1) {
      response += `• Negative trend - Sentiment declining over time\n`;
      response += `• Recent feedback less favorable\n`;
    } else {
      response += `• Stable pattern - Consistent sentiment distribution\n`;
    }
    
    response += `\n🔮 **Predictive Insights:**\n`;
    response += `• Monitor for continued trend direction\n`;
    response += `• Implement interventions if negative trends emerge\n`;
    response += `• Capitalize on positive momentum if improving\n`;
    response += `• Track correlation with external factors`;
    
    return response;
  };

  const generateContextualResponse = (analysis: any, userMessage: string): string => {
    // Generate intelligent response based on current analysis state and user query
    let response = `🤖 **AI Assistant Analysis:**\n\n`;
    
    response += `Based on your ${sentimentResults.length} analyzed texts, here's what I can help with:\n\n`;
    
    if (analysis.negative > 0) {
      response += `🚨 **Immediate Attention:** ${analysis.negative} negative sentiment(s) need response\n`;
    }
    
    if (analysis.positive > 0) {
      response += `🎉 **Opportunities:** ${analysis.positive} positive feedback(s) to leverage\n`;
    }
    
    if (analysis.neutral > 0) {
      response += `📈 **Potential:** ${analysis.neutral} neutral feedback(s) for conversion\n`;
    }
    
    response += `\n💡 **Try asking me:**\n`;
    response += `• "What should I prioritize first?"\n`;
    response += `• "How do I respond to the negative feedback?"\n`;
    response += `• "Show me detailed analysis of text 1"\n`;
    response += `• "What are the main themes in my data?"\n`;
    response += `• "Give me a comprehensive summary"\n\n`;
    
    response += `I'm here to help you turn these insights into actionable strategies!`;
    
    return response;
  };

  const getTopKeywords = (results: SentimentResult[]): string[] => {
    const allKeywords = results.flatMap(r => r.keywords);
    const keywordFreq = allKeywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(keywordFreq)
      .sort(([,a], [,b]) => b - a)
      .map(([keyword]) => keyword);
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

    // Simulate typing delay based on response complexity
    const responseComplexity = sentimentResults.length > 0 ? 1500 : 800;
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        actionable: botResponse.includes('**') || botResponse.includes('•'),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, responseComplexity + Math.random() * 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateSmartSuggestions = (): string[] => {
    if (sentimentResults.length === 0) {
      return [
        "How do I get started with analysis?",
        "What file formats do you support?",
        "Show me example insights you provide",
      ];
    }

    const analysis = analyzeCurrentResults();
    const suggestions = [];

    if (analysis.negative > 0) {
      suggestions.push("How should I handle the negative feedback?");
      suggestions.push("What are my priority actions?");
    }

    if (analysis.positive > 0) {
      suggestions.push("How can I leverage positive feedback?");
    }

    if (sentimentResults.length > 1) {
      suggestions.push("Give me a comprehensive summary");
      suggestions.push("What are the main themes?");
    }

    suggestions.push("Show me confidence analysis");
    suggestions.push("What trends do you see?");

    return suggestions.slice(0, 4);
  };

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
        {sentimentResults.length > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs text-white font-bold">{sentimentResults.length}</span>
          </motion.div>
        )}
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
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Sentiment Assistant</h3>
            <p className="text-xs text-slate-400">
              {sentimentResults.length > 0 
                ? `Analyzing ${sentimentResults.length} text${sentimentResults.length !== 1 ? 's' : ''}`
                : 'Ready to analyze'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {sentimentResults.length > 0 && (
            <div className="flex items-center space-x-1">
              {analyzeCurrentResults().negative > 0 && (
                <AlertTriangle className="h-4 w-4 text-red-400" />
              )}
              {analyzeCurrentResults().positive > 0 && (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              )}
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
          )}
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
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
              <div className={`flex items-start space-x-2 max-w-[85%] ${
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
                    : message.actionable
                    ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-white border border-emerald-500/30'
                    : 'bg-white/10 text-white border border-white/20'
                }`}>
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                  <p className="text-xs opacity-70 mt-2">
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

      {/* Smart Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex items-center space-x-1 mb-2">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-slate-400">Smart suggestions:</span>
          </div>
          <div className="space-y-1">
            {generateSmartSuggestions().slice(0, 2).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="w-full text-left text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg p-2 transition-colors duration-200 border border-white/10"
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
              placeholder={sentimentResults.length > 0 
                ? "Ask about your analysis results..." 
                : "Ask me about sentiment analysis..."
              }
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