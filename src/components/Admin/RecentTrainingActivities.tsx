import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  User, 
  Building,
  Award,
  BookOpen,
  Users,
  Clock,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  ChevronRight,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { Training, TrainingStatus } from '@/types/training';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface RecentTrainingActivitiesProps {
  trainings: Training[];
  title?: string;
  limit?: number;
  onView?: (training: Training) => void;
  onEdit?: (training: Training) => void;
  onDelete?: (training: Training) => void;
}

const statusStyles = {
  completed: 'bg-green-50 text-green-700 border-green-200',
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
  scheduled: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  pending: 'bg-gray-50 text-gray-700 border-gray-200'
};

const typeIcons = {
  session: Users,
  course: BookOpen,
  certification: Award
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

const getTrainingName = (training: Training) => {
  switch (training.type) {
    case 'session':
      return (training as any).sessionTopic || 'Untitled Session';
    case 'course':
      return (training as any).courseTitle || 'Untitled Course';
    case 'certification':
      return (training as any).certificationName || 'Untitled Certification';
    default:
      return 'Unknown Training';
  }
};

const getTrainingDate = (training: Training) => {
  switch (training.type) {
    case 'session':
      return (training as any).sessionDate;
    case 'course':
      return (training as any).startDate;
    case 'certification':
      return (training as any).issueDate;
    default:
      return '';
  }
};

export const RecentTrainingActivities: React.FC<RecentTrainingActivitiesProps> = ({
  trainings,
  title = "Recent Training Activities",
  limit = 4,
  onView,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const displayTrainings = trainings.slice(0, limit);

  const handleViewAllClick = () => {
    navigate('/admin/trainings');
  };

  return (
    <Card className="shadow-soft border-0 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{title}</span>
          <Badge variant="secondary" className="text-xs">
            {trainings.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        {displayTrainings.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent training activities</p>
          </div>
        ) : (
          <div className="relative">
            {/* Training entries */}
            <div className="space-y-0">
              {displayTrainings.map((training, index) => {
                const TypeIcon = typeIcons[training.type];
                const isLast = index === displayTrainings.length - 1;
                const trainingDate = getTrainingDate(training);
                
                return (
                  <div
                    key={training.id}
                    className={cn(
                      'p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer relative',
                      !isLast && 'border-b border-border/50',
                      // Fade effect for the last 1-2 items
                      index >= limit - 2 && 'opacity-80',
                      index === limit - 1 && 'opacity-60'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onView?.(training);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium">
                            {getInitials(training.employeeName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium truncate">
                              {getTrainingName(training)}
                            </h4>
                            <div className="flex items-center space-x-1">
                              <TypeIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground capitalize">
                                {training.type}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{training.employeeName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>{training.department}</span>
                            </div>
                            {trainingDate && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(trainingDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            'text-xs font-medium border',
                            statusStyles[training.status]
                          )}
                        >
                          {training.status.replace('-', ' ')}
                        </Badge>
                        
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView?.(training);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {onEdit && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(training);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(training);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Fade-out overlay and View All button */}
            {trainings.length > limit && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewAllClick}
                  className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-2 hover:border-primary/30 transition-all duration-200"
                >
                  <span className="text-sm font-medium">View All Trainings</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Alternative View All button when no fade needed */}
        {trainings.length > 0 && trainings.length <= limit && (
          <div className="px-4 pb-4 pt-2 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewAllClick}
              className="w-full justify-center text-sm text-muted-foreground hover:text-primary"
            >
              <span>View All Trainings</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
