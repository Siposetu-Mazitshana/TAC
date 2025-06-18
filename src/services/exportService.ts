import { SentimentAnalysis, ExportFormat } from '../types/sentiment';

class ExportService {
  exportToCSV(analysis: SentimentAnalysis, filename: string): void {
    const headers = ['Text', 'Sentiment', 'Confidence', 'Positive Score', 'Negative Score', 'Neutral Score', 'Keywords', 'Timestamp'];
    
    const rows = analysis.results.map(result => [
      `"${result.text.replace(/"/g, '""')}"`,
      result.sentiment,
      result.confidence.toFixed(3),
      result.scores.positive.toFixed(3),
      result.scores.negative.toFixed(3),
      result.scores.neutral.toFixed(3),
      `"${result.keywords.join(', ')}"`,
      result.timestamp.toISOString(),
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    this.downloadFile(csvContent, filename, 'text/csv');
  }

  exportToJSON(analysis: SentimentAnalysis, filename: string): void {
    const jsonContent = JSON.stringify(analysis, null, 2);
    this.downloadFile(jsonContent, filename, 'application/json');
  }

  exportToPDF(analysis: SentimentAnalysis, filename: string): void {
    // For demonstration - in production, use a PDF library like jsPDF
    const textContent = this.generateTextReport(analysis);
    this.downloadFile(textContent, filename.replace('.pdf', '.txt'), 'text/plain');
  }

  private generateTextReport(analysis: SentimentAnalysis): string {
    const { results, summary } = analysis;
    
    let report = 'SENTIMENT ANALYSIS REPORT\n';
    report += '========================\n\n';
    report += `Analysis Date: ${new Date().toLocaleString()}\n`;
    report += `Total Texts Analyzed: ${summary.totalTexts}\n`;
    report += `Average Confidence: ${(summary.averageConfidence * 100).toFixed(1)}%\n\n`;
    
    report += 'SENTIMENT DISTRIBUTION:\n';
    report += `-----------------------\n`;
    report += `Positive: ${summary.sentimentDistribution.positive} (${((summary.sentimentDistribution.positive / summary.totalTexts) * 100).toFixed(1)}%)\n`;
    report += `Negative: ${summary.sentimentDistribution.negative} (${((summary.sentimentDistribution.negative / summary.totalTexts) * 100).toFixed(1)}%)\n`;
    report += `Neutral: ${summary.sentimentDistribution.neutral} (${((summary.sentimentDistribution.neutral / summary.totalTexts) * 100).toFixed(1)}%)\n\n`;
    
    report += 'DETAILED RESULTS:\n';
    report += '-----------------\n';
    
    results.forEach((result, index) => {
      report += `\n${index + 1}. Text: "${result.text}"\n`;
      report += `   Sentiment: ${result.sentiment} (${(result.confidence * 100).toFixed(1)}% confidence)\n`;
      report += `   Keywords: ${result.keywords.join(', ')}\n`;
      report += `   Explanation: ${result.explanation}\n`;
    });
    
    return report;
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();