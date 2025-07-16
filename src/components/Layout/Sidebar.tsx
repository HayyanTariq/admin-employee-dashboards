import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  Plus,
  List,
  Users,
  Settings,
  BarChart3,
  FileText,
  Award,
  BookOpen,
  Calendar,
  User,
  Shield
} from 'lucide-react';

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: BarChart3,
    description: 'Overview and analytics'
  },
  {
    title: 'All Trainings',
    href: '/admin/trainings',
    icon: List,
    description: 'View and manage trainings'
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    description: 'Manage employees'
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: FileText,
    description: 'Training reports'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System settings'
  }
];

const employeeNavItems = [
  {
    title: 'My Dashboard',
    href: '/employee/dashboard',
    icon: User,
    description: 'Your training overview'
  },
  {
    title: 'My Training',
    href: '/employee/training',
    icon: BookOpen,
    description: 'Manage your trainings'
  },
  {
    title: 'My Certificates',
    href: '/employee/certificates',
    icon: Award,
    description: 'View certificates'
  },
  {
    title: 'Schedule',
    href: '/employee/schedule',
    icon: Calendar,
    description: 'Training schedule'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Account settings'
  }
];

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = user.role === 'admin' ? adminNavItems : employeeNavItems;
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden lg:flex lg:w-64 xl:w-72 lg:flex-col lg:fixed lg:inset-y-0 pt-16">
      <div className="flex flex-col flex-grow bg-card border-r overflow-y-auto">
        <div className="flex-1 px-4 xl:px-6 py-6 space-y-1">
          <div className="mb-6">
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                user.role === 'admin' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}>
                {user.role === 'admin' ? (
                  <Shield className="h-4 w-4 text-white" />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium capitalize">{user.role} Panel</p>
                <p className="text-xs text-muted-foreground">{user.firstName} {user.lastName}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  <Icon className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                    isActive(item.href) 
                      ? 'text-primary-foreground' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  )} />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className={cn(
                      'text-xs mt-0.5',
                      isActive(item.href)
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground/80 group-hover:text-foreground/80'
                    )}>
                      {item.description}
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Certify One</p>
                <p className="text-xs text-muted-foreground">Training Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};