
import React, { useState, useEffect } from 'react';
import { withAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/lib/auth-context';
import { User, UserRole } from '@/lib/types';
import { users } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';
import { UserRound, Plus, Pencil, UserMinus, Mail, Phone, BookOpen, Users as UsersIcon } from 'lucide-react';

const UsersContent = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<UserRole>('student');
  
  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as UserRole,
    parentName: '',
    contactNumber: '',
    parentContactNumber: '',
  });

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      if (user?.role === 'admin') {
        setFilteredUsers(users.filter(u => u.role === currentTab));
      }
      setIsLoading(false);
    }, 1000);
  }, [user, currentTab]);

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRoleSelect = (value: UserRole) => {
    setNewUser(prev => ({
      ...prev,
      role: value
    }));
  };
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value as UserRole);
  };
  
  const handleCreateUser = () => {
    // Validate form
    if (!newUser.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a name for the user.',
      });
      return;
    }
    
    if (!newUser.email.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter an email for the user.',
      });
      return;
    }
    
    if (newUser.role === 'student') {
      if (!newUser.parentName.trim()) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please enter a parent name for the student.',
        });
        return;
      }
    }
    
    // In a real app, this would save to the database
    toast({
      title: 'User Created',
      description: `New ${newUser.role} account has been created successfully.`,
    });
    
    // Reset form and close dialog
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      parentName: '',
      contactNumber: '',
      parentContactNumber: '',
    });
    setDialogOpen(false);
    
    // Simulate adding the new user to the list
    const newUserObj: User = {
      id: `new-${Date.now()}`,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setFilteredUsers(prev => [newUserObj, ...prev]);
  };

  const studentColumns = [
    {
      id: 'name',
      header: 'Name',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UserRound className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{user.name}</span>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{user.email}</span>
        </div>
      ),
    },
    {
      id: 'parentName',
      header: 'Parent Name',
      cell: (user: User) => (
        <span>
          {(user as any).parentName || 'Not provided'}
        </span>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{(user as any).contactNumber || 'Not provided'}</span>
        </div>
      ),
    },
    {
      id: 'batches',
      header: 'Batches',
      cell: (user: User) => (
        <span>{(user as any).batches?.length || 0} enrolled</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            title="Delete"
          >
            <UserMinus className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];
  
  const trainerColumns = [
    {
      id: 'name',
      header: 'Name',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UserRound className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{user.name}</span>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{user.email}</span>
        </div>
      ),
    },
    {
      id: 'batches',
      header: 'Batches',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
          <span>{(user as any).batches?.length || 0} assigned</span>
        </div>
      ),
    },
    {
      id: 'presentations',
      header: 'Presentations',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span>5 uploaded</span> {/* This would be dynamic in a real app */}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            title="Delete"
          >
            <UserMinus className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];
  
  const adminColumns = [
    {
      id: 'name',
      header: 'Name',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UserRound className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{user.name}</span>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{user.email}</span>
        </div>
      ),
    },
    {
      id: 'lastLogin',
      header: 'Last Login',
      cell: (user: User) => (
        <span>Today</span> /* This would be dynamic in a real app */
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          {user.id !== '1' && ( /* Don't allow deleting the main admin */
            <Button 
              variant="ghost" 
              size="icon"
              title="Delete"
            >
              <UserMinus className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title="User Management"
        description="Manage all users on the platform"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the platform.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select
                    onValueChange={(value) => handleRoleSelect(value as UserRole)}
                    defaultValue={newUser.role}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                  />
                </div>
                
                {newUser.role === 'student' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent Name</Label>
                      <Input
                        id="parentName"
                        name="parentName"
                        placeholder="Enter parent name"
                        value={newUser.parentName}
                        onChange={handleNewUserChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          name="contactNumber"
                          placeholder="Student contact"
                          value={newUser.contactNumber}
                          onChange={handleNewUserChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="parentContactNumber">Parent Contact</Label>
                        <Input
                          id="parentContactNumber"
                          name="parentContactNumber"
                          placeholder="Parent contact"
                          value={newUser.parentContactNumber}
                          onChange={handleNewUserChange}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      
      <Tabs defaultValue="student" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="student">Students</TabsTrigger>
          <TabsTrigger value="trainer">Trainers</TabsTrigger>
          <TabsTrigger value="admin">Administrators</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="student">
            <Card>
              <CardContent className="p-0">
                <DataTable
                  data={filteredUsers}
                  columns={studentColumns}
                  isLoading={isLoading}
                  noResultsMessage="No students found"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trainer">
            <Card>
              <CardContent className="p-0">
                <DataTable
                  data={filteredUsers}
                  columns={trainerColumns}
                  isLoading={isLoading}
                  noResultsMessage="No trainers found"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin">
            <Card>
              <CardContent className="p-0">
                <DataTable
                  data={filteredUsers}
                  columns={adminColumns}
                  isLoading={isLoading}
                  noResultsMessage="No administrators found"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const Users = () => {
  return (
    <AppLayout>
      <UsersContent />
    </AppLayout>
  );
};

export default withAuth(Users, ['admin']);
