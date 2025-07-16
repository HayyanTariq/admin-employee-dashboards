import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'session' | 'course' | 'exam' | 'meeting';
  date: string;
  startTime: string;
  endTime: string;
  location: 'online' | 'on-site';
  locationDetails?: string;
  instructor?: string;
  participants?: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  description?: string;
  category: string;
}

const mockScheduleEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'React Advanced Patterns Workshop',
    type: 'session',
    date: '2024-02-15',
    startTime: '09:00',
    endTime: '12:00',
    location: 'on-site',
    locationDetails: 'Conference Room A',
    instructor: 'Sarah Wilson',
    participants: 12,
    status: 'confirmed',
    description: 'Deep dive into advanced React patterns including render props, higher-order components, and custom hooks.',
    category: 'Technical'
  },
  {
    id: '2',
    title: 'AWS Certification Exam',
    type: 'exam',
    date: '2024-02-18',
    startTime: '14:00',
    endTime: '17:00',
    location: 'online',
    status: 'scheduled',
    description: 'AWS Developer Associate certification exam.',
    category: 'Technical'
  },
  {
    id: '3',
    title: 'Team Leadership Course - Module 3',
    type: 'course',
    date: '2024-02-20',
    startTime: '10:00',
    endTime: '11:30',
    location: 'online',
    instructor: 'Michael Brown',
    participants: 8,
    status: 'confirmed',
    description: 'Conflict resolution and team motivation strategies.',
    category: 'Leadership'
  },
  {
    id: '4',
    title: 'Monthly Training Review',
    type: 'meeting',
    date: '2024-02-22',
    startTime: '15:00',
    endTime: '16:00',
    location: 'on-site',
    locationDetails: 'HR Meeting Room',
    status: 'scheduled',
    description: 'Review progress on training goals and plan next month\'s activities.',
    category: 'Administrative'
  },
  {
    id: '5',
    title: 'Scrum Master Workshop',
    type: 'session',
    date: '2024-02-25',
    startTime: '09:00',
    endTime: '17:00',
    location: 'on-site',
    locationDetails: 'Training Center',
    instructor: 'Lisa Chen',
    participants: 15,
    status: 'confirmed',
    description: 'Comprehensive Scrum Master certification workshop.',
    category: 'Agile'
  }
];

const typeColors = {
  'session': 'default',
  'course': 'secondary',
  'exam': 'destructive',
  'meeting': 'outline'
} as const;

const statusColors = {
  'scheduled': 'outline',
  'confirmed': 'secondary',
  'cancelled': 'destructive',
  'completed': 'default'
} as const;

export const Schedule = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [filterType, setFilterType] = useState<string>('all');

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockScheduleEvents.filter(event => event.date === dateStr);
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const filteredEvents = mockScheduleEvents.filter(event => 
    filterType === 'all' || event.type === filterType
  );

  const getUpcomingEvents = () => {
    const now = new Date();
    return mockScheduleEvents
      .filter(event => new Date(event.date + 'T' + event.startTime) > now)
      .sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime())
      .slice(0, 5);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground">
            View and manage your training schedule
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="session">Sessions</SelectItem>
              <SelectItem value="course">Courses</SelectItem>
              <SelectItem value="exam">Exams</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Event
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar and Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border pointer-events-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">This Week</span>
                <Badge variant="secondary">
                  {mockScheduleEvents.filter(event => {
                    const eventDate = new Date(event.date);
                    const weekStart = new Date(startOfWeek);
                    const weekEnd = new Date(startOfWeek);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    return eventDate >= weekStart && eventDate <= weekEnd;
                  }).length} events
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This Month</span>
                <Badge variant="outline">
                  {mockScheduleEvents.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.getMonth() === today.getMonth() && 
                           eventDate.getFullYear() === today.getFullYear();
                  }).length} events
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Upcoming Exams</span>
                <Badge variant="destructive">
                  {mockScheduleEvents.filter(event => 
                    event.type === 'exam' && new Date(event.date) > today
                  ).length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Schedule View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Week View */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Week View</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {startOfWeek.toLocaleDateString()} - {new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                  <Button size="sm" variant="outline">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium p-2 border-b">
                    {day}
                  </div>
                ))}
                {getWeekDays().map((date) => {
                  const events = getEventsForDate(date);
                  const isToday = date.toDateString() === today.toDateString();
                  
                  return (
                    <div 
                      key={date.toISOString()} 
                      className={`min-h-24 p-2 border rounded-lg ${
                        isToday ? 'bg-primary/5 border-primary' : 'bg-muted/5'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <div 
                            key={event.id}
                            className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                          >
                            {event.startTime} {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your next scheduled training activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getUpcomingEvents().map((event) => (
                <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Badge variant={typeColors[event.type]} className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{event.title}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="flex items-center">
                        {event.location === 'online' ? (
                          <Video className="mr-1 h-3 w-3" />
                        ) : (
                          <MapPin className="mr-1 h-3 w-3" />
                        )}
                        {event.location === 'online' ? 'Online' : event.locationDetails}
                      </div>
                    </div>
                    {event.instructor && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Instructor: {event.instructor}
                      </div>
                    )}
                    {event.participants && (
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Users className="mr-1 h-3 w-3" />
                        {event.participants} participants
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Badge variant={statusColors[event.status]} className="capitalize">
                      {event.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};