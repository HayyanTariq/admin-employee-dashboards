import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { TrainingList } from '@/components/Dashboard/TrainingList';
import { TrainingFormSlideout } from '@/components/TrainingForm/TrainingFormSlideout';
import { TrainingViewModal } from '@/components/Training/TrainingViewModal';
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
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [viewingTraining, setViewingTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>(mockTrainings);

  const stats = {
    totalEmployees: 142,
    totalTrainings: trainings.length,
    completedTrainings: trainings.filter(t => t.status === 'completed').length,
    inProgressTrainings: trainings.filter(t => t.status === 'in-progress').length,
  };

  const handleAddTraining = async (data: TrainingFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTraining: Training = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Training;
      
      if (editingTraining) {
        setTrainings(prev => prev.map(t => t.id === editingTraining.id ? { ...newTraining, id: editingTraining.id } : t));
        toast({
          title: "Training Updated",
          description: "Training has been successfully updated.",
        });
        setEditingTraining(null);
      } else {
        setTrainings(prev => [newTraining, ...prev]);
        toast({
          title: "Training Added",
          description: "New training has been successfully added.",
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save training. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTraining = (training: Training) => {
    setEditingTraining(training);
    setIsFormOpen(true);
  };

  const handleDeleteTraining = async (training: Training) => {
    if (window.confirm(`Are you sure you want to delete this ${training.type}?`)) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setTrainings(prev => prev.filter(t => t.id !== training.id));
        toast({
          title: "Training Deleted",
          description: "Training has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete training. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewTraining = (training: Training) => {
    setViewingTraining(training);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTraining(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Here's your training overview.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsFormOpen(true)} variant="gradient" className="w-full sm:w-auto">
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
          trainings={trainings}
          title="Recent Training Activities"
          limit={5}
          onView={handleViewTraining}
          onEdit={handleEditTraining}
          onDelete={handleDeleteTraining}
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
      
      <TrainingViewModal
        training={viewingTraining}
        isOpen={!!viewingTraining}
        onClose={() => setViewingTraining(null)}
      />
    </div>
  );
};