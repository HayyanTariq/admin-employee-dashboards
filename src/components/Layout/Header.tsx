import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LogOut, 
  Settings, 
  Moon, 
  Sun, 
  Type,
  GraduationCap,
  User,
  Shield
} from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();

  if (!user) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />;
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' 
      ? 'bg-gradient-to-r from-purple-500/90 to-purple-600/90 text-white shadow-sm' 
      : 'bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white shadow-sm';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Brand Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 blur-sm -z-10" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Certify One
              </h1>
              <p className="text-xs text-muted-foreground/80 font-medium">Training Management System</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Certify One
              </h1>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-3">
          {/* User Info - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${getRoleBadge(user.role)}`}>
              {getRoleIcon(user.role)}
              <span className="capitalize tracking-wide">{user.role}</span>
            </div>
            <div className="text-right space-y-0.5">
              <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground/70 font-medium">{user.department}</p>
            </div>
          </div>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-11 w-11 rounded-full border-2 border-transparent hover:border-border/50 transition-all duration-200"
              >
                <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
                  <AvatarImage src={user.avatar} alt={user.firstName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-72 p-2 bg-background/95 backdrop-blur-sm border shadow-lg z-50" 
              align="end" 
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.firstName} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                      <div className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center space-x-1 w-fit ${getRoleBadge(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground/70">{user.department}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="my-2" />
              
              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer py-2.5 px-3">
                {theme === 'light' ? (
                  <>
                    <Moon className="mr-3 h-4 w-4" />
                    <span className="font-medium">Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="mr-3 h-4 w-4" />
                    <span className="font-medium">Light Mode</span>
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer py-2.5 px-3">
                  <Type className="mr-3 h-4 w-4" />
                  <span className="font-medium">Font Size</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="p-1 bg-background/95 backdrop-blur-sm border shadow-lg z-50">
                  <DropdownMenuItem 
                    onClick={() => setFontSize('small')}
                    className={`cursor-pointer py-2 ${fontSize === 'small' ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <span className="font-medium">Small</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFontSize('medium')}
                    className={`cursor-pointer py-2 ${fontSize === 'medium' ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <span className="font-medium">Medium</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFontSize('large')}
                    className={`cursor-pointer py-2 ${fontSize === 'large' ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <span className="font-medium">Large</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem className="cursor-pointer py-2.5 px-3">
                <Settings className="mr-3 h-4 w-4" />
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-2" />
              
              <DropdownMenuItem 
                onClick={logout} 
                className="cursor-pointer text-destructive hover:text-destructive py-2.5 px-3 focus:text-destructive"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};