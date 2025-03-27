
import React, { useState, useEffect } from 'react';
import { withAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import { Batch, User } from '@/lib/types';
import { batches, users } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';
import { Users, UserPlus, UserMinus, Plus, Calendar, BookOpen, FileText, Info } from 'lucide-react';

const BatchesContent = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userBatches, setUserBatches] = useState<Batch[]>([]);
  const [availableTrainers, setAvailableTrainers] = useState<User[]>([]);
  const [availableStudents, setAvailableStudents] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  
  // New batch form state
  const [newBatch, setNewBatch] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    trainerId: '',
  });
  
  // Student assignment form state
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      let filteredBatches: Batch[] = [];
      
      if (user?.role === 'admin') {
        // Admin sees all batches
        filteredBatches = [...batches];
      } else if (user?.role === 'trainer') {
        // Trainer sees only their batches
        filteredBatches = batches.filter(b => b.trainerId === user.id);
      } else if (user?.role === 'student') {
        // Student sees batches they are enrolled in
        filteredBatches = batches.filter(batch => 
          batch.students.some(s => s.id === user.id)
        );
      }
      
      // Get available trainers and students for admin
      if (user?.role === 'admin') {
        setAvailableTrainers(users.filter(u => u.role === 'trainer'));
        setAvailableStudents(users.filter(u => u.role === 'student'));
      } else if (user?.role === 'trainer') {
        // Trainers can only add students
        setAvailableStudents(users.filter(u => u.role === 'student'));
      }
      
      setUserBatches(filteredBatches);
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const handleNewBatchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBatch(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTrainerSelect = (value: string) => {
    setNewBatch(prev => ({
      ...prev,
      trainerId: value
    }));
  };
  
  const handleStudentSelect = (value: string) => {
    if (selectedStudents.includes(value)) {
      setSelectedStudents(prev => prev.filter(id => id !== value));
    } else {
      setSelectedStudents(prev => [...prev, value]);
    }
  };
  
  const handleCreateBatch = () => {
    // Validate form
    if (!newBatch.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a name for the batch.',
      });
      return;
    }
    
    if (!newBatch.startDate) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select a start date for the batch.',
      });
      return;
    }
    
    if (user?.role === 'admin' && !newBatch.trainerId) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select a trainer for the batch.',
      });
      return;
    }
    
    // In a real app, this would save to the database
    toast({
      title: 'Batch Created',
      description: 'Your batch has been created successfully.',
    });
    
    // Reset form and close dialog
    setNewBatch({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      trainerId: '',
    });
    setDialogOpen(false);
    
    // Simulate adding the new batch to the list
    const newBatchObj: Batch = {
      id: `new-${Date.now()}`,
      name: newBatch.name,
      description: newBatch.description,
      startDate: new Date(newBatch.startDate),
      endDate: newBatch.endDate ? new Date(newBatch.endDate) : undefined,
      trainerId: user?.role === 'admin' ? newBatch.trainerId : user?.id || '',
      students: [],
      presentations: [],
      assignments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setUserBatches(prev => [newBatchObj, ...prev]);
  };
  
  const handleAddStudents = () => {
    if (!selectedBatch) {
      return;
    }
    
    if (selectedStudents.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select at least one student to add to the batch.',
      });
      return;
    }
    
    // In a real app, this would save to the database
    toast({
      title: 'Students Added',
      description: `${selectedStudents.length} students have been added to ${selectedBatch.name}.`,
    });
    
    // Reset form and close dialog
    setSelectedStudents([]);
    setStudentDialogOpen(false);
    
    // Simulate adding students to the batch
    const updatedBatches = userBatches.map(batch => {
      if (batch.id === selectedBatch.id) {
        const newStudents = availableStudents
          .filter(s => selectedStudents.includes(s.id))
          .filter(s => !batch.students.some(existingStudent => existingStudent.id === s.id));
        
        return {
          ...batch,
          students: [...batch.students, ...newStudents as any]
        };
      }
      return batch;
    });
    
    setUserBatches(updatedBatches);
  };
  
  const openStudentDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setSelectedStudents([]);
    setStudentDialogOpen(true);
  };
  
  const removeStudentFromBatch = (batchId: string, studentId: string) => {
    // In a real app, this would save to the database
    toast({
      title: 'Student Removed',
      description: 'The student has been removed from the batch.',
    });
    
    // Simulate removing student from the batch
    const updatedBatches = userBatches.map(batch => {
      if (batch.id === batchId) {
        return {
          ...batch,
          students: batch.students.filter(s => s.id !== studentId)
        };
      }
      return batch;
    });
    
    setUserBatches(updatedBatches);
  };

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const batchColumns = [
    {
      id: 'name',
      header: 'Batch Name',
      cell: (batch: Batch) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-medium">{batch.name}</span>
        </div>
      ),
    },
    {
      id: 'trainer',
      header: 'Trainer',
      cell: (batch: Batch) => {
        const trainer = users.find(u => u.id === batch.trainerId);
        return trainer ? (
          <span>{trainer.name}</span>
        ) : (
          <span className="text-muted-foreground">Not assigned</span>
        );
      },
    },
    {
      id: 'students',
      header: 'Students',
      cell: (batch: Batch) => (
        <span>{batch.students.length} enrolled</span>
      ),
    },
    {
      id: 'dates',
      header: 'Duration',
      cell: (batch: Batch) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {formatDate(batch.startDate)}
            {batch.endDate && ` - ${formatDate(batch.endDate)}`}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (batch: Batch) => (
        <div className="flex items-center gap-2">
          {(user?.role === 'admin' || user?.role === 'trainer') && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => openStudentDialog(batch)}
              title="Manage Students"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            title="View Details"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  
  const studentColumns = [
    {
      id: 'name',
      header: 'Name',
      cell: (student: User) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{student.name}</span>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      cell: (student: User) => (
        <span>{student.email}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (student: User, batch: Batch) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => removeStudentFromBatch(batch.id, student.id)}
            title="Remove Student"
          >
            <UserMinus className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title="Course Batches"
        description={user?.role === 'student' 
          ? "Batches you are enrolled in" 
          : "Manage your course batches"}
        actions={
          (user?.role === 'admin' || user?.role === 'trainer') && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Batch
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create New Batch</DialogTitle>
                  <DialogDescription>
                    Create a new course batch. You'll be able to add students and content later.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Batch Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter batch name"
                      value={newBatch.name}
                      onChange={handleNewBatchChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter a brief description about this batch"
                      value={newBatch.description}
                      onChange={handleNewBatchChange}
                    />
                  </div>
                  
                  {user?.role === 'admin' && (
                    <div className="space-y-2">
                      <Label htmlFor="trainer">Assign Trainer</Label>
                      <Select
                        onValueChange={handleTrainerSelect}
                        defaultValue={newBatch.trainerId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a trainer" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTrainers.map(trainer => (
                            <SelectItem key={trainer.id} value={trainer.id}>
                              {trainer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={newBatch.startDate}
                        onChange={handleNewBatchChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date (Optional)</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={newBatch.endDate}
                        onChange={handleNewBatchChange}
                        min={newBatch.startDate}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateBatch}>Create Batch</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />
      
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-0">
            <DataTable
              data={userBatches}
              columns={batchColumns}
              isLoading={isLoading}
              noResultsMessage="No batches found"
            />
          </CardContent>
        </Card>
        
        {userBatches.length > 0 && !isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userBatches.slice(0, 3).map(batch => (
              <Card key={batch.id} className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">{batch.name}</CardTitle>
                  <CardDescription>
                    {users.find(u => u.id === batch.trainerId)?.name || 'No trainer assigned'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {batch.description && (
                    <p className="text-sm text-muted-foreground">
                      {batch.description.length > 100 
                        ? batch.description.substring(0, 100) + '...' 
                        : batch.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Started {formatDate(batch.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{batch.students.length} students enrolled</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{batch.presentations.length} presentations</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{batch.assignments.length} assignments</span>
                  </div>
                </CardContent>
                <CardFooter>
                  {(user?.role === 'admin' || user?.role === 'trainer') && (
                    <Button variant="outline" size="sm" onClick={() => openStudentDialog(batch)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Manage Students
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Manage Students</DialogTitle>
            <DialogDescription>
              {selectedBatch?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Tabs defaultValue="enrolled">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="enrolled">Enrolled Students</TabsTrigger>
                <TabsTrigger value="add">Add Students</TabsTrigger>
              </TabsList>
              
              <TabsContent value="enrolled" className="pt-4">
                {selectedBatch?.students.length ? (
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">Name</th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                          <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBatch.students.map(student => (
                          <tr key={student.id} className="border-b last:border-b-0">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-primary" />
                                </div>
                                <span>{student.name}</span>
                              </div>
                            </td>
                            <td className="p-3">{student.email}</td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeStudentFromBatch(selectedBatch.id, student.id)}
                              >
                                <UserMinus className="h-4 w-4 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No students enrolled in this batch
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="add" className="pt-4">
                <div className="space-y-4">
                  <Input placeholder="Search students..." />
                  
                  <div className="border rounded-md max-h-[300px] overflow-y-auto">
                    {availableStudents.length > 0 ? (
                      <div className="divide-y">
                        {availableStudents
                          .filter(s => !selectedBatch?.students.some(enrolled => enrolled.id === s.id))
                          .map(student => (
                            <div 
                              key={student.id} 
                              className={`flex items-center justify-between p-3 hover:bg-accent transition-colors cursor-pointer ${
                                selectedStudents.includes(student.id) ? 'bg-accent' : ''
                              }`}
                              onClick={() => handleStudentSelect(student.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                </div>
                              </div>
                              <div className={`h-5 w-5 rounded-full border ${
                                selectedStudents.includes(student.id) 
                                  ? 'bg-primary border-primary' 
                                  : 'border-input'
                              }`}>
                                {selectedStudents.includes(student.id) && (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-3 w-3 text-primary-foreground"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No students available to add
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {selectedStudents.length} students selected
                    </p>
                    <Button 
                      onClick={handleAddStudents}
                      disabled={selectedStudents.length === 0}
                    >
                      Add Selected Students
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Batches = () => {
  return (
    <AppLayout>
      <BatchesContent />
    </AppLayout>
  );
};

export default withAuth(Batches);
