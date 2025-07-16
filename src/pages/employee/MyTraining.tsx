import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { TrainingList } from '@/components/Dashboard/TrainingList';
import { TrainingFormSlideout } from '@/components/TrainingForm/TrainingFormSlideout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Training, TrainingFormData } from '@/types/training';
import { Plus, Search, Filter, BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
  {
    id: '3',
    type: 'session',
    employeeName: 'John Doe',
    role: 'Software Engineer',
    department: 'Engineering',
    category: 'Soft Skills',
    status: 'completed',
    instructorName: 'Sarah Wilson',
    sessionTopic: 'Effective Communication in Teams',
    sessionDate: '2024-01-08',
    startTime: '09:00',
    endTime: '11:00',
    duration: '2 hours',
    location: 'on-site',
    agenda: 'Communication styles, active listening, conflict resolution',
    learnedOutcome: 'Improved team communication skills',
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-08T09:00:00Z'
  } as Training,
];

const statusColors = {
  'completed': 'secondary',
  'in-progress': 'outline',
  'scheduled': 'default',
  'pending': 'destructive'
} as const;

const statusIcons = {
  'completed': CheckCircle,
  'in-progress': Clock,
  'scheduled': BookOpen,
  'pending': AlertCircle
};

export const MyTraining = () => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleAddTraining = async (data: TrainingFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('New training data:', data);
      // In real app, this would make an API call to your ASP.NET backend
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTrainings = mockEmployeeTrainings.filter(training => {
    const matchesSearch = training.type === 'certification' 
      ? training.certificationName?.toLowerCase().includes(searchTerm.toLowerCase())
      : training.type === 'course'
      ? training.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      : training.sessionTopic?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || training.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || training.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Training</h1>
          <p className="text-muted-foreground">
            Manage and track all your training activities
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} variant="gradient">
          <Plus className="mr-2 h-4 w-4" />
          Add Training
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(statusColors).map(([status, variant]) => {
          const count = mockEmployeeTrainings.filter(t => t.status === status).length;
          const Icon = statusIcons[status as keyof typeof statusIcons];
          
          return (
            <div key={status} className="rounded-lg border bg-card p-4">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium capitalize">{status.replace('-', ' ')}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold">{count}</span>
                <Badge variant={variant}>{status}</Badge>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trainings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Soft Skills">Soft Skills</SelectItem>
            <SelectItem value="Compliance">Compliance</SelectItem>
            <SelectItem value="Leadership">Leadership</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Training List */}
      <TrainingList
        trainings={filteredTrainings}
        title={`Training Records (${filteredTrainings.length})`}
        showActions={true}
        onView={(training) => console.log('View training:', training)}
        onEdit={(training) => console.log('Edit training:', training)}
      />

      <TrainingFormSlideout
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTraining}
        isLoading={isLoading}
      />
    </div>
  );
};