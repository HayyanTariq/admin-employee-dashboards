import React, { createContext, useContext, useState, useEffect } from 'react';
import { Training, TrainingFormData } from '@/types/training';
import { toast } from '@/hooks/use-toast';

interface TrainingContextType {
  trainings: Training[];
  addTraining: (data: TrainingFormData) => Promise<void>;
  updateTraining: (id: string, data: TrainingFormData) => Promise<void>;
  deleteTraining: (id: string) => Promise<void>;
  getTrainingById: (id: string) => Training | undefined;
  getCertifications: () => Training[];
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};

// Initial mock data
const initialTrainings: Training[] = [
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
    credentialId: 'REACT-PRO-2024-001',
    credentialUrl: 'https://certification.meta.com/verify/REACT-PRO-2024-001',
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

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainings, setTrainings] = useState<Training[]>(initialTrainings);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('certify-one-trainings');
    if (saved) {
      try {
        setTrainings(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load trainings from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever trainings change
  useEffect(() => {
    localStorage.setItem('certify-one-trainings', JSON.stringify(trainings));
  }, [trainings]);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const convertFormDataToTraining = (data: TrainingFormData): Training => {
    const baseTraining = {
      id: generateId(),
      employeeName: data.employeeName,
      role: data.role,
      department: data.department,
      category: data.category,
      status: data.status,
      type: data.type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    switch (data.type) {
      case 'session':
        return {
          ...baseTraining,
          type: 'session',
          instructorName: data.instructorName || '',
          sessionTopic: data.sessionTopic || '',
          sessionDate: data.sessionDate || '',
          startTime: data.startTime || '',
          endTime: data.endTime || '',
          duration: data.duration || '',
          location: data.location || 'online',
          agenda: data.agenda || '',
          learnedOutcome: data.learnedOutcome || '',
        } as Training;

      case 'course':
        return {
          ...baseTraining,
          type: 'course',
          courseTitle: data.courseTitle || '',
          platform: data.platform || '',
          startDate: data.startDate || '',
          completionDate: data.completionDate,
          courseDuration: data.courseDuration || '',
          certificateLink: data.certificateLink,
          courseDescription: data.courseDescription || '',
          skillsLearned: data.skillsLearned || [],
        } as Training;

      case 'certification':
        return {
          ...baseTraining,
          type: 'certification',
          certificationName: data.certificationName || '',
          issuingOrganization: data.issuingOrganization || '',
          issueDate: data.issueDate || '',
          expirationDate: data.expirationDate,
          credentialId: data.credentialId,
          credentialUrl: data.credentialUrl,
          description: data.description || '',
          skillsLearned: data.skillsLearned || [],
          level: data.level || 'beginner',
        } as Training;

      default:
        throw new Error(`Unsupported training type: ${data.type}`);
    }
  };

  const addTraining = async (data: TrainingFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      const newTraining = convertFormDataToTraining(data);
      setTrainings(prev => [newTraining, ...prev]);
      
      toast({
        title: "Training Added",
        description: `New ${data.type} has been successfully added.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add training. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTraining = async (id: string, data: TrainingFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setTrainings(prev => prev.map(training => {
        if (training.id === id) {
          const updatedTraining = convertFormDataToTraining(data);
          return {
            ...updatedTraining,
            id, // Keep the original ID
            createdAt: training.createdAt, // Keep original creation date
            updatedAt: new Date().toISOString(),
          };
        }
        return training;
      }));
      
      toast({
        title: "Training Updated",
        description: `${data.type} has been successfully updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update training. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTraining = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      
      const training = trainings.find(t => t.id === id);
      setTrainings(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Training Deleted",
        description: `${training?.type || 'Training'} has been successfully deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete training. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getTrainingById = (id: string) => {
    return trainings.find(training => training.id === id);
  };

  const getCertifications = () => {
    return trainings.filter(training => training.type === 'certification');
  };

  const value = {
    trainings,
    addTraining,
    updateTraining,
    deleteTraining,
    getTrainingById,
    getCertifications,
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};