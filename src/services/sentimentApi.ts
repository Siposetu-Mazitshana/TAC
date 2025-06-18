import { SentimentResult } from '../types/sentiment';

// Mock API service - replace with actual Hugging Face API integration
class SentimentApiService {
  private static instance: SentimentApiService;
  private apiKey = 'demo'; // Replace with actual API key

  static getInstance(): SentimentApiService {
    if (!SentimentApiService.instance) {
      SentimentApiService.instance = new SentimentApiService();
    }
    return SentimentApiService.instance;
  }

  async analyzeSentiment(texts: string[]): Promise<SentimentResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    return texts.map((text, index) => {
      const mockSentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] as const;
      const sentiment = mockSentiments[Math.floor(Math.random() * 3)];
      
      const baseScore = Math.random() * 0.6 + 0.4; // 0.4 to 1.0
      const scores = {
        positive: sentiment === 'POSITIVE' ? baseScore : Math.random() * 0.4,
        negative: sentiment === 'NEGATIVE' ? baseScore : Math.random() * 0.4,
        neutral: sentiment === 'NEUTRAL' ? baseScore : Math.random() * 0.4,
      };

      // Extract mock keywords
      const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 3);
      const keywords = words.slice(0, Math.min(5, words.length));

      return {
        id: `analysis-${Date.now()}-${index}`,
        text,
        sentiment,
        confidence: Math.max(...Object.values(scores)),
        scores,
        keywords,
        timestamp: new Date(),
        explanation: this.generateExplanation(sentiment, keywords),
      };
    });
  }

  private generateExplanation(sentiment: string, keywords: string[]): string {
    const keywordText = keywords.length > 0 ? `Key terms like "${keywords.slice(0, 2).join('", "')}" ` : '';
    
    switch (sentiment) {
      case 'POSITIVE':
        return `${keywordText}indicate positive sentiment through optimistic language and favorable expressions.`;
      case 'NEGATIVE':
        return `${keywordText}suggest negative sentiment with critical or unfavorable language patterns.`;
      default:
        return `${keywordText}present neutral sentiment without strong emotional indicators.`;
    }
  }
}

export const sentimentApi = SentimentApiService.getInstance();