import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class FileParser {
  static async parseFile(file: File): Promise<string[]> {
    const extension = file.name.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'txt':
        return this.parseTxtFile(file);
      case 'csv':
        return this.parseCsvFile(file);
      case 'json':
        return this.parseJsonFile(file);
      case 'pdf':
        return this.parsePdfFile(file);
      case 'docx':
        return this.parseDocxFile(file);
      case 'xlsx':
      case 'xls':
        return this.parseExcelFile(file);
      default:
        throw new Error(`Unsupported file format: ${extension}`);
    }
  }

  private static async parseTxtFile(file: File): Promise<string[]> {
    const content = await this.readFileAsText(file);
    return content.split('\n').filter(line => line.trim());
  }

  private static async parseCsvFile(file: File): Promise<string[]> {
    const content = await this.readFileAsText(file);
    return content.split('\n')
      .map(line => line.split(',')[0].replace(/"/g, '')) // Take first column, remove quotes
      .filter(line => line.trim() && !line.toLowerCase().includes('text')); // Remove headers
  }

  private static async parseJsonFile(file: File): Promise<string[]> {
    const content = await this.readFileAsText(file);
    const jsonData = JSON.parse(content);
    
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => typeof item === 'string' ? item : JSON.stringify(item));
    } else if (typeof jsonData === 'object') {
      return Object.values(jsonData).map(value => String(value));
    } else {
      return [String(jsonData)];
    }
  }

  private static async parsePdfFile(file: File): Promise<string[]> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const texts: string[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim();
        
        if (pageText) {
          // Split by sentences or paragraphs for better analysis
          const sentences = pageText.split(/[.!?]+/).filter(s => s.trim().length > 10);
          texts.push(...sentences);
        }
      }
      
      return texts.length > 0 ? texts : [texts.join(' ')];
    } catch (error) {
      throw new Error('Failed to parse PDF file. Please ensure it contains readable text.');
    }
  }

  private static async parseDocxFile(file: File): Promise<string[]> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.trim();
      
      if (!text) {
        throw new Error('No text content found in the Word document');
      }
      
      // Split by paragraphs or sentences for better analysis
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 10);
      return paragraphs.length > 0 ? paragraphs : [text];
    } catch (error) {
      throw new Error('Failed to parse Word document. Please ensure it\'s a valid .docx file.');
    }
  }

  private static async parseExcelFile(file: File): Promise<string[]> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const texts: string[] = [];
      
      // Process all sheets
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        jsonData.forEach((row: any) => {
          if (Array.isArray(row) && row.length > 0) {
            // Take the first non-empty cell from each row
            const cellValue = row.find(cell => cell && String(cell).trim());
            if (cellValue && String(cellValue).trim().length > 5) {
              texts.push(String(cellValue).trim());
            }
          }
        });
      });
      
      if (texts.length === 0) {
        throw new Error('No text content found in the Excel file');
      }
      
      return texts;
    } catch (error) {
      throw new Error('Failed to parse Excel file. Please ensure it contains text data.');
    }
  }

  private static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private static readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  static getSupportedFormats(): string[] {
    return ['.txt', '.csv', '.json', '.pdf', '.docx', '.xlsx', '.xls'];
  }

  static getMaxFileSize(): number {
    return 10 * 1024 * 1024; // 10MB
  }
}