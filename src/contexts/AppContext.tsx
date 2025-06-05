import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AudioSegment, Batch, Statistics, TranscriptionProgress, User } from '../types';
import { mockUsers } from './AuthContext';

interface AppContextType {
  segments: AudioSegment[];
  batches: Batch[];
  users: User[];
  statistics: Statistics;
  transcriptionProgress: TranscriptionProgress[];
  updateSegment: (segmentId: string, updates: Partial<AudioSegment>) => void;
  updateTranscriptionProgress: (segmentId: string, progress: Partial<TranscriptionProgress>) => void;
  getSegmentsByStatus: (status: AudioSegment['status']) => AudioSegment[];
  getBatchProgress: (batchId: string) => { completed: number; total: number };
  refreshData: () => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [segments, setSegments] = useState<AudioSegment[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalSegments: 0,
    completedSegments: 0,
    averageProcessingTime: 0,
    approvalRate: 0,
    activeWorkers: 0,
    dailyProgress: [],
  });
  const [transcriptionProgress, setTranscriptionProgress] = useState<TranscriptionProgress[]>([]);

  // Mock data initialization
  useEffect(() => {
    const initializeData = () => {
      // Production: Start with empty data
      const initialBatches: Batch[] = [];
      // Initialize users with authenticated users from AuthContext
      const initialUsers: User[] = mockUsers.map(({ password, ...user }) => user);
      const initialSegments: AudioSegment[] = [];
      const initialStatistics: Statistics = {
        totalSegments: 0,
        completedSegments: 0,
        averageProcessingTime: 0,
        approvalRate: 0,
        activeWorkers: 0,
        dailyProgress: [],
      };

      setBatches(initialBatches);
      setSegments(initialSegments);
      setUsers(initialUsers);
      setStatistics(initialStatistics);
    };

    initializeData();
  }, []);

  const updateSegment = (segmentId: string, updates: Partial<AudioSegment>) => {
    setSegments(prev => 
      prev.map(segment => 
        segment.id === segmentId 
          ? { ...segment, ...updates, updatedAt: new Date() }
          : segment
      )
    );
  };

  const updateTranscriptionProgress = (segmentId: string, progress: Partial<TranscriptionProgress>) => {
    setTranscriptionProgress(prev => {
      const existing = prev.find(p => p.segmentId === segmentId);
      if (existing) {
        return prev.map(p => 
          p.segmentId === segmentId 
            ? { ...p, ...progress, lastSaved: new Date() }
            : p
        );
      } else {
        return [...prev, {
          segmentId,
          progress: 0,
          lastSaved: new Date(),
          autoSaveEnabled: true,
          ...progress,
        }];
      }
    });
  };

  const getSegmentsByStatus = (status: AudioSegment['status']) => {
    return segments.filter(segment => segment.status === status);
  };

  const getBatchProgress = (batchId: string) => {
    const batchSegments = segments.filter(segment => segment.batchId === batchId);
    const completed = batchSegments.filter(segment => segment.status === 'completed').length;
    return { completed, total: batchSegments.length };
  };

  const refreshData = () => {
    // In a real app, this would refetch data from the API
    console.log('Refreshing data...');
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, ...updates }
          : user
      )
    );
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const value = {
    segments,
    batches,
    users,
    statistics,
    transcriptionProgress,
    updateSegment,
    updateTranscriptionProgress,
    getSegmentsByStatus,
    getBatchProgress,
    refreshData,
    addUser,
    updateUser,
    deleteUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};