export interface SentimentResult {
  id: string;
  text: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
  keywords: string[];
  timestamp: Date;
  explanation: string;
}

export interface SentimentAnalysis {
  results: SentimentResult[];
  summary: {
    totalTexts: number;
    averageConfidence: number;
    sentimentDistribution: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
}

export interface AnalysisHistory {
  id: string;
  name: string;
  date: Date;
  analysis: SentimentAnalysis;
}

export interface ExportFormat {
  format: 'csv' | 'json' | 'pdf';
  data: SentimentAnalysis;
  filename: string;
}