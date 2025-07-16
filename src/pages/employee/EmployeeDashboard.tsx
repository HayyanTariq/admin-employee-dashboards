import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTraining } from '@/contexts/TrainingContext';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { TrainingList } from '@/components/Dashboard/TrainingList';
import { TrainingFormSlideout } from '@/components/TrainingForm/TrainingFormSlideout';
import { 
  Award, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Plus,
  Calendar,
  Target,
  CheckCircle
} from 'lucide-react';
import { Training, TrainingFormData } from '@/types/training';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { trainings, addTraining, updateTraining, deleteTraining } = useTraining();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stats = {
    myTrainings: trainings.length,
    completedTrainings: trainings.filter(t => t.status === 'completed').length,
    inProgressTrainings: trainings.filter(t => t.status === 'in-progress').length,
    certificates: trainings.filter(t => t.type === 'certification').length,
  };

  const handleAddTraining = async (data: TrainingFormData) => {
    setIsLoading(true);
    try {
      if (editingTraining) {
        await updateTraining(editingTraining.id, data);
        setEditingTraining(null);
      } else {
        await addTraining(data);
      }
      setIsFormOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTraining = (training: Training) => {
    setEditingTraining(training);
    setIsFormOpen(true);
  };

  const handleDeleteTraining = async (training: Training) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      await deleteTraining(training.id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTraining(null);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Track your learning journey.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={() => setIsFormOpen(true)} variant="gradient">
            <Plus className="mr-2 h-4 w-4" />
            Add Training
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="My Trainings"
          value={stats.myTrainings}
          description="Total training records"
          icon={BookOpen}
          variant="default"
        />
        <StatsCard
          title="Completed"
          value={stats.completedTrainings}
          description="Finished trainings"
          icon={CheckCircle}
          trend={{ value: 20, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgressTrainings}
          description="Ongoing trainings"
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Certificates"
          value={stats.certificates}
          description="Earned certificates"
          icon={Award}
          trend={{ value: 10, isPositive: true }}
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrainingList
            trainings={trainings.slice(0, 5)}
            title="My Recent Trainings"
            showActions={true}
            onView={(training) => console.log('View training:', training)}
            onEdit={handleEditTraining}
            onDelete={handleDeleteTraining}
          />
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-success/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Learning Goals
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Complete 5 courses</span>
                <span className="text-sm font-medium text-success">3/5</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm">Earn 3 certificates</span>
                <span className="text-sm font-medium text-success">1/3</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="font-medium">JavaScript Advanced</p>
                  <p className="text-muted-foreground">Course deadline</p>
                </div>
                <span className="text-warning text-xs">3 days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="font-medium">Team Training Session</p>
                  <p className="text-muted-foreground">Scheduled session</p>
                </div>
                <span className="text-primary text-xs">Next week</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Training
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Award className="mr-2 h-4 w-4" />
              View My Certificates
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              My Schedule
            </Button>
          </div>
        </div>
      </div>

      <TrainingFormSlideout
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleAddTraining}
        isLoading={isLoading}
        initialData={editingTraining ? {
          employeeName: editingTraining.employeeName,
          role: editingTraining.role,
          department: editingTraining.department,
          category: editingTraining.category,
          status: editingTraining.status,
          type: editingTraining.type,
          ...editingTraining
        } : undefined}
      />
    </div>
  );
};