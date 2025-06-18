import { SentimentAnalysis, ExportFormat } from '../types/sentiment';
import jsPDF from 'jspdf';

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
    try {
      const pdf = new jsPDF();
      const { results, summary } = analysis;
      
      // Set up fonts and colors
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      
      // Title
      pdf.text('TAC Sentiment Analysis Report', 20, 25);
      
      // Add a line under the title
      pdf.setLineWidth(0.5);
      pdf.line(20, 30, 190, 30);
      
      // Report metadata
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      
      let yPosition = 45;
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Total Texts Analyzed: ${summary.totalTexts}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Average Confidence: ${(summary.averageConfidence * 100).toFixed(1)}%`, 20, yPosition);
      
      // Sentiment Distribution Section
      yPosition += 20;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Sentiment Distribution', 20, yPosition);
      
      yPosition += 15;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      
      // Create distribution bars
      const barWidth = 150;
      const barHeight = 8;
      const totalTexts = summary.totalTexts;
      
      // Positive bar
      const positiveWidth = (summary.sentimentDistribution.positive / totalTexts) * barWidth;
      pdf.setFillColor(16, 185, 129); // Emerald color
      pdf.rect(20, yPosition, positiveWidth, barHeight, 'F');
      pdf.setTextColor(16, 185, 129);
      pdf.text(`Positive: ${summary.sentimentDistribution.positive} (${((summary.sentimentDistribution.positive / totalTexts) * 100).toFixed(1)}%)`, 20, yPosition + barHeight + 5);
      
      yPosition += 20;
      
      // Negative bar
      const negativeWidth = (summary.sentimentDistribution.negative / totalTexts) * barWidth;
      pdf.setFillColor(239, 68, 68); // Red color
      pdf.rect(20, yPosition, negativeWidth, barHeight, 'F');
      pdf.setTextColor(239, 68, 68);
      pdf.text(`Negative: ${summary.sentimentDistribution.negative} (${((summary.sentimentDistribution.negative / totalTexts) * 100).toFixed(1)}%)`, 20, yPosition + barHeight + 5);
      
      yPosition += 20;
      
      // Neutral bar
      const neutralWidth = (summary.sentimentDistribution.neutral / totalTexts) * barWidth;
      pdf.setFillColor(245, 158, 11); // Amber color
      pdf.rect(20, yPosition, neutralWidth, barHeight, 'F');
      pdf.setTextColor(245, 158, 11);
      pdf.text(`Neutral: ${summary.sentimentDistribution.neutral} (${((summary.sentimentDistribution.neutral / totalTexts) * 100).toFixed(1)}%)`, 20, yPosition + barHeight + 5);
      
      // Detailed Results Section
      yPosition += 30;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Detailed Analysis Results', 20, yPosition);
      
      yPosition += 15;
      
      // Process each result
      results.forEach((result, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 25;
        }
        
        // Result header
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(40, 40, 40);
        pdf.text(`Text ${index + 1}:`, 20, yPosition);
        
        // Sentiment badge
        const sentimentColor = result.sentiment === 'POSITIVE' ? [16, 185, 129] : 
                              result.sentiment === 'NEGATIVE' ? [239, 68, 68] : [245, 158, 11];
        pdf.setFillColor(...sentimentColor);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        
        const badgeX = 60;
        const badgeY = yPosition - 4;
        const badgeWidth = 25;
        const badgeHeight = 6;
        
        pdf.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, 'F');
        pdf.text(result.sentiment, badgeX + 2, yPosition);
        
        // Confidence
        pdf.setTextColor(80, 80, 80);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${(result.confidence * 100).toFixed(1)}% confidence`, badgeX + badgeWidth + 10, yPosition);
        
        yPosition += 12;
        
        // Text content (wrapped)
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        
        const textLines = this.wrapText(pdf, `"${result.text}"`, 170);
        textLines.forEach(line => {
          if (yPosition > 280) {
            pdf.addPage();
            yPosition = 25;
          }
          pdf.text(line, 25, yPosition);
          yPosition += 5;
        });
        
        yPosition += 3;
        
        // Keywords
        if (result.keywords.length > 0) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          const keywordText = `Keywords: ${result.keywords.slice(0, 5).join(', ')}`;
          const keywordLines = this.wrapText(pdf, keywordText, 170);
          keywordLines.forEach(line => {
            if (yPosition > 280) {
              pdf.addPage();
              yPosition = 25;
            }
            pdf.text(line, 25, yPosition);
            yPosition += 4;
          });
        }
        
        yPosition += 8;
        
        // Add a subtle separator line
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.2);
        pdf.line(20, yPosition, 190, yPosition);
        yPosition += 10;
      });
      
      // Add footer with page numbers
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${pageCount}`, 170, 290);
        pdf.text('Generated by TAC Analysis Dashboard', 20, 290);
      }
      
      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to text export
      const textContent = this.generateTextReport(analysis);
      this.downloadFile(textContent, filename.replace('.pdf', '.txt'), 'text/plain');
    }
  }

  private wrapText(pdf: jsPDF, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = pdf.getTextWidth(testLine);
      
      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
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