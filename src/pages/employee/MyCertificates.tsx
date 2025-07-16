import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainingFormSlideout } from '@/components/TrainingForm/TrainingFormSlideout';
import { CertificationTraining, TrainingFormData } from '@/types/training';
import { 
  Plus, 
  Search, 
  Award, 
  Calendar, 
  Building, 
  ExternalLink, 
  Download,
  Eye,
  Edit,
  Shield,
  Clock,
  Star
} from 'lucide-react';

// Mock data for employee's certificates
const mockCertificates: CertificationTraining[] = [
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
    description: 'Advanced React development certification covering hooks, context, performance optimization, and best practices.',
    skillsLearned: ['React', 'Redux', 'TypeScript', 'Testing'],
    level: 'advanced',
    credentialId: 'REACT-PRO-2024-001',
    credentialUrl: 'https://certification.meta.com/verify/REACT-PRO-2024-001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    type: 'certification',
    employeeName: 'John Doe',
    role: 'Software Engineer',
    department: 'Engineering',
    category: 'Technical',
    status: 'completed',
    certificationName: 'AWS Certified Developer',
    issuingOrganization: 'Amazon Web Services',
    issueDate: '2023-11-20',
    expirationDate: '2026-11-20',
    description: 'Certified AWS Developer with expertise in cloud services, Lambda, and serverless architecture.',
    skillsLearned: ['AWS', 'Lambda', 'DynamoDB', 'API Gateway'],
    level: 'intermediate',
    credentialId: 'AWS-DEV-2023-456',
    credentialUrl: 'https://aws.amazon.com/verification/AWS-DEV-2023-456',
    createdAt: '2023-11-20T10:00:00Z',
    updatedAt: '2023-11-20T10:00:00Z'
  },
  {
    id: '3',
    type: 'certification',
    employeeName: 'John Doe',
    role: 'Software Engineer',
    department: 'Engineering',
    category: 'Technical',
    status: 'completed',
    certificationName: 'Scrum Master Certification',
    issuingOrganization: 'Scrum Alliance',
    issueDate: '2023-08-10',
    expirationDate: '2025-08-10',
    description: 'Certified Scrum Master with expertise in Agile methodologies and team facilitation.',
    skillsLearned: ['Scrum', 'Agile', 'Team Leadership', 'Sprint Planning'],
    level: 'intermediate',
    credentialId: 'CSM-2023-789',
    credentialUrl: 'https://scrumalliance.org/verify/CSM-2023-789',
    createdAt: '2023-08-10T10:00:00Z',
    updatedAt: '2023-08-10T10:00:00Z'
  }
];

const levelColors = {
  'beginner': 'outline',
  'intermediate': 'secondary',
  'advanced': 'default',
  'expert': 'destructive'
} as const;

// Crown icon fallback
const Crown = Award;

const levelIcons = {
  'beginner': Star,
  'intermediate': Shield,
  'advanced': Award,
  'expert': Crown
} as const;

export const MyCertificates = () => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCertification = async (data: TrainingFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('New certification data:', data);
      // In real app, this would make an API call to your ASP.NET backend
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCertificates = mockCertificates.filter(cert =>
    cert.certificationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuingOrganization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.skillsLearned.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expiry = new Date(expirationDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
          <p className="text-muted-foreground">
            View and manage your professional certifications
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} variant="gradient">
          <Plus className="mr-2 h-4 w-4" />
          Add Certificate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Certificates</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">{mockCertificates.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Expiring Soon</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-warning">
                {mockCertificates.filter(cert => isExpiringSoon(cert.expirationDate)).length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-primary">
                {mockCertificates.filter(cert => !isExpired(cert.expirationDate)).length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Expert Level</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">
                {mockCertificates.filter(cert => cert.level === 'expert' || cert.level === 'advanced').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search certificates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Certificates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCertificates.map((certificate) => {
          const LevelIcon = levelIcons[certificate.level as keyof typeof levelIcons];
          const isExpiring = isExpiringSoon(certificate.expirationDate);
          const expired = isExpired(certificate.expirationDate);

          return (
            <Card key={certificate.id} className="relative overflow-hidden">
              {expired && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive">Expired</Badge>
                </div>
              )}
              {isExpiring && !expired && (
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-warning border-warning">
                    Expiring Soon
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <Badge variant={levelColors[certificate.level]} className="capitalize">
                      <LevelIcon className="mr-1 h-3 w-3" />
                      {certificate.level}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{certificate.certificationName}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <Building className="mr-1 h-3 w-3" />
                  {certificate.issuingOrganization}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {certificate.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                  </div>
                  {certificate.expirationDate && (
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-3 w-3 text-muted-foreground" />
                      <span className={expired ? 'text-destructive' : isExpiring ? 'text-warning' : ''}>
                        Expires: {new Date(certificate.expirationDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {certificate.credentialId && (
                    <div className="text-xs text-muted-foreground">
                      ID: {certificate.credentialId}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {certificate.skillsLearned.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {certificate.skillsLearned.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{certificate.skillsLearned.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
                <div className="flex space-x-2">
                  {certificate.credentialUrl && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No certificates found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first certificate.'}
          </p>
          <Button 
            onClick={() => setIsFormOpen(true)} 
            className="mt-4"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
        </div>
      )}

      <TrainingFormSlideout
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddCertification}
        isLoading={isLoading}
      />
    </div>
  );
};