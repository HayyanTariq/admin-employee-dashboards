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
  Shield,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();

  if (!user) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6 xl:px-8 max-w-none w-full">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Certify One</h1>
              <p className="text-xs text-muted-foreground">Training Management</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold">Certify One</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden md:flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getRoleBadgeColor(user.role)}`}>
              {getRoleIcon(user.role)}
              <span className="capitalize">{user.role}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground">{user.department}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.firstName} />
                  <AvatarFallback className="gradient-primary text-primary-foreground">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <div className={`px-2 py-0.5 rounded text-xs font-medium flex items-center space-x-1 ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.department}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                {theme === 'light' ? (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Type className="mr-2 h-4 w-4" />
                  <span>Font Size</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem 
                    onClick={() => setFontSize('small')}
                    className={fontSize === 'small' ? 'bg-accent' : ''}
                  >
                    Small
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFontSize('medium')}
                    className={fontSize === 'medium' ? 'bg-accent' : ''}
                  >
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFontSize('large')}
                    className={fontSize === 'large' ? 'bg-accent' : ''}
                  >
                    Large
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};