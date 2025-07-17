
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTraining } from '@/contexts/TrainingContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { TrainingFormSlideout } from '@/components/TrainingForm/TrainingFormSlideout';
import { TrainingViewModal } from '@/components/Training/TrainingViewModal';
import { RecentTrainingActivities } from '@/components/Admin/RecentTrainingActivities';
import { 
  Users, 
  Award, 
  BookOpen, 
  TrendingUp,
  Plus,
  Filter,
  Download,
  Calendar,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';
import { Training, TrainingFormData } from '@/types/training';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Mock data for demonstration (used as fallback if useTraining is unavailable)
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

// DeleteTrainingModal component
interface DeleteTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  training: Training | null;
  isLoading: boolean;
}

const DeleteTrainingModal: React.FC<DeleteTrainingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  training,
  isLoading,
}) => {
  const trainingName = training
    ? training.type === 'certification'
      ? training.certificationName
      : training.type === 'course'
      ? training.courseTitle
      : training.sessionTopic
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Training</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the training "{trainingName}" for {training?.employeeName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// TrainingList component
interface TrainingListProps {
  trainings: Training[];
  title: string;
  limit?: number;
  onView: (training: Training) => void;
  onEdit: (training: Training) => void;
  onDelete: (training: Training) => void;
}

const TrainingList: React.FC<TrainingListProps> = ({
  trainings,
  title,
  limit,
  onView,
  onEdit,
  onDelete,
}) => {
  const displayedTrainings = limit ? trainings.slice(0, limit) : trainings;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black">Employee</TableHead>
              <TableHead className="text-black">Training</TableHead>
              <TableHead className="text-black">Category</TableHead>
              <TableHead className="text-black">Status</TableHead>
              <TableHead className="text-black">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTrainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell className="text-black">{training.employeeName}</TableCell>
                <TableCell className="text-black">
                  {training.type === 'certification'
                    ? training.certificationName
                    : training.type === 'course'
                    ? training.courseTitle
                    : training.sessionTopic}
                </TableCell>
                <TableCell className="text-black">{training.category}</TableCell>
                <TableCell className="text-black capitalize">{training.status}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(training)}
                      className="text-black hover:text-black"
                      aria-label={`View training for ${training.employeeName}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(training)}
                      className="text-black hover:text-black"
                      aria-label={`Edit training for ${training.employeeName}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(training)}
                      className="text-black hover:text-black"
                      aria-label={`Delete training for ${training.employeeName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {displayedTrainings.length === 0 && (
        <p className="mt-4 text-center text-muted-foreground">No training activities found.</p>
      )}
    </div>
  );
};

// AdminDashboard component
export const AdminDashboard = () => {
  const { user } = useAuth();
  const { trainings, addTraining, updateTraining, deleteTraining } = useTraining();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [viewingTraining, setViewingTraining] = useState<Training | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);

  const stats = {
    totalEmployees: 125,
    totalTrainings: trainings.length,
    completedTrainings: trainings.filter(t => t.status === 'completed').length,
    inProgressTrainings: trainings.filter(t => t.status === 'in-progress').length,
  };

  const handleAddTraining = async (data: TrainingFormData) => {
    setIsLoading(true);
    try {
      if (editingTraining) {
        await updateTraining(editingTraining.id, data);
        toast({
          title: "Training Updated",
          description: `Training for ${data.employeeName} has been updated successfully.`,
        });
        setEditingTraining(null);
      } else {
        await addTraining(data);
        toast({
          title: "Training Added",
          description: `Training for ${data.employeeName} has been added successfully.`,
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

  const handleDeleteTraining = (training: Training) => {
    setTrainingToDelete(training);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTraining = async () => {
    if (!trainingToDelete) return;
    setIsLoading(true);
    try {
      await deleteTraining(trainingToDelete.id);
      toast({
        title: "Training Deleted",
        description: `Training "${trainingToDelete.type === 'certification' ? trainingToDelete.certificationName : trainingToDelete.type === 'course' ? trainingToDelete.courseTitle : trainingToDelete.sessionTopic}" for ${trainingToDelete.employeeName} has been deleted.`,
      });
      setDeleteModalOpen(false);
      setTrainingToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete training. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <RecentTrainingActivities
          trainings={trainings}
          title="Recent Training Activities"
          limit={4}
          onView={setViewingTraining}
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

      <DeleteTrainingModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTrainingToDelete(null);
        }}
        onConfirm={confirmDeleteTraining}
        training={trainingToDelete}
        isLoading={isLoading}
      />
    </div>
  );
};
