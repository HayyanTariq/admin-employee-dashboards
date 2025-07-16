
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { TrainingList } from '@/components/Dashboard/TrainingList';
import { TrainingFormSlideout } from '@/components/TrainingForm/TrainingFormSlideout';
import { 
  Users, 
  Award, 
  BookOpen, 
  TrendingUp,
  Plus,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import { Training, TrainingFormData } from '@/types/training';

// Mock data for demonstration
const mockTrainings: Training[] = [
  {
    id: '1',
    type: 'certification',
    employeeName: 'John Doe',
    role: 'Software Engineer',
    department: 'Engineering',
    category: 'Technical',
    status: 'completed',
    certificationName: 'AWS Solutions Architect',
    issuingOrganization: 'Amazon Web Services',
    issueDate: '2024-01-15',
    expirationDate: '2027-01-15',
    credentialId: 'AWS-SAA-123456',
    description: 'Cloud architecture certification',
    skillsLearned: ['Cloud Architecture', 'AWS Services', 'Security'],
    level: 'advanced',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  } as Training,
  {
    id: '2',
    type: 'course',
    employeeName: 'Jane Smith',
    role: 'Product Manager',
    department: 'Product',
    category: 'Soft Skills',
    status: 'in-progress',
    courseTitle: 'Advanced Project Management',
    platform: 'Coursera',
    startDate: '2024-01-10',
    courseDuration: '8 weeks',
    courseDescription: 'Comprehensive project management course',
    skillsLearned: ['Project Management', 'Leadership', 'Communication'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  } as Training,
  {
    id: '3',
    type: 'session',
    employeeName: 'Mike Johnson',
    role: 'Designer',
    department: 'Design',
    category: 'Technical',
    status: 'scheduled',
    instructorName: 'Sarah Wilson',
    sessionTopic: 'Advanced UI/UX Principles',
    sessionDate: '2024-01-20',
    startTime: '14:00',
    endTime: '16:00',
    duration: '2h 0m',
    location: 'online',
    agenda: 'Design systems, accessibility, user research',
    learnedOutcome: 'Modern design principles and best practices',
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z'
  } as Training,
];

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stats = {
    totalEmployees: 125,
    totalTrainings: mockTrainings.length,
    completedTrainings: mockTrainings.filter(t => t.status === 'completed').length,
    inProgressTrainings: mockTrainings.filter(t => t.status === 'in-progress').length,
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
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Here's your training overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsFormOpen(true)} variant="gradient">
            <Plus className="mr-2 h-4 w-4" />
            Add Training
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          description="Active employees"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="default"
        />
        <StatsCard
          title="Total Trainings"
          value={stats.totalTrainings}
          description="All training records"
          icon={BookOpen}
          trend={{ value: 8, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="Completed"
          value={stats.completedTrainings}
          description="Finished trainings"
          icon={Award}
          trend={{ value: 15, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgressTrainings}
          description="Ongoing trainings"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
          variant="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TrainingList
          trainings={mockTrainings}
          title="Recent Training Activities"
          limit={5}
          onView={(training) => console.log('View training:', training)}
          onEdit={(training) => console.log('Edit training:', training)}
          onDelete={(training) => console.log('Delete training:', training)}
        />
        
        <div className="space-y-6">
          <StatsCard
            title="This Month"
            value="23"
            description="New trainings added"
            icon={Calendar}
            variant="default"
            className="w-full"
          />
          
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-success/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setIsFormOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Training
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/reports')}
              >
                <Award className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </div>
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
