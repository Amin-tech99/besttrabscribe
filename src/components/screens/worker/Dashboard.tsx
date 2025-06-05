import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { segments } = useApp();
  const { user } = useAuth();

  // Filter segments assigned to current user
  const userSegments = segments.filter(segment => segment.assignedTo === user?.id);
  const completedSegments = userSegments.filter(segment => segment.status === 'completed');
  const totalSegments = userSegments.length;
  const progressPercentage = totalSegments > 0 ? (completedSegments.length / totalSegments) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-progress';
      case 'returned':
        return 'status-returned';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'returned':
        return 'Returned';
      default:
        return 'Not Started';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="">
        <h1 className="text-title-mobile sm:text-title text-primary-900 mb-2">
          Welcome back, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-secondary text-gray-600">
          Continue your transcription work below
        </p>
      </motion.div>

      {/* Progress Overview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-primary-900 mb-2">
            Your Progress
          </h2>
          <div className="bg-accent-green bg-opacity-10 rounded-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-accent-green">
                {completedSegments.length}/{totalSegments} segments completed
              </span>
              <span className="text-sm font-medium text-accent-green">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-accent-green h-3 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Segments List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary-900">
            Your Segments
          </h2>
          <p className="text-secondary text-gray-600 mt-1">
            Tap on a segment to start or continue transcription
          </p>
        </div>

        <div className="space-y-3">
          {userSegments.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <PlayIcon className="h-full w-full" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No segments assigned
              </h3>
              <p className="text-sm text-gray-500">
                Check back later for new transcription tasks
              </p>
            </div>
          ) : (
            userSegments.map((segment, index) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  to={`/transcription/${segment.id}`}
                  className="block bg-gray-50 rounded-card p-4 hover:bg-gray-100 transition-colors touch-target group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-label font-medium text-primary-900 truncate">
                          Segment {segment.id.split('-')[1]}
                        </h3>
                        <span className={`status-badge ${getStatusColor(segment.status)}`}>
                          {getStatusText(segment.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-secondary text-gray-600">
                        <span>{segment.filename}</span>
                        <span>•</span>
                        <span>{segment.duration}s</span>
                      </div>
                      {segment.transcription && (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {segment.transcription}
                        </p>
                      )}
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-4" />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent-green mb-1">
            {completedSegments.length}
          </div>
          <div className="text-secondary text-gray-600">
            Completed Today
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent-blue mb-1">
            {userSegments.filter(s => s.status === 'in-progress').length}
          </div>
          <div className="text-secondary text-gray-600">
            In Progress
          </div>
        </div>
      </motion.div>
    </div>
  );
};