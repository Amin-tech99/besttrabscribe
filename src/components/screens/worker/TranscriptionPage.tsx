import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../../../contexts/AppContext';
import { motion } from 'framer-motion';

export const TranscriptionPage: React.FC = () => {
  const { segmentId } = useParams<{ segmentId: string }>();
  const navigate = useNavigate();
  const { segments, updateSegment, updateTranscriptionProgress } = useApp();
  const [transcription, setTranscription] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const segment = segments.find(s => s.id === segmentId);
  const currentIndex = segments.findIndex(s => s.id === segmentId);
  const nextSegment = segments[currentIndex + 1];
  const previousSegment = segments[currentIndex - 1];

  useEffect(() => {
    if (segment) {
      setTranscription(segment.transcription || '');
      // Mark as in-progress when opened
      if (segment.status === 'not-started') {
        updateSegment(segment.id, { status: 'in-progress' });
      }
    }
  }, [segment, updateSegment]);

  const handleSave = useCallback(async () => {
    if (!segment) return;
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateSegment(segment.id, { 
        transcription,
        status: transcription.trim() ? 'in-progress' : 'not-started'
      });
      
      updateTranscriptionProgress(segment.id, {
        progress: transcription.length > 0 ? 50 : 0,
        lastSaved: new Date(),
      });
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [segment, transcription, updateSegment, updateTranscriptionProgress]);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (transcription !== segment?.transcription && transcription.trim()) {
        handleSave();
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [transcription, segment?.transcription, handleSave]);

  const handleComplete = async () => {
    if (!segment || !transcription.trim()) return;
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateSegment(segment.id, { 
        transcription,
        status: 'completed'
      });
      
      updateTranscriptionProgress(segment.id, {
        progress: 100,
        lastSaved: new Date(),
      });
      
      // Navigate to next segment or dashboard
      if (nextSegment) {
        navigate(`/transcription/${nextSegment.id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Complete failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!segment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Segment not found</h2>
        <Link to="/dashboard" className="btn-primary inline-flex">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard"
            className="touch-target flex items-center justify-center rounded-card text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-title-mobile sm:text-title text-primary-900">
              Segment Transcription
            </h1>
            <p className="text-secondary text-gray-600">
              {currentIndex + 1} of {segments.length}
            </p>
          </div>
        </div>
        
        {/* Save status */}
        <div className="flex items-center space-x-2 text-sm">
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-green"></div>
              <span className="text-gray-600">Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <CheckIcon className="h-4 w-4 text-accent-green" />
              <span className="text-accent-green">Saved</span>
            </>
          ) : null}
        </div>
      </motion.div>

      {/* Audio Player */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-primary-900 mb-2">
            {segment.filename}
          </h2>
          <div className="text-sm text-gray-600">
            Duration: {formatTime(segment.duration)}
          </div>
        </div>

        {/* Waveform visualization */}
        <div className="mb-6">
          <div className="flex items-center space-x-1 h-16 bg-gray-50 rounded-card p-4 overflow-hidden">
            {segment.waveformData?.map((height, index) => (
              <div
                key={index}
                className="bg-accent-green opacity-70 w-1 transition-all duration-200 hover:opacity-100 cursor-pointer"
                style={{ height: `${(height / 100) * 40}px` }}
                onClick={() => handleSeek((index / segment.waveformData!.length) * segment.duration)}
              />
            ))}
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayback}
              className="btn-primary w-12 h-12 rounded-full p-0"
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6 ml-0.5" />
              )}
            </button>
            
            <div className="text-sm text-gray-600">
              {formatTime(currentTime)} / {formatTime(segment.duration)}
            </div>
          </div>

          {/* Playback speed */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <select
              value={playbackRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value);
                setPlaybackRate(rate);
                if (audioRef.current) {
                  audioRef.current.playbackRate = rate;
                }
              }}
              className="text-sm border border-gray-200 rounded px-2 py-1 bg-white"
            >
              <option value={0.5}>0.5×</option>
              <option value={0.75}>0.75×</option>
              <option value={1}>1×</option>
              <option value={1.25}>1.25×</option>
              <option value={1.5}>1.5×</option>
              <option value={2}>2×</option>
            </select>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        >
          <source src={`/audio/${segment.filename}`} type="audio/wav" />
        </audio>
      </motion.div>

      {/* Transcription Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card">
        <div className="mb-4">
          <label htmlFor="transcription" className="block text-lg font-semibold text-primary-900 mb-2">
            Transcription
          </label>
          <p className="text-secondary text-gray-600">
            Type the transcription in Hassaniya Arabic. The text will auto-save as you type.
          </p>
        </div>

        <textarea
          ref={textareaRef}
          id="transcription"
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          placeholder="Start typing the transcription here..."
          className="input-field min-h-[200px] resize-none text-right"
          dir="rtl"
          lang="ar"
        />

        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4" />
            <span>
              {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
            </span>
          </div>
          <div>
            {transcription.length} characters
          </div>
        </div>
      </motion.div>

      {/* Navigation and Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-4">
          {previousSegment && (
            <Link
              to={`/transcription/${previousSegment.id}`}
              className="btn-secondary flex-1 sm:flex-none"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </Link>
          )}
          
          {nextSegment && (
            <Link
              to={`/transcription/${nextSegment.id}`}
              className="btn-secondary flex-1 sm:flex-none ml-auto"
            >
              Next
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Link>
          )}
        </div>
        
        <button
          onClick={handleComplete}
          disabled={!transcription.trim() || isSaving}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckIcon className="h-4 w-4 mr-2" />
          Complete & Submit
        </button>
      </motion.div>
    </div>
  );
};