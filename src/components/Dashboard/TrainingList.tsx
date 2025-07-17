import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Trash2
} from 'lucide-react';
import { Training, TrainingStatus } from '@/types/training';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TrainingListProps {
  trainings: Training[];
  title?: string;
  showActions?: boolean;
  limit?: number;
  onEdit?: (training: Training) => void;
  onDelete?: (training: Training) => void;
  onView?: (training: Training) => void;
}

const statusStyles = {
  completed: 'bg-success/10 text-success border-success/30 hover:bg-success/20',
  'in-progress': 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20',
  scheduled: 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20',
  pending: 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20'
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

export const TrainingList: React.FC<TrainingListProps> = ({
  trainings,
  title = "Recent Trainings",
  showActions = true,
  limit,
  onEdit,
  onDelete,
  onView
}) => {
  const displayTrainings = limit ? trainings.slice(0, limit) : trainings;

  return (
    <Card className="shadow-soft border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="secondary" className="text-xs">
            {trainings.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {displayTrainings.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No trainings found</p>
          </div>
        ) : (
          <div className="space-y-0">
            {displayTrainings.map((training, index) => {
              const TypeIcon = typeIcons[training.type];
              const isLast = index === displayTrainings.length - 1;
              
              return (
                <div
                  key={training.id}
                  className={cn(
                    'p-6 hover:bg-muted/30 transition-all duration-200',
                    !isLast && 'border-b'
                  )}
                >
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                          <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-medium">
                            {getInitials(training.employeeName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-base font-semibold text-foreground truncate max-w-xs">
                              {training.type === 'session' && (training as any).sessionTopic}
                              {training.type === 'course' && (training as any).courseTitle}
                              {training.type === 'certification' && (training as any).certificationName}
                            </h4>
                            <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1">
                              <TypeIcon className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium capitalize text-foreground">
                                {training.type}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                'text-sm font-medium border-2',
                                statusStyles[training.status]
                              )}
                            >
                              {training.status.replace('-', ' ')}
                            </Badge>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm font-medium text-foreground">{training.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Details Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{training.employeeName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{training.department}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          {training.type === 'session' && (training as any).sessionDate && formatDate((training as any).sessionDate)}
                          {training.type === 'course' && (training as any).startDate && formatDate((training as any).startDate)}
                          {training.type === 'certification' && (training as any).issueDate && formatDate((training as any).issueDate)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions Row */}
                    {showActions && (
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border/50">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView?.(training);
                          }}
                          className="h-8 px-3"
                        >
                          <Eye className="h-3 w-3 mr-1.5" />
                          View
                        </Button>
                        {onEdit && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(training);
                            }}
                            className="h-8 px-3"
                          >
                            <Edit className="h-3 w-3 mr-1.5" />
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(training);
                            }}
                            className="h-8 px-3 text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-3 w-3 mr-1.5" />
                            Delete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};