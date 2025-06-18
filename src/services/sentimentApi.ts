import { SentimentResult } from '../types/sentiment';

// Enhanced sentiment analysis service with real text processing
class SentimentApiService {
  private static instance: SentimentApiService;

  // Comprehensive sentiment dictionaries
  private positiveWords = new Set([
    'amazing', 'awesome', 'excellent', 'fantastic', 'great', 'wonderful', 'perfect', 'outstanding',
    'brilliant', 'superb', 'magnificent', 'marvelous', 'incredible', 'spectacular', 'phenomenal',
    'love', 'like', 'enjoy', 'appreciate', 'adore', 'cherish', 'treasure', 'value',
    'happy', 'joy', 'pleased', 'satisfied', 'delighted', 'thrilled', 'excited', 'elated',
    'good', 'nice', 'fine', 'well', 'better', 'best', 'superior', 'quality',
    'success', 'successful', 'achieve', 'accomplished', 'victory', 'win', 'triumph',
    'beautiful', 'attractive', 'gorgeous', 'stunning', 'elegant', 'lovely', 'pretty',
    'helpful', 'useful', 'beneficial', 'valuable', 'worthwhile', 'effective', 'efficient',
    'recommend', 'praise', 'compliment', 'congratulate', 'thank', 'grateful', 'thankful',
    'smooth', 'easy', 'simple', 'convenient', 'comfortable', 'pleasant', 'enjoyable',
    'fast', 'quick', 'rapid', 'speedy', 'prompt', 'timely', 'efficient',
    'reliable', 'trustworthy', 'dependable', 'consistent', 'stable', 'secure',
    'innovative', 'creative', 'original', 'unique', 'special', 'exceptional',
    'affordable', 'reasonable', 'fair', 'cheap', 'economical', 'budget-friendly'
  ]);

  private negativeWords = new Set([
    'awful', 'terrible', 'horrible', 'disgusting', 'pathetic', 'useless', 'worthless',
    'bad', 'poor', 'worst', 'inferior', 'subpar', 'mediocre', 'disappointing',
    'hate', 'dislike', 'despise', 'loathe', 'detest', 'abhor', 'resent',
    'angry', 'mad', 'furious', 'upset', 'annoyed', 'irritated', 'frustrated',
    'sad', 'depressed', 'miserable', 'unhappy', 'gloomy', 'devastated', 'heartbroken',
    'fail', 'failure', 'failed', 'unsuccessful', 'defeat', 'lose', 'loss',
    'problem', 'issue', 'trouble', 'difficulty', 'challenge', 'obstacle', 'barrier',
    'slow', 'sluggish', 'delayed', 'late', 'overdue', 'behind', 'lagging',
    'expensive', 'costly', 'overpriced', 'unaffordable', 'pricey', 'steep',
    'broken', 'damaged', 'defective', 'faulty', 'malfunctioning', 'buggy',
    'confusing', 'complicated', 'difficult', 'hard', 'complex', 'unclear',
    'rude', 'impolite', 'disrespectful', 'unprofessional', 'inappropriate',
    'unreliable', 'untrustworthy', 'inconsistent', 'unstable', 'insecure',
    'boring', 'dull', 'tedious', 'monotonous', 'uninteresting', 'bland',
    'wrong', 'incorrect', 'false', 'inaccurate', 'mistaken', 'error'
  ]);

  private intensifiers = new Set([
    'very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally',
    'really', 'quite', 'rather', 'pretty', 'fairly', 'somewhat',
    'highly', 'deeply', 'truly', 'genuinely', 'seriously', 'definitely'
  ]);

  private negators = new Set([
    'not', 'no', 'never', 'nothing', 'nobody', 'nowhere', 'neither',
    'none', 'cannot', 'can\'t', 'won\'t', 'wouldn\'t', 'shouldn\'t',
    'don\'t', 'doesn\'t', 'didn\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t'
  ]);

  static getInstance(): SentimentApiService {
    if (!SentimentApiService.instance) {
      SentimentApiService.instance = new SentimentApiService();
    }
    return SentimentApiService.instance;
  }

  async analyzeSentiment(texts: string[]): Promise<SentimentResult[]> {
    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    return texts.map((text, index) => {
      const analysis = this.analyzeTextSentiment(text);
      
      return {
        id: `analysis-${Date.now()}-${index}`,
        text,
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        scores: analysis.scores,
        keywords: analysis.keywords,
        timestamp: new Date(),
        explanation: analysis.explanation,
      };
    });
  }

  private analyzeTextSentiment(text: string) {
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    
    let positiveScore = 0;
    let negativeScore = 0;
    let totalWords = words.length;
    
    const foundKeywords: string[] = [];
    const sentimentWords: string[] = [];
    
    // Analyze each word with context
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const prevWord = i > 0 ? words[i - 1] : '';
      const nextWord = i < words.length - 1 ? words[i + 1] : '';
      
      let wordScore = 0;
      let isNegated = false;
      
      // Check for negation in previous 2 words
      for (let j = Math.max(0, i - 2); j < i; j++) {
        if (this.negators.has(words[j])) {
          isNegated = true;
          break;
        }
      }
      
      // Calculate base sentiment score
      if (this.positiveWords.has(word)) {
        wordScore = 1;
        sentimentWords.push(word);
      } else if (this.negativeWords.has(word)) {
        wordScore = -1;
        sentimentWords.push(word);
      }
      
      // Apply intensifier multiplier
      if (wordScore !== 0) {
        let multiplier = 1;
        if (this.intensifiers.has(prevWord)) {
          multiplier = 1.5;
        }
        
        // Apply negation
        if (isNegated) {
          wordScore *= -1;
        }
        
        wordScore *= multiplier;
        
        if (wordScore > 0) {
          positiveScore += wordScore;
        } else {
          negativeScore += Math.abs(wordScore);
        }
        
        foundKeywords.push(word);
      }
    }
    
