import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  GraduationCap,
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
  { title: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
  { title: 'All Trainings', href: '/admin/trainings', icon: List },
  { title: 'User Management', href: '/admin/users', icon: Users },
  { title: 'Reports', href: '/admin/reports', icon: FileText },
  { title: 'Settings', href: '/settings', icon: Settings }
];

const employeeNavItems = [
  { title: 'My Dashboard', href: '/employee/dashboard', icon: User },
  { title: 'My Training', href: '/employee/training', icon: BookOpen },
  { title: 'My Sessions', href: '/employee/sessions', icon: Calendar },
  { title: 'My Courses', href: '/employee/courses', icon: GraduationCap },
  { title: 'My Certificates', href: '/employee/certificates', icon: Award },
  { title: 'Schedule', href: '/employee/schedule', icon: Calendar },
  { title: 'Settings', href: '/settings', icon: Settings }
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = user.role === 'admin' ? adminNavItems : employeeNavItems;
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold">Certify One</SheetTitle>
              <p className="text-xs text-muted-foreground">Training Platform</p>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 pb-4">
          <div className="flex items-center space-x-3 px-3 py-2 bg-muted/30 rounded-lg">
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

        <nav className="px-4 space-y-1 pb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full',
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
                <span className="font-medium">{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};