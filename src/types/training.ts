export type TrainingType = 'session' | 'course' | 'certification';

export type TrainingStatus = 'completed' | 'in-progress' | 'scheduled' | 'pending';

export interface BaseTraining {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  category: string;
  status: TrainingStatus;
  type: TrainingType;
  createdAt: string;
  updatedAt: string;
}

export interface SessionTraining extends BaseTraining {
  type: 'session';
  instructorName: string;
  sessionTopic: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: 'online' | 'on-site';
  agenda: string;
  learnedOutcome: string;
}

export interface CourseTraining extends BaseTraining {
  type: 'course';
  courseTitle: string;
  platform: string;
  startDate: string;
  completionDate?: string;
  courseDuration: string;
  certificateLink?: string;
  courseDescription: string;
  outcomesLearned?: string;
  skillsLearned: string[];
  certificateFile?: File;
}

export interface CertificationTraining extends BaseTraining {
  type: 'certification';
  certificationName: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description: string;
  skillsLearned: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  certificateFile?: File;
}

export type Training = SessionTraining | CourseTraining | CertificationTraining;

export interface TrainingFormData {
  // Common fields
  employeeName: string;
  role: string;
  department: string;
  category: string;
  status: TrainingStatus;
  type: TrainingType;

  // Session fields
  instructorName?: string;
  sessionTopic?: string;
  sessionDate?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  location?: 'online' | 'on-site';
  agenda?: string;
  learnedOutcome?: string;

  // Course fields
  courseTitle?: string;
  platform?: string;
  startDate?: string;
  completionDate?: string;
  courseDuration?: string;
  certificateLink?: string;
  courseDescription?: string;
  outcomesLearned?: string;

  // Certification fields
  certificationName?: string;
  issuingOrganization?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  // Common to Course and Certification
  skillsLearned?: string[];
  certificateFile?: File;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  department: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  hireDate?: string;
  employeeId?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingFilters {
  search?: string;
  type?: TrainingType | 'all';
  status?: TrainingStatus | 'all';
  department?: string | 'all';
  category?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
  employee?: string | 'all';
}