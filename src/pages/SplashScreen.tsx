import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-success/10">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="mx-auto h-24 w-24 gradient-primary rounded-3xl flex items-center justify-center shadow-strong animate-scale-in">
          <GraduationCap className="h-12 w-12 text-primary-foreground" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold font-serif bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Certify One
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Training & Certification Management
          </p>
        </div>

        <div className="flex justify-center">
          <div className="animate-pulse">
            <div className="flex space-x-2">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};