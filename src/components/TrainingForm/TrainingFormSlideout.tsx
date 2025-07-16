import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Clock, 
  X, 
  Upload, 
  FileText, 
  Save,
  Loader2,
  Plus
} from 'lucide-react';
import { TrainingFormData, TrainingType, TrainingStatus } from '@/types/training';
import { useToast } from '@/hooks/use-toast';

interface TrainingFormSlideoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TrainingFormData) => Promise<void>;
  initialData?: TrainingFormData;
  isLoading?: boolean;
  fixedType?: TrainingType;
}

const trainingTypes: { value: TrainingType; label: string }[] = [
  { value: 'session', label: 'Training Session' },
  { value: 'course', label: 'Course' },
  { value: 'certification', label: 'Certification' },
];

const statusOptions: { value: TrainingStatus; label: string }[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'pending', label: 'Pending' },
];

const locationOptions = [
  { value: 'online', label: 'Online' },
  { value: 'on-site', label: 'On-site' },
];

const levelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export const TrainingFormSlideout: React.FC<TrainingFormSlideoutProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  fixedType,
}) => {
  const [formData, setFormData] = useState<TrainingFormData>({
    employeeName: '',
    role: '',
    department: '',
    category: '',
    status: 'pending',
    type: 'session',
    skillsLearned: [],
    ...initialData,
  });

  const [skills, setSkills] = useState<string[]>(formData.skillsLearned || []);
  const [newSkill, setNewSkill] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(
    formData.startDate ? new Date(formData.startDate) : undefined
  );
  const [completionDate, setCompletionDate] = useState<Date | undefined>(
    formData.completionDate ? new Date(formData.completionDate) : undefined
  );
  const [sessionDate, setSessionDate] = useState<Date | undefined>(
    formData.sessionDate ? new Date(formData.sessionDate) : undefined
  );
  const [issueDate, setIssueDate] = useState<Date | undefined>(
    formData.issueDate ? new Date(formData.issueDate) : undefined
  );
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    formData.expirationDate ? new Date(formData.expirationDate) : undefined
  );

  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
      setSkills(initialData.skillsLearned || []);
    }
    if (fixedType) {
      setFormData(prev => ({ ...prev, type: fixedType }));
    }
  }, [initialData, fixedType]);

  const updateFormData = (field: keyof TrainingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setFormData(prev => ({ ...prev, skillsLearned: updatedSkills }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    setFormData(prev => ({ ...prev, skillsLearned: updatedSkills }));
  };

  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m`;
      } else {
        return `${diffMinutes}m`;
      }
    }
    return '';
  };

  useEffect(() => {
    const duration = calculateDuration();
    if (duration) {
      updateFormData('duration', duration);
    }
  }, [formData.startTime, formData.endTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalData = {
      ...formData,
      startDate: startDate?.toISOString(),
      completionDate: completionDate?.toISOString(),
      sessionDate: sessionDate?.toISOString(),
      issueDate: issueDate?.toISOString(),
      expirationDate: expirationDate?.toISOString(),
      skillsLearned: skills,
    };

    try {
      await onSubmit(finalData);
      toast({
        title: "Training Added Successfully",
        description: `${formData.type} training has been added to the system.`,
        variant: "default",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save training. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCommonFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeName">Name *</Label>
          <Input
            id="employeeName"
            value={formData.employeeName}
            onChange={(e) => updateFormData('employeeName', e.target.value)}
            placeholder="Enter employee name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => updateFormData('role', e.target.value)}
            placeholder="Enter role/position"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => updateFormData('department', e.target.value)}
            placeholder="Enter department"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => updateFormData('category', e.target.value)}
            placeholder="e.g., Technical, Soft Skills, Compliance"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderSessionFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instructorName">Instructor Name</Label>
          <Input
            id="instructorName"
            value={formData.instructorName || ''}
            onChange={(e) => updateFormData('instructorName', e.target.value)}
            placeholder="Enter instructor name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sessionTopic">Session Topic</Label>
          <Input
            id="sessionTopic"
            value={formData.sessionTopic || ''}
            onChange={(e) => updateFormData('sessionTopic', e.target.value)}
            placeholder="Enter session topic"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Session Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !sessionDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {sessionDate ? format(sessionDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={sessionDate}
                onSelect={setSessionDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime || ''}
            onChange={(e) => updateFormData('startTime', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime || ''}
            onChange={(e) => updateFormData('endTime', e.target.value)}
          />
        </div>
      </div>

      {formData.startTime && formData.endTime && (
        <div className="space-y-2">
          <Label>Duration (Auto-calculated)</Label>
          <Input value={calculateDuration()} disabled />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agenda">Agenda / Topics Covered</Label>
        <Textarea
          id="agenda"
          value={formData.agenda || ''}
          onChange={(e) => updateFormData('agenda', e.target.value)}
          placeholder="Enter session agenda and topics covered"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="learnedOutcome">Output / Learned Outcome</Label>
        <Textarea
          id="learnedOutcome"
          value={formData.learnedOutcome || ''}
          onChange={(e) => updateFormData('learnedOutcome', e.target.value)}
          placeholder="Enter learning outcomes and outputs"
          rows={3}
        />
      </div>
    </div>
  );

  const renderCourseFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="courseTitle">Course Title</Label>
          <Input
            id="courseTitle"
            value={formData.courseTitle || ''}
            onChange={(e) => updateFormData('courseTitle', e.target.value)}
            placeholder="Enter course title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="platform">Platform/Provider</Label>
          <Input
            id="platform"
            value={formData.platform || ''}
            onChange={(e) => updateFormData('platform', e.target.value)}
            placeholder="e.g., Coursera, Udemy, LinkedIn Learning"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Completion Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !completionDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {completionDate ? format(completionDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={completionDate}
                onSelect={setCompletionDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="courseDuration">Course Duration</Label>
          <Input
            id="courseDuration"
            value={formData.courseDuration || ''}
            onChange={(e) => updateFormData('courseDuration', e.target.value)}
            placeholder="e.g., 10 hours, 3 weeks"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="certificateLink">Course Link</Label>
        <Input
          id="certificateLink"
          type="url"
          value={formData.certificateLink || ''}
          onChange={(e) => updateFormData('certificateLink', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseDescription">Course Description</Label>
        <Textarea
          id="courseDescription"
          value={formData.courseDescription || ''}
          onChange={(e) => updateFormData('courseDescription', e.target.value)}
          placeholder="Enter course description"
          rows={3}
        />
      </div>

      {renderSkillsSection()}
      {renderFileUploadSection()}
    </div>
  );

  const renderCertificationFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="certificationName">Certification Name</Label>
          <Input
            id="certificationName"
            value={formData.certificationName || ''}
            onChange={(e) => updateFormData('certificationName', e.target.value)}
            placeholder="Enter certification name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuingOrganization">Issuing Organization</Label>
          <Input
            id="issuingOrganization"
            value={formData.issuingOrganization || ''}
            onChange={(e) => updateFormData('issuingOrganization', e.target.value)}
            placeholder="Enter issuing organization"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Issue Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !issueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {issueDate ? format(issueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={issueDate}
                onSelect={setIssueDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Expiration Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !expirationDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expirationDate ? format(expirationDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expirationDate}
                onSelect={setExpirationDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="credentialId">Credential ID</Label>
          <Input
            id="credentialId"
            value={formData.credentialId || ''}
            onChange={(e) => updateFormData('credentialId', e.target.value)}
            placeholder="Enter credential ID"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credentialUrl">Credential URL</Label>
          <Input
            id="credentialUrl"
            type="url"
            value={formData.credentialUrl || ''}
            onChange={(e) => updateFormData('credentialUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Select value={formData.level} onValueChange={(value) => updateFormData('level', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {levelOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Enter certification description"
          rows={3}
        />
      </div>

      {renderSkillsSection()}
      {renderFileUploadSection()}
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-2">
      <Label>Skills Learned</Label>
      <div className="flex space-x-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
        />
        <Button type="button" onClick={addSkill} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );

  const renderFileUploadSection = () => (
    <div className="space-y-2">
      <Label htmlFor="outcomesLearned">Outcomes Learned</Label>
      <Textarea
        id="outcomesLearned"
        value={formData.outcomesLearned || ''}
        onChange={(e) => updateFormData('outcomesLearned', e.target.value)}
        placeholder="Describe the key outcomes and learnings from this course"
        rows={4}
      />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className="h-10 w-10 gradient-primary rounded-lg flex items-center justify-center animate-fade-in">
              <Plus className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="animate-fade-in">
              {initialData ? 'Edit Training Record' : 'Add New Training'}
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground animate-fade-in">
            {initialData 
              ? 'Update the training information below.'
              : 'Fill out the form below to add a new training entry to the system.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-scale-in">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-6 w-6 bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                  <Label className="text-lg font-semibold">Training Type</Label>
                </div>
                {fixedType ? (
                  <div className="h-12 bg-muted/50 rounded-md border border-border flex items-center px-3">
                    <span className="text-base font-medium capitalize">
                      {trainingTypes.find(t => t.value === fixedType)?.label}
                    </span>
                  </div>
                ) : (
                  <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                    <SelectTrigger className="h-12 text-base hover:border-primary/30 transition-colors">
                      <SelectValue placeholder="Select training type" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-base py-3">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-6 w-6 bg-gradient-to-r from-success to-success/60 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold">Common Information</h3>
              </div>
              {renderCommonFields()}
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-6 w-6 bg-gradient-to-r from-warning to-warning/60 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold">
                  {formData.type === 'session' && 'Session Details'}
                  {formData.type === 'course' && 'Course Details'}
                  {formData.type === 'certification' && 'Certification Details'}
                </h3>
              </div>
              <div className="animate-fade-in">
                {formData.type === 'session' && renderSessionFields()}
                {formData.type === 'course' && renderCourseFields()}
                {formData.type === 'certification' && renderCertificationFields()}
              </div>
            </Card>

            <div className="flex justify-end space-x-4 pt-6 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="h-12 px-6 hover-scale transition-all duration-200"
                size="lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                variant="gradient"
                className="h-12 px-8 hover-scale transition-all duration-200 shadow-lg"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    {initialData ? 'Update Training' : 'Save Training'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};