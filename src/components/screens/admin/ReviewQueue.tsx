import React, { useState } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  CheckIcon, 
  XMarkIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { DenialReason } from '../../../types';

interface ReviewModalProps {
  segment: any;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onDeny: (reason: DenialReason, comments?: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ 
  segment, 
  isOpen, 
  onClose, 
  onApprove, 
  onDeny 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedReason, setSelectedReason] = useState<DenialReason>('incorrect-transcription');
  const [comments, setComments] = useState('');
  const [showDenyForm, setShowDenyForm] = useState(false);

  const denialReasons = [
    { value: 'poor-audio-quality', label: 'Poor Audio Quality' },
    { value: 'incorrect-transcription', label: 'Incorrect Transcription' },
    { value: 'incomplete-transcription', label: 'Incomplete Transcription' },
    { value: 'formatting-issues', label: 'Formatting Issues' },
    { value: 'other', label: 'Other' },
  ];

  const handleDeny = () => {
    onDeny(selectedReason, comments);
    setShowDenyForm(false);
    setComments('');
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !segment) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-card shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary-900">
                  Review Transcription
                </h2>
                <button
                  onClick={onClose}
                  className="touch-target flex items-center justify-center rounded-card text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {segment.filename} • {formatTime(segment.duration)}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Audio Player */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Audio</h3>
                <div className="bg-gray-50 rounded-card p-4">
                  {/* Waveform */}
                  <div className="flex items-center space-x-1 h-12 mb-4">
                    {segment.waveformData?.map((height: number, index: number) => (
                      <div
                        key={index}
                        className="bg-accent-blue opacity-70 w-1"
                        style={{ height: `${(height / 100) * 32}px` }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="btn-primary w-10 h-10 rounded-full p-0"
                    >
                      {isPlaying ? (
                        <PauseIcon className="h-5 w-5" />
                      ) : (
                        <PlayIcon className="h-5 w-5 ml-0.5" />
                      )}
                    </button>
                    <div className="text-sm text-gray-600">
                      0:00 / {formatTime(segment.duration)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcription */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Transcription</h3>
                <div className="bg-gray-50 rounded-card p-4">
                  <p className="text-right" dir="rtl" lang="ar">
                    {segment.transcription || 'No transcription provided'}
                  </p>
                </div>
              </div>

              {/* Worker Info */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Submitted by</h3>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-accent-green flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Worker Name</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>

              {/* Deny Form */}
              <AnimatePresence>
                {showDenyForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 border-t border-gray-200 pt-6"
                  >
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Reason for Denial</h3>
                    <div className="space-y-3">
                      <select
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value as DenialReason)}
                        className="input-field"
                      >
                        {denialReasons.map((reason) => (
                          <option key={reason.value} value={reason.value}>
                            {reason.label}
                          </option>
                        ))}
                      </select>
                      
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Additional comments (optional)"
                        className="input-field min-h-[80px] resize-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 p-6">
              {showDenyForm ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDenyForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeny}
                    className="btn-danger flex-1"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Confirm Denial
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDenyForm(true)}
                    className="btn-danger flex-1"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Deny
                  </button>
                  <button
                    onClick={() => {
                      onApprove();
                      onClose();
                    }}
                    className="btn-primary flex-1"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export const ReviewQueue: React.FC = () => {
  const { segments, updateSegment } = useApp();
  const { user } = useAuth();
  const [selectedSegment, setSelectedSegment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get segments that need review (completed status)
  const reviewSegments = segments.filter(segment => segment.status === 'completed');

  const handleApprove = () => {
    if (selectedSegment) {
      updateSegment(selectedSegment.id, {
        status: 'completed',
        reviewedBy: user?.id,
      });
    }
  };

  const handleDeny = (reason: DenialReason, comments?: string) => {
    if (selectedSegment) {
      updateSegment(selectedSegment.id, {
        status: 'returned',
        returnReason: reason,
        reviewedBy: user?.id,
      });
    }
  };

  const openReviewModal = (segment: any) => {
    setSelectedSegment(segment);
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedSegment(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-title-mobile sm:text-title text-primary-900 mb-2">
          Review Queue
        </h1>
        <p className="text-secondary text-gray-600">
          Review completed transcriptions for quality assurance
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent-blue mb-1">
            {reviewSegments.length}
          </div>
          <div className="text-secondary text-gray-600">
            Pending Review
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent-green mb-1">
            {segments.filter(s => s.reviewedBy === user?.id).length}
          </div>
          <div className="text-secondary text-gray-600">
            Reviewed Today
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent-amber mb-1">
            {segments.filter(s => s.status === 'returned').length}
          </div>
          <div className="text-secondary text-gray-600">
            Returned
          </div>
        </div>
      </motion.div>

      {/* Review List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary-900">
            Segments Awaiting Review
          </h2>
        </div>

        {reviewSegments.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <ClockIcon className="h-full w-full" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              No segments to review
            </h3>
            <p className="text-sm text-gray-500">
              All transcriptions are up to date
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviewSegments.map((segment, index) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-gray-50 rounded-card p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => openReviewModal(segment)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-label font-medium text-primary-900">
                        {segment.filename}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {Math.floor(segment.duration / 60)}:{(segment.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 text-right" dir="rtl">
                      {segment.transcription}
                    </p>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                      <UserIcon className="h-3 w-3" />
                      <span>Worker {segment.assignedTo}</span>
                      <span>•</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button className="btn-primary text-sm py-2 px-4">
                      Review
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Review Modal */}
      <ReviewModal
        segment={selectedSegment}
        isOpen={isModalOpen}
        onClose={closeReviewModal}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
    </div>
  );
};