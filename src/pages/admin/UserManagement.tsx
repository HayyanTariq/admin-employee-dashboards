
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserFormSlideout } from '@/components/UserManagement/UserFormSlideout';
import { UserList } from '@/components/UserManagement/UserList';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Download,
  UserPlus
} from 'lucide-react';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@certifyone.com',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Engineer',
    phone: '+1-555-0123',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1-555-0124'
    },
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    employmentDetails: {
      employeeId: 'EMP001',
      startDate: '2023-01-15',
      manager: 'Sarah Wilson',
      salary: 75000,
      employmentType: 'full-time'
    },
    status: 'active',
    avatar: undefined,
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2023-01-15T09:00:00Z'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@certifyone.com',
    role: 'admin',
    department: 'HR',
    position: 'HR Manager',
    phone: '+1-555-0125',
    emergencyContact: {
      name: 'Mike Wilson',
      relationship: 'Husband',
      phone: '+1-555-0126'
    },
    address: {
      street: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA'
    },
    employmentDetails: {
      employeeId: 'EMP002',
      startDate: '2022-06-01',
      manager: 'CEO',
      salary: 85000,
      employmentType: 'full-time'
    },
    status: 'active',
    avatar: undefined,
    createdAt: '2022-06-01T09:00:00Z',
    updatedAt: '2022-06-01T09:00:00Z'
  }
];

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && user.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && user.status === 'inactive';
    return matchesSearch;
  });

  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUsers(prev => [...prev, newUser]);
      setIsFormOpen(false);
      
      toast({
        title: "User Added",
        description: `${newUser.firstName} ${newUser.lastName} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingUser) return;
    
    setIsLoading(true);
    try {
      const updatedUser: User = {
        ...userData,
        id: editingUser.id,
        createdAt: editingUser.createdAt,
        updatedAt: new Date().toISOString()
      };
      
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      setIsFormOpen(false);
      setEditingUser(null);
      
      toast({
        title: "User Updated",
        description: `${updatedUser.firstName} ${updatedUser.lastName} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUsers(prev => prev.filter(u => u.id !== userId));
    
    toast({
      title: "User Deleted",
      description: `${user.firstName} ${user.lastName} has been deleted.`,
    });
  };

  const handleToggleStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: newStatus, updatedAt: new Date().toISOString() }
        : u
    ));
    
    toast({
      title: `User ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `${user.firstName} ${user.lastName} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
    });
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage employee accounts and permissions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={openAddForm} variant="gradient" className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {activeUsers}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {inactiveUsers}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              Deactivated accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeUsers})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactiveUsers})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <UserList
                users={filteredUsers}
                onEdit={openEditForm}
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <UserFormSlideout
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        editingUser={editingUser}
        isLoading={isLoading}
      />
    </div>
  );
};