    // Extract additional meaningful keywords (nouns, adjectives)
    const additionalKeywords = this.extractMeaningfulWords(words, foundKeywords);
    const allKeywords = [...new Set([...foundKeywords, ...additionalKeywords])].slice(0, 8);
    
    // Normalize scores
    const totalSentimentWords = positiveScore + negativeScore;
    
    if (totalSentimentWords === 0) {
      // No sentiment words found - classify as neutral
      return {
        sentiment: 'NEUTRAL' as const,
        confidence: 0.6 + Math.random() * 0.2, // 60-80% confidence for neutral
        scores: {
          positive: 0.33,
          negative: 0.33,
          neutral: 0.34
        },
        keywords: allKeywords,
        explanation: this.generateExplanation('NEUTRAL', allKeywords, 'No strong sentiment indicators found')
      };
    }
    
    // Calculate final scores
    const positiveRatio = positiveScore / totalSentimentWords;
    const negativeRatio = negativeScore / totalSentimentWords;
    
    // Determine sentiment with thresholds
    let sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    let confidence: number;
    
    if (positiveRatio > 0.6) {
      sentiment = 'POSITIVE';
      confidence = Math.min(0.95, 0.7 + positiveRatio * 0.25);
    } else if (negativeRatio > 0.6) {
      sentiment = 'NEGATIVE';
      confidence = Math.min(0.95, 0.7 + negativeRatio * 0.25);
    } else if (Math.abs(positiveRatio - negativeRatio) < 0.2) {
      sentiment = 'NEUTRAL';
      confidence = 0.65 + Math.random() * 0.15;
    } else if (positiveRatio > negativeRatio) {
      sentiment = 'POSITIVE';
      confidence = 0.6 + (positiveRatio - negativeRatio) * 0.3;
    } else {
      sentiment = 'NEGATIVE';
      confidence = 0.6 + (negativeRatio - positiveRatio) * 0.3;
    }
    
    // Create normalized score distribution
    const scores = this.createScoreDistribution(sentiment, confidence);
    
    return {
      sentiment,
      confidence,
      scores,
      keywords: allKeywords,
      explanation: this.generateExplanation(sentiment, allKeywords, this.getAnalysisReason(positiveScore, negativeScore, sentimentWords))
    };
  }
  
  private extractMeaningfulWords(words: string[], sentimentWords: string[]): string[] {
    // Common stop words to exclude
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
      'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this',
      'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
      'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
    ]);
    
    return words
      .filter(word => 
        word.length > 3 && 
        !stopWords.has(word) && 
        !sentimentWords.includes(word) &&
        !this.negators.has(word) &&
        !this.intensifiers.has(word)
      )
      .slice(0, 5);
  }
  
  private createScoreDistribution(sentiment: string, confidence: number) {
    const baseScore = confidence;
    const remainingScore = 1 - baseScore;
    
    switch (sentiment) {
      case 'POSITIVE':
        return {
          positive: baseScore,
          negative: remainingScore * 0.2,
          neutral: remainingScore * 0.8
        };
      case 'NEGATIVE':
        return {
          positive: remainingScore * 0.2,
          negative: baseScore,
          neutral: remainingScore * 0.8
        };
      default: // NEUTRAL
        return {
          positive: remainingScore * 0.4,
          negative: remainingScore * 0.4,
          neutral: baseScore
        };
    }
  }
  
  private getAnalysisReason(positiveScore: number, negativeScore: number, sentimentWords: string[]): string {
    if (positiveScore > negativeScore) {
      return `Strong positive indicators detected (${sentimentWords.join(', ')})`;
    } else if (negativeScore > positiveScore) {
      return `Strong negative indicators detected (${sentimentWords.join(', ')})`;
    } else {
      return `Balanced or minimal sentiment indicators`;
    }
  }

  private generateExplanation(sentiment: string, keywords: string[], reason: string): string {
    const keywordText = keywords.length > 0 ? `Key terms: "${keywords.slice(0, 3).join('", "')}"` : 'Limited key terms found';
    
    switch (sentiment) {
      case 'POSITIVE':
        return `${keywordText}. ${reason}. The text expresses favorable opinions, satisfaction, or positive emotions.`;
      case 'NEGATIVE':
        return `${keywordText}. ${reason}. The text contains criticism, dissatisfaction, or negative emotions.`;
      default:
        return `${keywordText}. ${reason}. The text maintains a neutral tone without strong emotional indicators.`;
    }
  }
}

export const sentimentApi = SentimentApiService.getInstance();