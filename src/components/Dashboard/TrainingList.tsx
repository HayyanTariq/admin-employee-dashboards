import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreHorizontal, 
  Calendar, 
  User, 
  Building,
  Award,
  BookOpen,
  Users,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  completed: 'bg-success-light text-success border-success/20',
  'in-progress': 'bg-primary/10 text-primary border-primary/20',
  scheduled: 'bg-warning-light text-warning border-warning/20',
  pending: 'bg-muted text-muted-foreground border-border'
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
                    'p-4 hover:bg-muted/50 transition-colors cursor-pointer',
                    !isLast && 'border-b'
                  )}
                  onClick={() => onView?.(training)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="gradient-primary text-primary-foreground text-xs">
                          {getInitials(training.employeeName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium truncate">
                            {training.type === 'session' && (training as any).sessionTopic}
                            {training.type === 'course' && (training as any).courseTitle}
                            {training.type === 'certification' && (training as any).certificationName}
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
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {training.type === 'session' && (training as any).sessionDate && formatDate((training as any).sessionDate)}
                              {training.type === 'course' && (training as any).startDate && formatDate((training as any).startDate)}
                              {training.type === 'certification' && (training as any).issueDate && formatDate((training as any).issueDate)}
                            </span>
                          </div>
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
                      
                      {showActions && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onView?.(training);
                            }}>
                              View Details
                            </DropdownMenuItem>
                            {onEdit && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onEdit(training);
                              }}>
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && (
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(training);
                                }}
                                className="text-destructive"
                              >
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
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