import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { SentimentAnalysis } from '../types/sentiment';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface SentimentChartProps {
  analysis: SentimentAnalysis;
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ analysis }) => {
  const pieData = [
    { 
      name: 'Positive', 
      value: analysis.summary.sentimentDistribution.positive, 
      color: '#10B981',
      percentage: ((analysis.summary.sentimentDistribution.positive / analysis.summary.totalTexts) * 100).toFixed(1)
    },
    { 
      name: 'Negative', 
      value: analysis.summary.sentimentDistribution.negative, 
      color: '#EF4444',
      percentage: ((analysis.summary.sentimentDistribution.negative / analysis.summary.totalTexts) * 100).toFixed(1)
    },
    { 
      name: 'Neutral', 
      value: analysis.summary.sentimentDistribution.neutral, 
      color: '#F59E0B',
      percentage: ((analysis.summary.sentimentDistribution.neutral / analysis.summary.totalTexts) * 100).toFixed(1)
    },
  ];

  const barData = analysis.results.map((result, index) => ({
    text: `Text ${index + 1}`,
    fullText: result.text.substring(0, 50) + (result.text.length > 50 ? '...' : ''),
    positive: parseFloat((result.scores.positive * 100).toFixed(2)),
    negative: parseFloat((result.scores.negative * 100).toFixed(2)),
    neutral: parseFloat((result.scores.neutral * 100).toFixed(2)),
    confidence: parseFloat((result.confidence * 100).toFixed(2)),
    sentiment: result.sentiment,
  }));

  // Confidence trend data
  const confidenceTrendData = analysis.results.map((result, index) => ({
    text: `T${index + 1}`,
    confidence: parseFloat((result.confidence * 100).toFixed(2)),
    sentiment: result.sentiment,
  }));

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800/90 backdrop-blur-sm p-4 border border-white/20 rounded-xl shadow-lg">
          <p className="font-semibold text-white mb-2">{data.name} Sentiment</p>
          <div className="space-y-1">
            <p className="text-sm text-slate-300">Count: <span className="font-medium text-white">{data.value}</span></p>
            <p className="text-sm text-slate-300">Percentage: <span className="font-medium text-white">{data.percentage}%</span></p>
            <p className="text-sm text-slate-300">Total Texts: <span className="font-medium text-white">{analysis.summary.totalTexts}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800/90 backdrop-blur-sm p-4 border border-white/20 rounded-xl shadow-lg max-w-xs">
          <p className="font-semibold text-white mb-2">{label}</p>
          <p className="text-xs text-slate-300 mb-3 italic">"{data.fullText}"</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-400">Positive:</span>
              <span className="font-medium text-white">{data.positive}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-400">Negative:</span>
              <span className="font-medium text-white">{data.negative}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-amber-400">Neutral:</span>
              <span className="font-medium text-white">{data.neutral}%</span>
            </div>
            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Confidence:</span>
                <span className="font-bold text-white">{data.confidence}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Classification:</span>
                <span className={`font-medium text-sm ${
                  data.sentiment === 'POSITIVE' ? 'text-emerald-400' : 
                  data.sentiment === 'NEGATIVE' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {data.sentiment}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800/90 backdrop-blur-sm p-3 border border-white/20 rounded-lg shadow-lg">
          <p className="font-semibold text-white">{label}</p>
          <p className="text-sm text-slate-300">Confidence: <span className="font-medium text-white">{data.confidence}%</span></p>
          <p className="text-sm text-slate-300">Sentiment: <span className={`font-medium ${
            data.sentiment === 'POSITIVE' ? 'text-emerald-400' : 
            data.sentiment === 'NEGATIVE' ? 'text-red-400' : 'text-amber-400'
          }`}>{data.sentiment}</span></p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/5 rounded-2xl shadow-xl p-8 border border-white/10 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Sentiment Analysis Overview</h2>
        <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
          <Activity className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium text-slate-200">Live Analytics</span>
        </div>
      </div>
      
      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart Section */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-6">
            <PieChartIcon className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Sentiment Distribution</h3>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="flex justify-center space-x-6 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">{entry.name}</div>
                    <div className="text-xs text-slate-400">{entry.value} ({entry.percentage}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart Section */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Detailed Sentiment Scores</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="text" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend />
              <Bar dataKey="positive" fill="#10B981" name="Positive %" radius={[2, 2, 0, 0]} />
              <Bar dataKey="negative" fill="#EF4444" name="Negative %" radius={[2, 2, 0, 0]} />
              <Bar dataKey="neutral" fill="#F59E0B" name="Neutral %" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confidence Trend Chart */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Confidence Trend Analysis</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={confidenceTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="text" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={[0, 100]}
              label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip content={<CustomLineTooltip />} />
            <Line 
              type="monotone" 
              dataKey="confidence" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Summary Statistics */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white border border-white/10">
        <h3 className="text-xl font-bold mb-6 text-center">Comprehensive Analysis Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-emerald-400">{analysis.summary.totalTexts}</div>
            <div className="text-sm text-slate-300 mt-1">Total Texts</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-blue-400">
              {(analysis.summary.averageConfidence * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-slate-300 mt-1">Avg Confidence</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-emerald-400">
              {analysis.summary.sentimentDistribution.positive}
            </div>
            <div className="text-sm text-slate-300 mt-1">Positive Count</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-red-400">
              {analysis.summary.sentimentDistribution.negative}
            </div>
            <div className="text-sm text-slate-300 mt-1">Negative Count</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-amber-400">
              {analysis.summary.sentimentDistribution.neutral}
            </div>
            <div className="text-sm text-slate-300 mt-1">Neutral Count</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-purple-400">
              {Math.max(...analysis.results.map(r => r.confidence * 100)).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-300 mt-1">Highest Confidence</div>
          </div>
        </div>
        
        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-200 mb-2">Sentiment Ratio</div>
            <div className="text-sm text-slate-400">
              Positive:Negative = {analysis.summary.sentimentDistribution.positive}:{analysis.summary.sentimentDistribution.negative}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-200 mb-2">Confidence Range</div>
            <div className="text-sm text-slate-400">
              {Math.min(...analysis.results.map(r => r.confidence * 100)).toFixed(1)}% - {Math.max(...analysis.results.map(r => r.confidence * 100)).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-200 mb-2">Analysis Quality</div>
            <div className="text-sm text-slate-400">
              {analysis.summary.averageConfidence >= 0.8 ? 'High' : 
               analysis.summary.averageConfidence >= 0.6 ? 'Medium' : 'Low'} Confidence
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};