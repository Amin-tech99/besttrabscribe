import React, { useState, useRef } from 'react';
import { 
  ArrowUpTrayIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';
import { useApp } from '../../../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadProgress } from '../../../types';

export const UploadZip: React.FC = () => {
  const { user } = useAuth();
  const { users } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assignedWorker, setAssignedWorker] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get workers from context (users with worker role)
  const workers = users.filter(user => user.role === 'worker');

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
      setSelectedFile(file);
    } else {
      alert('Please select a ZIP file containing audio segments.');
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const simulateUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const mockFiles = [
      'audio_001.wav',
      'audio_002.wav', 
      'audio_003.wav',
      'audio_004.wav',
      'audio_005.wav'
    ];

    // Initialize progress for all files
    const initialProgress: UploadProgress[] = mockFiles.map(filename => ({
      filename,
      progress: 0,
      status: 'uploading'
    }));
    setUploadProgress(initialProgress);

    // Simulate upload progress
    for (let i = 0; i < mockFiles.length; i++) {
      const filename = mockFiles[i];
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => 
          prev.map(item => 
            item.filename === filename 
              ? { ...item, progress }
              : item
          )
        );
      }
      
      // Mark as processing
      setUploadProgress(prev => 
        prev.map(item => 
          item.filename === filename 
            ? { ...item, status: 'processing' }
            : item
        )
      );
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mark as completed
      setUploadProgress(prev => 
        prev.map(item => 
          item.filename === filename 
            ? { ...item, status: 'completed', progress: 100 }
            : item
        )
      );
    }

    setIsUploading(false);
    
    // Reset after a delay
    setTimeout(() => {
      setSelectedFile(null);
      setUploadProgress([]);
      setAssignedWorker('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 3000);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a ZIP file first.');
      return;
    }
    
    if (!assignedWorker) {
      alert('Please assign a worker for this batch.');
      return;
    }

    simulateUpload();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-accent-green" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-blue" />;
    }
  };

  const getStatusColor = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-green';
      case 'error':
        return 'bg-red-500';
      case 'processing':
        return 'bg-accent-amber';
      default:
        return 'bg-accent-blue';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-title-mobile sm:text-title text-primary-900 mb-2">
          Upload ZIP
        </h1>
        <p className="text-secondary text-gray-600">
          Upload a ZIP file containing audio segments for transcription
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary-900 mb-2">
            Select Audio Batch
          </h2>
          <p className="text-secondary text-gray-600">
            Choose a ZIP file containing audio segments to be transcribed
          </p>
        </div>

        {/* File Drop Zone */}
        <div
          className={`
            border-2 border-dashed rounded-card p-8 text-center transition-all duration-200
            ${isDragOver 
              ? 'border-accent-green bg-accent-green bg-opacity-5' 
              : selectedFile 
                ? 'border-accent-green bg-accent-green bg-opacity-5'
                : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 text-accent-green">
                <DocumentIcon className="h-full w-full" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-900">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="text-sm text-accent-amber hover:text-opacity-80 transition-colors"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FolderIcon className="h-full w-full" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-900 mb-2">
                  Choose file
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your ZIP file here, or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                >
                  <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                  Browse Files
                </button>
              </div>
              <p className="text-xs text-gray-500">
                A ZIP file containing audio segments
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </motion.div>

      {/* Worker Assignment */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary-900 mb-2">
            Assign Worker
          </h2>
          <p className="text-secondary text-gray-600">
            Select a worker to assign this batch for transcription
          </p>
        </div>

        <div className="space-y-3">
          {workers.map((worker) => (
            <label
              key={worker.id}
              className={`
                flex items-center space-x-3 p-4 rounded-card border-2 cursor-pointer transition-all duration-200 touch-target
                ${assignedWorker === worker.id 
                  ? 'border-accent-green bg-accent-green bg-opacity-5' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                name="worker"
                value={worker.id}
                checked={assignedWorker === worker.id}
                onChange={(e) => setAssignedWorker(e.target.value)}
                className="sr-only"
              />
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-accent-green flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-900">
                  {worker.name}
                </p>
                <p className="text-xs text-gray-500">
                  {worker.email}
                </p>
              </div>
              {assignedWorker === worker.id && (
                <CheckCircleIcon className="h-5 w-5 text-accent-green" />
              )}
            </label>
          ))}
        </div>
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-primary-900">
                Upload Progress
              </h2>
            </div>

            <div className="space-y-3">
              {uploadProgress.map((item, index) => (
                <motion.div
                  key={item.filename}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-card"
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary-900 truncate">
                      {item.filename}
                    </p>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(item.status)}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-600">
                    {item.progress}%
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || !assignedWorker || isUploading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};