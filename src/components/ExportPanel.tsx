import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Database, FileImage } from 'lucide-react';
import { SentimentAnalysis } from '../types/sentiment';
import { exportService } from '../services/exportService';

interface ExportPanelProps {
  analysis: SentimentAnalysis;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ analysis }) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    setExporting(format);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `sentiment-analysis-${timestamp}.${format}`;

    try {
      switch (format) {
        case 'csv':
          exportService.exportToCSV(analysis, filename);
          break;
        case 'json':
          exportService.exportToJSON(analysis, filename);
          break;
        case 'pdf':
          exportService.exportToPDF(analysis, filename);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setTimeout(() => setExporting(null), 1000);
    }
  };

  const exportOptions = [
    {
      format: 'csv' as const,
      label: 'CSV',
      description: 'Spreadsheet format',
      icon: Database,
      color: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      format: 'json' as const,
      label: 'JSON',
      description: 'Structured data',
      icon: FileText,
      color: 'bg-slate-600 hover:bg-slate-700',
    },
    {
      format: 'pdf' as const,
      label: 'PDF',
      description: 'Report format',
      icon: FileImage,
      color: 'bg-red-500 hover:bg-red-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white/5 rounded-2xl shadow-xl p-6 border border-white/10 backdrop-blur-sm"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Download className="h-5 w-5 text-emerald-400" />
        <h2 className="text-xl font-semibold text-white">Export Results</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportOptions.map((option) => {
          const IconComponent = option.icon;
          const isExporting = exporting === option.format;

          return (
            <motion.button
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={isExporting}
              className={`p-4 rounded-xl text-white transition-all duration-200 ${option.color} disabled:opacity-50`}
              whileHover={{ scale: isExporting ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center space-y-2">
                {isExporting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <IconComponent className="h-6 w-6" />
                )}
                <div className="text-center">
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs opacity-90">{option.description}</div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="font-medium text-white mb-2">Export Information</h3>
        <div className="text-sm text-slate-300 space-y-1">
          <p>• CSV: Import into Excel, Google Sheets, or other data analysis tools</p>
          <p>• JSON: Use with programming languages and APIs</p>
          <p>• PDF: Human-readable report for presentations and documentation</p>
        </div>
      </div>
    </motion.div>
  );
};