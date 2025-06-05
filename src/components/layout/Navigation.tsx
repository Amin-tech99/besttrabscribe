import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  MicrophoneIcon,
  ClipboardDocumentCheckIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { NavigationItem } from '../../types';

interface NavigationProps {
  onClose?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      current: location.pathname === '/dashboard',
      roles: ['worker', 'admin', 'super-admin'],
    },
    {
      name: 'Review Queue',
      href: '/review',
      icon: ClipboardDocumentCheckIcon,
      current: location.pathname === '/review',
      roles: ['admin', 'super-admin'],
    },
    {
      name: 'Upload ZIP',
      href: '/upload',
      icon: ArrowUpTrayIcon,
      current: location.pathname === '/upload',
      roles: ['admin', 'super-admin'],
    },
    {
      name: 'Export',
      href: '/export',
      icon: ArrowDownTrayIcon,
      current: location.pathname === '/export',
      roles: ['admin', 'super-admin'],
    },
    {
      name: 'User Management',
      href: '/users',
      icon: UsersIcon,
      current: location.pathname === '/users',
      roles: ['super-admin'],
    },
    {
      name: 'Statistics',
      href: '/statistics',
      icon: ChartBarIcon,
      current: location.pathname === '/statistics',
      roles: ['super-admin'],
    },
    {
      name: 'Guidelines',
      href: '/guidelines',
      icon: DocumentTextIcon,
      current: location.pathname === '/guidelines',
      roles: ['worker', 'admin', 'super-admin'],
    },
  ];

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <MicrophoneIcon className="h-8 w-8 text-accent-green" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-primary-900">Hassaniya</h1>
            <p className="text-xs text-gray-500">Transcription Tool</p>
          </div>
        </div>
        
        {/* Close button for mobile */}
        {onClose && (
          <button
            type="button"
            className="lg:hidden touch-target flex items-center justify-center rounded-card text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) => `
                group flex items-center px-4 py-3 text-sm font-medium rounded-card transition-all duration-200 touch-target
                ${isActive
                  ? 'bg-accent-green text-white shadow-card'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary-900'
                }
              `}
            >
              <Icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {user?.avatar ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-accent-green flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role.replace('-', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};