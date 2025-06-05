import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TableCellsIcon,
  CodeBracketIcon,
  FunnelIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../../../contexts/AppContext';


interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  extension: string;
}

interface ExportFilter {
  status: string[];
  dateRange: {
    start: string;
    end: string;
  };
  assignedTo: string;
  batchId: string;
}

export const Export: React.FC = () => {
  const { segments, batches } = useApp();
  const [selectedFormat, setSelectedFormat] = useState<string>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [filters, setFilters] = useState<ExportFilter>({
    status: ['completed'],
    dateRange: {
      start: '',
      end: ''
    },
    assignedTo: '',
    batchId: ''
  });

  const exportFormats: ExportFormat[] = [
    {
      id: 'json',
      name: 'JSON',
      description: 'Structured data format with full metadata',
      icon: CodeBracketIcon,
      extension: '.json'
    },
    {
      id: 'csv',
      name: 'CSV',
      description: 'Spreadsheet format for data analysis',
      icon: TableCellsIcon,
      extension: '.csv'
    },
    {
      id: 'txt',
      name: 'Text',
      description: 'Plain text transcriptions only',
      icon: DocumentTextIcon,
      extension: '.txt'
    }
  ];

  const statusOptions = [
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'returned', label: 'Returned', color: 'text-yellow-600' },
    { value: 'not-started', label: 'Not Started', color: 'text-gray-600' }
  ];

  const getFilteredSegments = () => {
    return segments.filter(segment => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(segment.status)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const segmentDate = new Date(segment.createdAt);
        if (filters.dateRange.start && segmentDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && segmentDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      // Assigned to filter
      if (filters.assignedTo && segment.assignedTo !== filters.assignedTo) {
        return false;
      }

      // Batch filter
      if (filters.batchId && segment.batchId !== filters.batchId) {
        return false;
      }

      return true;
    });
  };

  const generateExportData = (format: string, segments: any[]) => {
    switch (format) {
      case 'json':
        return JSON.stringify({
          exportDate: new Date().toISOString(),
          totalSegments: segments.length,
          filters: filters,
          segments: segments.map(segment => ({
            id: segment.id,
            filename: segment.filename,
            duration: segment.duration,
            transcription: segment.transcription,
            status: segment.status,
            assignedTo: segment.assignedTo,
            batchId: segment.batchId,
            createdAt: segment.createdAt,
            updatedAt: segment.updatedAt
          }))
        }, null, 2);

      case 'csv':
        const headers = ['ID', 'Filename', 'Duration', 'Status', 'Assigned To', 'Batch ID', 'Transcription', 'Created At'];
        const rows = segments.map(segment => [
          segment.id,
          segment.filename,
          segment.duration,
          segment.status,
          segment.assignedTo,
          segment.batchId,
          `"${(segment.transcription || '').replace(/"/g, '""')}"`,
          segment.createdAt
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');

      case 'txt':
        return segments
          .filter(segment => segment.transcription)
          .map(segment => `=== ${segment.filename} ===\n${segment.transcription}\n`)
          .join('\n');

      default:
        return '';
    }
  };

  const handleExport = async () => {
    const filteredSegments = getFilteredSegments();
    
    if (filteredSegments.length === 0) {
      alert('No segments match the current filters.');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const format = exportFormats.find(f => f.id === selectedFormat)!;
      const data = generateExportData(selectedFormat, filteredSegments);
      
      // Create and download file
      const blob = new Blob([data], { 
        type: selectedFormat === 'json' ? 'application/json' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transcriptions_${new Date().toISOString().split('T')[0]}${format.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const filteredSegments = getFilteredSegments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="">
        <h1 className="text-title-mobile sm:text-title text-primary-900 mb-2">
          Export Transcriptions
        </h1>
        <p className="text-secondary text-gray-600">
          Export transcription data in various formats
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-primary-900">Filters</h2>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(option.value)}
                      onChange={() => handleStatusChange(option.value)}
                      className="rounded border-gray-300 text-accent-green focus:ring-accent-green"
                    />
                    <span className={`ml-2 text-sm ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="input-field"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="input-field"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Batch Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch
              </label>
              <select
                value={filters.batchId}
                onChange={(e) => setFilters(prev => ({ ...prev, batchId: e.target.value }))}
                className="input-field"
              >
                <option value="">All batches</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Summary */}
            <div className="bg-gray-50 rounded-card p-3">
              <div className="text-sm text-gray-600">
                <strong>{filteredSegments.length}</strong> segments match your filters
              </div>
            </div>
          </div>
        </motion.div>

        {/* Export Options */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-primary-900 mb-4">
              Export Format
            </h2>

            {/* Format Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {exportFormats.map(format => {
                const Icon = format.icon;
                return (
                  <div
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`cursor-pointer rounded-card border-2 p-4 transition-all ${
                      selectedFormat === format.id
                        ? 'border-accent-green bg-accent-green bg-opacity-10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className={`h-6 w-6 ${
                        selectedFormat === format.id ? 'text-accent-green' : 'text-gray-500'
                      }`} />
                      <h3 className="font-medium text-gray-900">{format.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{format.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Export Progress */}
            {isExporting && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Exporting...</span>
                  <span className="text-sm text-gray-500">{exportProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-accent-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting || filteredSegments.length === 0}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>
                {isExporting 
                  ? 'Exporting...' 
                  : `Export ${filteredSegments.length} segments`
                }
              </span>
            </button>

            {filteredSegments.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-card">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    No segments match your current filters. Adjust the filters to include more data.
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};