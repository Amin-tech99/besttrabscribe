import React, { useState } from 'react';
import { 
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalSegments: number;
  completedSegments: number;
  averageCompletionTime: number;
  qualityScore: number;
  dailyStats: {
    date: string;
    completed: number;
    reviewed: number;
    users: number;
  }[];
  userPerformance: {
    userId: string;
    name: string;
    completed: number;
    averageTime: number;
    qualityScore: number;
  }[];
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    storage: number;
  };
}

export const SystemAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalUsers: 25,
    activeUsers: 18,
    totalSegments: 1250,
    completedSegments: 892,
    averageCompletionTime: 4.2,
    qualityScore: 94.5,
    dailyStats: [
      { date: '2024-01-09', completed: 45, reviewed: 38, users: 12 },
      { date: '2024-01-10', completed: 52, reviewed: 41, users: 15 },
      { date: '2024-01-11', completed: 38, reviewed: 35, users: 11 },
      { date: '2024-01-12', completed: 61, reviewed: 48, users: 16 },
      { date: '2024-01-13', completed: 44, reviewed: 39, users: 13 },
      { date: '2024-01-14', completed: 58, reviewed: 52, users: 17 },
      { date: '2024-01-15', completed: 49, reviewed: 43, users: 14 }
    ],
    userPerformance: [
      // Dynamic user performance data will be loaded from actual users
    ],
    systemHealth: {
      uptime: 99.8,
      responseTime: 245,
      errorRate: 0.12,
      storage: 68.5
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    
    return {
      value: Math.abs(change).toFixed(1),
      isPositive,
      icon: isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      color: isPositive ? 'text-accent-green' : 'text-red-500'
    };
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    change?: { value: string; isPositive: boolean; icon: React.ComponentType<any>; color: string };
    delay?: number;
  }> = ({ title, value, subtitle, icon: Icon, change, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {change && (
            <div className={`flex items-center mt-2 text-sm ${change.color}`}>
              <change.icon className="h-4 w-4 mr-1" />
              <span>{change.value}%</span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="h-12 w-12 bg-accent-blue bg-opacity-10 rounded-card flex items-center justify-center">
            <Icon className="h-6 w-6 text-accent-blue" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-title-mobile sm:text-title text-primary-900 mb-2">
            System Analytics
          </h1>
          <p className="text-secondary text-gray-600">
            Comprehensive insights into system performance and user activity
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field min-w-[120px]"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={analyticsData.totalUsers}
          subtitle={`${analyticsData.activeUsers} active`}
          icon={UserGroupIcon}
          change={getChangeIndicator(analyticsData.totalUsers, 22)}
          delay={0}
        />
        
        <StatCard
          title="Segments Completed"
          value={analyticsData.completedSegments}
          subtitle={`${analyticsData.totalSegments} total`}
          icon={DocumentTextIcon}
          change={getChangeIndicator(analyticsData.completedSegments, 825)}
          delay={0.1}
        />
        
        <StatCard
          title="Avg. Completion Time"
          value={`${analyticsData.averageCompletionTime} min`}
          icon={ClockIcon}
          change={getChangeIndicator(analyticsData.averageCompletionTime, 4.8)}
          delay={0.2}
        />
        
        <StatCard
          title="Quality Score"
          value={`${analyticsData.qualityScore}%`}
          icon={ChartBarIcon}
          change={getChangeIndicator(analyticsData.qualityScore, 92.1)}
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              Daily Activity
            </h3>
            <p className="text-sm text-gray-600">
              Segments completed and reviewed over time
            </p>
          </div>
          
          <div className="space-y-4">
            {analyticsData.dailyStats.map((day, index) => {
              const maxValue = Math.max(...analyticsData.dailyStats.map(d => Math.max(d.completed, d.reviewed)));
              const completedWidth = (day.completed / maxValue) * 100;
              const reviewedWidth = (day.reviewed / maxValue) * 100;
              
              return (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">
                      {formatDate(day.date)}
                    </span>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{day.users} users</span>
                      <span>{day.completed} completed</span>
                      <span>{day.reviewed} reviewed</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completedWidth}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                          className="bg-accent-green h-2 rounded-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${reviewedWidth}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                          className="bg-accent-blue h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-green rounded-full"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-blue rounded-full"></div>
              <span className="text-gray-600">Reviewed</span>
            </div>
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              System Health
            </h3>
            <p className="text-sm text-gray-600">
              Real-time system performance metrics
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Uptime */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Uptime</span>
                <span className="text-sm font-bold text-accent-green">
                  {analyticsData.systemHealth.uptime}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analyticsData.systemHealth.uptime}%` }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="bg-accent-green h-2 rounded-full"
                />
              </div>
            </div>
            
            {/* Response Time */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Response Time</span>
                <span className="text-sm font-bold text-accent-blue">
                  {analyticsData.systemHealth.responseTime}ms
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((500 - analyticsData.systemHealth.responseTime) / 500 * 100, 100)}%` }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="bg-accent-blue h-2 rounded-full"
                />
              </div>
            </div>
            
            {/* Error Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Error Rate</span>
                <span className="text-sm font-bold text-accent-amber">
                  {analyticsData.systemHealth.errorRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analyticsData.systemHealth.errorRate * 10}%` }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="bg-accent-amber h-2 rounded-full"
                />
              </div>
            </div>
            
            {/* Storage Usage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                <span className="text-sm font-bold text-primary-900">
                  {analyticsData.systemHealth.storage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analyticsData.systemHealth.storage}%` }}
                  transition={{ delay: 0.9, duration: 1 }}
                  className="bg-primary-600 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            Top Performers
          </h3>
          <p className="text-sm text-gray-600">
            Workers with highest productivity and quality scores
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Worker</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Completed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Avg. Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Quality Score</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.userPerformance.map((user, index) => (
                <motion.tr
                  key={user.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-accent-green rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{user.completed}</td>
                  <td className="py-3 px-4 text-gray-900">{user.averageTime} min</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{user.qualityScore}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-accent-green h-2 rounded-full"
                          style={{ width: `${user.qualityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};