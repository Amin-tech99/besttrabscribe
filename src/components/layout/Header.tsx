import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 safe-area-top">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden touch-target flex items-center justify-center rounded-card text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={onMenuClick}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Logo/Title for mobile */}
          <div className="lg:hidden">
            <h1 className="text-lg font-semibold text-primary-900">Hassaniya</h1>
          </div>

          {/* Desktop title */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-primary-900">Audio Transcription Workflow</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="touch-target flex items-center justify-center rounded-card text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent-green rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">3</span>
              </span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-3 rounded-card p-2 text-sm hover:bg-gray-100 transition-colors touch-target"
                onClick={() => {
                  // In a real app, this would open a dropdown menu
                  if (window.confirm('Are you sure you want to logout?')) {
                    logout();
                  }
                }}
              >
                <div className="flex-shrink-0">
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-accent-green flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-primary-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role.replace('-', ' ')}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};