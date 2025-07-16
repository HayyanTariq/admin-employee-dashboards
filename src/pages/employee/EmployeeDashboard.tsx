import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

// Mock data for employee's trainings
const mockEmployeeTrainings: Training[] = [
  {
    id: '1',
    type: 'certification',
    employeeName: 'John Doe',
    role: 'Software Engineer',
    department: 'Engineering',
    category: 'Technical',
    status: 'completed',
    certificationName: 'React Professional Certification',
    issuingOrganization: 'Meta',
    issueDate: '2024-01-15',
    description: 'Advanced React development certification',
    skillsLearned: ['React', 'Redux', 'TypeScript'],
    level: 'advanced',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  } as Training,
  {
    id: '2',
    type: 'course',
    employeeName: 'John Doe',
    role: 'Software Engineer',
    department: 'Engineering',
    category: 'Technical',
    status: 'in-progress',
    courseTitle: 'Advanced Node.js Development',
    platform: 'Udemy',
    startDate: '2024-01-10',
    courseDuration: '12 hours',
    courseDescription: 'Deep dive into Node.js backend development',
    skillsLearned: ['Node.js', 'Express', 'MongoDB'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  } as Training,
];

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stats = {
    myTrainings: mockEmployeeTrainings.length,
    completedTrainings: mockEmployeeTrainings.filter(t => t.status === 'completed').length,
    inProgressTrainings: mockEmployeeTrainings.filter(t => t.status === 'in-progress').length,
    certificates: mockEmployeeTrainings.filter(t => t.type === 'certification').length,
  };

  const handleAddTraining = async (data: TrainingFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('New training data:', data);
      // In real app, this would make an API call to your ASP.NET backend
    } finally {
      setIsLoading(false);
    }
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
            trainings={mockEmployeeTrainings}
            title="My Recent Trainings"
            showActions={true}
            onView={(training) => console.log('View training:', training)}
            onEdit={(training) => console.log('Edit training:', training)}
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
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTraining}
        isLoading={isLoading}
      />
    </div>
  );
};