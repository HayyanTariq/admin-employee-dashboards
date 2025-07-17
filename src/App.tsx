
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TrainingProvider } from "@/contexts/TrainingContext";
import { SplashScreen } from "@/pages/SplashScreen";
import { LoginForm } from "@/components/LoginForm";
import { AppLayout } from "@/components/Layout/AppLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { UserManagement } from "@/pages/admin/UserManagement";
import { AllTrainings } from "@/pages/admin/AllTrainings";
import { Reports } from "@/pages/admin/Reports";
import { EmployeeDashboard } from "@/pages/employee/EmployeeDashboard";
import { MyTraining } from "@/pages/employee/MyTraining";
import { MySessions } from "@/pages/employee/MySessions";
import { MyCourses } from "@/pages/employee/MyCourses";
import { MyCertificates } from "@/pages/employee/MyCertificates";
import { Schedule } from "@/pages/employee/Schedule";
import { Settings } from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

const RoleBasedRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'admin' 
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/employee/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SplashScreen />} />
    <Route path="/login" element={<LoginForm />} />
    <Route 
      path="/admin/dashboard" 
      element={
        <ProtectedRoute adminOnly={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/users" 
      element={
        <ProtectedRoute adminOnly={true}>
          <UserManagement />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/trainings" 
      element={
        <ProtectedRoute adminOnly={true}>
          <AllTrainings />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/reports" 
      element={
        <ProtectedRoute adminOnly={true}>
          <Reports />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/employee/dashboard" 
      element={
        <ProtectedRoute>
          <EmployeeDashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/employee/training" 
      element={
        <ProtectedRoute>
          <MyTraining />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/employee/sessions" 
      element={
        <ProtectedRoute>
          <MySessions />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/employee/courses" 
      element={
        <ProtectedRoute>
          <MyCourses />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/employee/certificates" 
      element={
        <ProtectedRoute>
          <MyCertificates />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/employee/schedule" 
      element={
        <ProtectedRoute>
          <Schedule />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/settings" 
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } 
    />
    <Route path="/dashboard" element={<RoleBasedRedirect />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TrainingProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </TrainingProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
