import React, { useState, useRef } from 'react';
import { Upload, Type, Plus, X, FileText, AlertCircle, File, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileParser } from '../utils/fileParser';

interface TextInputProps {
  onAnalyze: (texts: string[]) => void;
  loading: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ onAnalyze, loading }) => {
  const [inputTexts, setInputTexts] = useState<string[]>(['']);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (index: number, value: string) => {
    const newTexts = [...inputTexts];
    newTexts[index] = value;
    setInputTexts(newTexts);
  };

  const addTextInput = () => {
    setInputTexts([...inputTexts, '']);
  };

  const removeTextInput = (index: number) => {
    if (inputTexts.length > 1) {
      const newTexts = inputTexts.filter((_, i) => i !== index);
      setInputTexts(newTexts);
    }
  };

  const processFile = async (file: File) => {
    setUploadError(null);
    setIsProcessing(true);
    
    try {
      if (file.size > FileParser.getMaxFileSize()) {
        throw new Error('File size must be less than 10MB');
      }

      const supportedFormats = FileParser.getSupportedFormats();
      const fileExtension = '.' + file.name.toLowerCase().split('.').pop();
      
      if (!supportedFormats.includes(fileExtension)) {
        throw new Error(`Unsupported file format. Supported formats: ${supportedFormats.join(', ')}`);
      }

      const texts = await FileParser.parseFile(file);
      
      if (texts.length === 0) {
        throw new Error('No valid text content found in the file');
      }

      // Limit to 100 texts for performance
      const limitedTexts = texts.slice(0, 100);
      setInputTexts(limitedTexts);
      setUploadError(null);
      
      if (texts.length > 100) {
        setUploadError(`File contained ${texts.length} texts. Showing first 100 for performance.`);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error processing file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      processFile(file);
    }
  };

  const handleAnalyze = () => {
    const validTexts = inputTexts.filter(text => text.trim());
    if (validTexts.length > 0) {
      onAnalyze(validTexts);
    }
  };

  const getFileIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return <File className="h-4 w-4 text-red-400" />;
      case 'DOCX':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'XLSX':
        return <FileSpreadsheet className="h-4 w-4 text-emerald-400" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <motion.div 
      className="bg-white/5 rounded-2xl shadow-xl p-6 border border-white/10 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Type className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Text Analysis Input</h2>
        </div>
        <span className="text-sm text-slate-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
          {inputTexts.filter(t => t.trim()).length} text(s)
        </span>
      </div>

      {/* Enhanced Drag and Drop Zone */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 mb-6 ${
          dragActive
            ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 scale-105'
            : 'border-white/20 hover:border-emerald-400/50 hover:bg-white/5'
        }`}
        whileHover={{ scale: dragActive ? 1.05 : 1.02 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv,.json,.pdf,.docx,.xlsx,.xls"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <motion.div
          animate={{ 
            y: dragActive ? -5 : 0,
            scale: dragActive ? 1.1 : 1 
          }}
          transition={{ duration: 0.2 }}
        >
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            dragActive ? 'bg-emerald-500' : 'bg-white/10'
          }`}>
            {isProcessing ? (
              <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload className={`h-8 w-8 ${dragActive ? 'text-white' : 'text-slate-300'}`} />
            )}
          </div>
          
          <h3 className={`text-lg font-semibold mb-2 ${
            dragActive ? 'text-emerald-400' : 'text-white'
          }`}>
            {isProcessing ? 'Processing file...' : dragActive ? 'Drop your file here!' : 'Upload or drag & drop files'}
          </h3>
          
          <p className="text-slate-300 mb-4">
            Support for multiple formats including PDF, Word, Excel (max 10MB)
          </p>
          
          <div className="grid grid-cols-3 gap-4 text-sm text-slate-400">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1">
                {getFileIcon('TXT')}
                <span>TXT</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                {getFileIcon('CSV')}
                <span>CSV</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1">
                {getFileIcon('PDF')}
                <span>PDF</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                {getFileIcon('DOCX')}
                <span>DOCX</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1">
                {getFileIcon('XLSX')}
                <span>XLSX</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>JSON</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {dragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-emerald-500/10 rounded-2xl border-2 border-emerald-400 border-dashed"
          />
        )}
      </motion.div>

      {/* Upload Error Display */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-3 border rounded-xl flex items-center space-x-2 backdrop-blur-sm ${
              uploadError.includes('Showing first') 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <AlertCircle className={`h-4 w-4 flex-shrink-0 ${
              uploadError.includes('Showing first') ? 'text-amber-400' : 'text-red-400'
            }`} />
            <span className={`text-sm ${
              uploadError.includes('Showing first') ? 'text-amber-300' : 'text-red-300'
            }`}>
              {uploadError}
            </span>
            <button
              onClick={() => setUploadError(null)}
              className={`ml-auto hover:opacity-70 ${
                uploadError.includes('Showing first') ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Text Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Manual Text Entry</h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            <span>Browse Files</span>
          </button>
        </div>

        <AnimatePresence>
          {inputTexts.map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative"
            >
              <textarea
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                placeholder={`Enter text for sentiment analysis ${index + 1}...`}
                className="w-full p-4 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-200 min-h-[100px] bg-white/5 focus:bg-white/10 text-white placeholder-slate-400 backdrop-blur-sm"
                rows={3}
              />
              {inputTexts.length > 1 && (
                <button
                  onClick={() => removeTextInput(index)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onClick={addTextInput}
          className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Another Text</span>
        </button>

        <motion.button
          onClick={handleAnalyze}
          disabled={loading || isProcessing || inputTexts.every(text => !text.trim())}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          whileHover={{ scale: (loading || isProcessing) ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Sentiment...</span>
            </div>
          ) : isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing File...</span>
            </div>
          ) : (
            'Analyze Sentiment'
          )}
        </motion.button>
      </div>

      {/* Enhanced File Format Information */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
        <h4 className="font-medium text-white mb-3">Supported File Formats</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
          <div className="space-y-1">
            <p>• <strong>Text files (.txt):</strong> Plain text, line by line</p>
            <p>• <strong>CSV files (.csv):</strong> First column used for analysis</p>
            <p>• <strong>JSON files (.json):</strong> Arrays or objects with text</p>
          </div>
          <div className="space-y-1">
            <p>• <strong>PDF files (.pdf):</strong> Extracted text content</p>
            <p>• <strong>Word docs (.docx):</strong> Document text content</p>
            <p>• <strong>Excel files (.xlsx/.xls):</strong> Cell text values</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-sm text-slate-300">
            <strong>File size limit:</strong> Maximum 10MB per file • 
            <strong> Processing limit:</strong> Up to 100 texts per file for optimal performance
          </p>
        </div>
      </div>
    </motion.div>
  );
};