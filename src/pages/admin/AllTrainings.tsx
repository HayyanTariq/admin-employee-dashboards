import React, { useState } from 'react';
import { useTraining } from '@/contexts/TrainingContext';
import { TrainingList } from '@/components/Dashboard/TrainingList';
import { TrainingFormSlideout } from '@/components/TrainingForm/TrainingFormSlideout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { TrainingFormData } from '@/types/training';
import { useToast } from '@/hooks/use-toast';

export const AllTrainings = () => {
  const { trainings, addTraining, updateTraining, deleteTraining } = useTraining();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleAddTraining = async (data: TrainingFormData) => {
    try {
      addTraining(data);
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Training added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add training",
        variant: "destructive",
      });
    }
  };

  const handleEditTraining = async (data: TrainingFormData) => {
    try {
      if (editingTraining) {
        updateTraining(editingTraining.id, data);
        setEditingTraining(null);
        setIsFormOpen(false);
        toast({
          title: "Success",
          description: "Training updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update training",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (training: any) => {
    setEditingTraining(training);
    setIsFormOpen(true);
  };

  const handleDelete = (training: any) => {
    deleteTraining(training.id);
    toast({
      title: "Success",
      description: "Training deleted successfully",
    });
  };

  const filteredTrainings = trainings.filter(training => {
    const searchFields = [
      training.employeeName?.toLowerCase(),
      training.type === 'certification' && 'certificationName' in training ? training.certificationName?.toLowerCase() : '',
      training.type === 'course' && 'courseTitle' in training ? training.courseTitle?.toLowerCase() : '',
      training.type === 'session' && 'sessionTopic' in training ? training.sessionTopic?.toLowerCase() : ''
    ].filter(Boolean);
    
    const matchesSearch = searchFields.some(field => field.includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || training.status === statusFilter;
    const matchesType = typeFilter === 'all' || training.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Trainings</h1>
          <p className="text-muted-foreground">
            Manage all training records across the organization
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} variant="gradient">
          <Plus className="mr-2 h-4 w-4" />
          Add Training
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trainings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="certification">Certification</SelectItem>
            <SelectItem value="course">Course</SelectItem>
            <SelectItem value="session">Session</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="bg-card rounded-lg border">
        <TrainingList
          trainings={filteredTrainings}
          title={`Training Records (${filteredTrainings.length})`}
          onView={(training) => console.log('View training:', training)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />
      </div>

      <TrainingFormSlideout
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTraining(null);
        }}
        onSubmit={editingTraining ? handleEditTraining : handleAddTraining}
        initialData={editingTraining}
        isLoading={false}
      />
    </div>
  );
};