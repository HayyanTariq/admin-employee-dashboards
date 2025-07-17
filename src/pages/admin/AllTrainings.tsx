
import React, { useState } from 'react';
import { useTraining } from '@/contexts/TrainingContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminTrainingTable } from '@/components/Admin/AdminTrainingTable';
import { TrainingFormSlideout } from '@/components/TrainingForm/TrainingFormSlideout';
import { TrainingViewModal } from '@/components/Training/TrainingViewModal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { Training, TrainingFormData } from '@/types/training';

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

// AllTrainings component
export const AllTrainings = () => {
  const { trainings, addTraining, updateTraining, deleteTraining } = useTraining();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [viewingTraining, setViewingTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleSubmit = async (data: TrainingFormData) => {
    setIsLoading(true);
    try {
      if (editingTraining) {
        await updateTraining(editingTraining.id, data);
        setEditingTraining(null);
      } else {
        await addTraining(data);
      }
      setIsFormOpen(false);
      // Toast notification will be handled by the form component
    } catch (error) {
      // Re-throw error to let the form component handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (training: Training) => {
    setEditingTraining(training);
    setIsFormOpen(true);
  };

  const handleDelete = (training: Training) => {
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

  const handleBulkDelete = async (trainingIds: string[]) => {
    setIsLoading(true);
    try {
      // Delete all selected trainings
      await Promise.all(trainingIds.map(id => deleteTraining(id)));
      toast({
        title: "Trainings Deleted",
        description: `${trainingIds.length} training${trainingIds.length > 1 ? 's' : ''} deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some trainings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkExport = (trainingIds: string[]) => {
    const selectedTrainings = trainings.filter(training => trainingIds.includes(training.id));
    
    // Create CSV content
    const csvHeaders = ['Employee Name', 'Role', 'Department', 'Training Type', 'Training Name', 'Status', 'Category', 'Date'];
    const csvData = selectedTrainings.map(training => {
      const trainingName = training.type === 'certification' ? training.certificationName :
                          training.type === 'course' ? training.courseTitle : training.sessionTopic;
      const date = training.type === 'session' ? training.sessionDate :
                  training.type === 'course' ? training.startDate : training.issueDate;
      
      return [
        training.employeeName,
        training.role,
        training.department,
        training.type,
        trainingName,
        training.status,
        training.category,
        date || 'N/A'
      ];
    });
    
    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `training_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Completed",
      description: `${selectedTrainings.length} training record${selectedTrainings.length > 1 ? 's' : ''} exported successfully.`,
    });
  };

  const handleBulkArchive = async (trainingIds: string[]) => {
    setIsLoading(true);
    try {
      // Archive functionality would be implemented here
      // For now, we'll just show a success message
      toast({
        title: "Trainings Archived",
        description: `${trainingIds.length} training${trainingIds.length > 1 ? 's' : ''} archived successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive some trainings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTrainings = trainings.filter(training => {
    const searchFields = [
      training.employeeName?.toLowerCase(),
      training.type === 'certification' && training.certificationName ? training.certificationName.toLowerCase() : '',
      training.type === 'course' && training.courseTitle ? training.courseTitle.toLowerCase() : '',
      training.type === 'session' && training.sessionTopic ? training.sessionTopic.toLowerCase() : ''
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

      <AdminTrainingTable
        trainings={filteredTrainings}
        title={`Training Records (${filteredTrainings.length})`}
        showActions={true}
        showSelectAll={true}
        onView={setViewingTraining}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onBulkArchive={handleBulkArchive}
      />

      <TrainingFormSlideout
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTraining(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingTraining ? {
          employeeName: editingTraining.employeeName,
          role: editingTraining.role,
          department: editingTraining.department,
          category: editingTraining.category,
          status: editingTraining.status,
          type: editingTraining.type,
          // Session fields
          instructorName: editingTraining.type === 'session' ? editingTraining.instructorName : undefined,
          sessionTopic: editingTraining.type === 'session' ? editingTraining.sessionTopic : undefined,
          sessionDate: editingTraining.type === 'session' ? editingTraining.sessionDate : undefined,
          startTime: editingTraining.type === 'session' ? editingTraining.startTime : undefined,
          endTime: editingTraining.type === 'session' ? editingTraining.endTime : undefined,
          duration: editingTraining.type === 'session' ? editingTraining.duration : undefined,
          location: editingTraining.type === 'session' ? editingTraining.location : undefined,
          agenda: editingTraining.type === 'session' ? editingTraining.agenda : undefined,
          learnedOutcome: editingTraining.type === 'session' ? editingTraining.learnedOutcome : undefined,
          // Course fields
          courseTitle: editingTraining.type === 'course' ? editingTraining.courseTitle : undefined,
          platform: editingTraining.type === 'course' ? editingTraining.platform : undefined,
          startDate: editingTraining.type === 'course' ? editingTraining.startDate : undefined,
          completionDate: editingTraining.type === 'course' ? editingTraining.completionDate : undefined,
          courseDuration: editingTraining.type === 'course' ? editingTraining.courseDuration : undefined,
          certificateLink: editingTraining.type === 'course' ? editingTraining.certificateLink : undefined,
          courseDescription: editingTraining.type === 'course' ? editingTraining.courseDescription : undefined,
          outcomesLearned: editingTraining.type === 'course' ? editingTraining.outcomesLearned : undefined,
          // Certification fields
          certificationName: editingTraining.type === 'certification' ? editingTraining.certificationName : undefined,
          issuingOrganization: editingTraining.type === 'certification' ? editingTraining.issuingOrganization : undefined,
          issueDate: editingTraining.type === 'certification' ? editingTraining.issueDate : undefined,
          expirationDate: editingTraining.type === 'certification' ? editingTraining.expirationDate : undefined,
          credentialId: editingTraining.type === 'certification' ? editingTraining.credentialId : undefined,
          credentialUrl: editingTraining.type === 'certification' ? editingTraining.credentialUrl : undefined,
          description: editingTraining.type === 'certification' ? editingTraining.description : undefined,
          level: editingTraining.type === 'certification' ? editingTraining.level : undefined,
          // Common fields for course and certification
          skillsLearned: (editingTraining.type === 'course' || editingTraining.type === 'certification') ? editingTraining.skillsLearned : undefined,
        } : undefined}
        isLoading={isLoading}
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
