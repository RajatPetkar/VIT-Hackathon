
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
import { FileUpload } from '@/components/ui/file-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/lib/auth-context';
import { Assignment, Batch, AssignmentSubmission } from '@/lib/types';
import { assignments, batches, assignmentSubmissions } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Plus, Download, Calendar, Users, Upload, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AssignmentsContent = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userAssignments, setUserAssignments] = useState<Assignment[]>([]);
  const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  // New assignment form state
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    batchId: '',
    dueDate: '',
  });
  
  // Submission form state
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      let filteredAssignments: Assignment[] = [];
      let userBatches: Batch[] = [];
      let userSubmissions: AssignmentSubmission[] = [];
      
      if (user?.role === 'admin') {
        // Admin sees all assignments
        filteredAssignments = [...assignments];
        userBatches = [...batches];
        userSubmissions = [...assignmentSubmissions];
      } else if (user?.role === 'trainer') {
        // Trainer sees only their assignments
        filteredAssignments = assignments.filter(a => a.trainerId === user.id);
        userBatches = batches.filter(b => b.trainerId === user.id);
        userSubmissions = assignmentSubmissions.filter(sub => 
          filteredAssignments.some(a => a.id === sub.assignmentId)
        );
      } else if (user?.role === 'student') {
        // Student sees assignments from their batches
        const studentBatches = batches.filter(batch => 
          batch.students.some(s => s.id === user.id)
        );
        const batchIds = studentBatches.map(b => b.id);
        filteredAssignments = assignments.filter(a => 
          batchIds.includes(a.batchId)
        );
        userBatches = studentBatches;
        userSubmissions = assignmentSubmissions.filter(sub => 
          sub.studentId === user.id
        );
      }
      
      setUserAssignments(filteredAssignments);
      setAvailableBatches(userBatches);
      setSubmissions(userSubmissions);
      
      if (userBatches.length > 0) {
        setSelectedBatch(userBatches[0].id);
      }
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const handleNewAssignmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setNewAssignment(prev => ({
      ...prev,
      batchId: value
    }));
  };
  
  const handleBatchFilterChange = (value: string) => {
    setSelectedBatch(value);
  };
  
  const handleSubmissionFileSelect = (file: File) => {
    setSubmissionFile(file);
  };
  
  const handleCreateAssignment = () => {
    // Validate form
    if (!newAssignment.title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a title for the assignment.',
      });
      return;
    }
    
    if (!newAssignment.description.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a description for the assignment.',
      });
      return;
    }
    
    if (!newAssignment.batchId) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select a batch for the assignment.',
      });
      return;
    }
    
    if (!newAssignment.dueDate) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select a due date for the assignment.',
      });
      return;
    }
    
    // In a real app, this would save to the database
    toast({
      title: 'Assignment Created',
      description: 'Your assignment has been created successfully.',
    });
    
    // Reset form and close dialog
    setNewAssignment({
      title: '',
      description: '',
      batchId: '',
      dueDate: '',
    });
    setDialogOpen(false);
    
    // Simulate adding the new assignment to the list
    const newAssignmentObj: Assignment = {
      id: `new-${Date.now()}`,
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: new Date(newAssignment.dueDate),
      batchId: newAssignment.batchId,
      trainerId: user?.id || '',
      submissions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setUserAssignments(prev => [newAssignmentObj, ...prev]);
  };
  
  const handleSubmitAssignment = () => {
    if (!selectedAssignment) {
      return;
    }
    
    if (!submissionFile) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please upload a file for your submission.',
      });
      return;
    }
    
    // In a real app, this would upload the file and save to the database
    toast({
      title: 'Assignment Submitted',
      description: 'Your assignment has been submitted successfully.',
    });
    
    // Reset form and close dialog
    setSubmissionFile(null);
    setSubmissionDialogOpen(false);
    
    // Simulate adding the new submission
    const newSubmission: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId: selectedAssignment.id,
      studentId: user?.id || '',
      fileUrl: URL.createObjectURL(submissionFile),
      submissionDate: new Date(),
    };
    
    setSubmissions(prev => [newSubmission, ...prev]);
  };
  
  const openSubmissionDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionDialogOpen(true);
  };
  
  const hasSubmitted = (assignment: Assignment) => {
    return submissions.some(sub => sub.assignmentId === assignment.id);
  };
  
  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find(sub => sub.assignmentId === assignmentId);
  };
  
  const isAssignmentOverdue = (dueDate: Date) => {
    return new Date(dueDate) < new Date();
  };

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const assignmentColumns = [
    {
      id: 'title',
      header: 'Title',
      cell: (assignment: Assignment) => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-medium">{assignment.title}</span>
        </div>
      ),
    },
    {
      id: 'batch',
      header: 'Batch',
      cell: (assignment: Assignment) => {
        const batch = batches.find(b => b.id === assignment.batchId);
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{batch?.name || 'Unknown Batch'}</span>
          </div>
        );
      },
    },
    {
      id: 'dueDate',
      header: 'Due Date',
      cell: (assignment: Assignment) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(assignment.dueDate)}</span>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (assignment: Assignment) => {
        const submitted = hasSubmitted(assignment);
        const overdue = isAssignmentOverdue(assignment.dueDate);
        
        if (user?.role === 'student') {
          return (
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              submitted 
                ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                : overdue
                  ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
            }`}>
              <div className="flex items-center">
                {submitted && (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>Submitted</span>
                  </>
                )}
                {!submitted && overdue && (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>Overdue</span>
                  </>
                )}
                {!submitted && !overdue && (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Pending</span>
                  </>
                )}
              </div>
            </div>
          );
        } else {
          // For admin and trainer, show submission count
          const submissionCount = assignment.submissions.length;
          return (
            <div className="flex items-center gap-1">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span>{submissionCount} submissions</span>
            </div>
          );
        }
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (assignment: Assignment) => {
        if (user?.role === 'student') {
          const submitted = hasSubmitted(assignment);
          const overdue = isAssignmentOverdue(assignment.dueDate);
          const submission = getSubmissionForAssignment(assignment.id);
          
          return (
            <div className="flex items-center gap-2">
              {submitted && submission && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  asChild
                >
                  <a href={submission.fileUrl} download>
                    <Download className="h-3 w-3 mr-1" />
                    View Submission
                  </a>
                </Button>
              )}
              
              {!submitted && !overdue && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => openSubmissionDialog(assignment)}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Submit
                </Button>
              )}
              
              {!submitted && overdue && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs text-destructive"
                  disabled
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Deadline Passed
                </Button>
              )}
            </div>
          );
        } else {
          // For admin and trainer
          return (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                title="View Submissions"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          );
        }
      },
    },
  ];
  
  const submissionColumns = [
    {
      id: 'assignment',
      header: 'Assignment',
      cell: (submission: AssignmentSubmission) => {
        const assignment = userAssignments.find(a => a.id === submission.assignmentId);
        return (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-medium">{assignment?.title || 'Unknown Assignment'}</span>
          </div>
        );
      },
    },
    {
      id: 'submissionDate',
      header: 'Submitted On',
      cell: (submission: AssignmentSubmission) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(submission.submissionDate)}</span>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (submission: AssignmentSubmission) => {
        const assignment = userAssignments.find(a => a.id === submission.assignmentId);
        if (!assignment) return null;
        
        const isLate = new Date(submission.submissionDate) > new Date(assignment.dueDate);
        
        return (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isLate
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
              : 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
          }`}>
            <div className="flex items-center">
              {isLate ? (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Late</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>On Time</span>
                </>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: 'grade',
      header: 'Grade/Feedback',
      cell: (submission: AssignmentSubmission) => (
        submission.grade ? (
          <div className="flex items-center gap-1">
            <span className="font-medium">{submission.grade}</span>
            {submission.feedback && (
              <span className="text-muted-foreground text-xs ml-2">
                {submission.feedback.length > 30 
                  ? submission.feedback.substring(0, 30) + '...' 
                  : submission.feedback}
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">Not graded yet</span>
        )
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (submission: AssignmentSubmission) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            asChild
          >
            <a href={submission.fileUrl} download>
              <Download className="h-3 w-3 mr-1" />
              Download
            </a>
          </Button>
        </div>
      ),
    },
  ];
  
  const filteredAssignments = selectedBatch === 'all' 
    ? userAssignments 
    : userAssignments.filter(a => a.batchId === selectedBatch);

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title="Assignments"
        description={user?.role === 'student' 
          ? "View and submit your assignments" 
          : "Manage course assignments"}
        actions={
          (user?.role === 'admin' || user?.role === 'trainer') && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                  <DialogDescription>
                    Create a new assignment for a batch. Students will be able to submit their work before the due date.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter assignment title"
                      value={newAssignment.title}
                      onChange={handleNewAssignmentChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter detailed instructions for the assignment"
                      value={newAssignment.description}
                      onChange={handleNewAssignmentChange}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="batch">Select Batch</Label>
                    <Select
                      onValueChange={handleSelectChange}
                      defaultValue={newAssignment.batchId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBatches.map(batch => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={handleNewAssignmentChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateAssignment}>Create Assignment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />
      
      {user?.role === 'student' ? (
        <Tabs defaultValue="pending">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">My Assignments</h3>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pending" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor="batch-filter">Filter by Batch</Label>
                <Select
                  onValueChange={handleBatchFilterChange}
                  defaultValue={selectedBatch || ''}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {availableBatches.map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <Input id="search" placeholder="Search assignments..." />
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <DataTable
                  data={filteredAssignments.filter(a => !hasSubmitted(a))}
                  columns={assignmentColumns}
                  isLoading={isLoading}
                  noResultsMessage="No pending assignments found"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="submitted" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <DataTable
                  data={submissions}
                  columns={submissionColumns}
                  isLoading={isLoading}
                  noResultsMessage="No submissions found"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="batch-filter">Filter by Batch</Label>
              <Select
                onValueChange={handleBatchFilterChange}
                defaultValue={selectedBatch || ''}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {availableBatches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input id="search" placeholder="Search assignments..." />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <DataTable
                data={filteredAssignments}
                columns={assignmentColumns}
                isLoading={isLoading}
                noResultsMessage="No assignments found"
              />
            </CardContent>
          </Card>
        </div>
      )}
      
      {filteredAssignments.length > 0 && !isLoading && user?.role === 'student' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments
            .filter(a => !hasSubmitted(a) && !isAssignmentOverdue(a.dueDate))
            .slice(0, 3)
            .map(assignment => (
              <Card key={assignment.id} className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">{assignment.title}</CardTitle>
                  <CardDescription>
                    {batches.find(b => b.id === assignment.batchId)?.name || 'Unknown Batch'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {assignment.description.length > 100 
                      ? assignment.description.substring(0, 100) + '...' 
                      : assignment.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Due on {formatDate(assignment.dueDate)}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => openSubmissionDialog(assignment)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      )}
      
      <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Assignment Description</Label>
              <div className="p-4 bg-muted rounded-md text-sm">
                {selectedAssignment?.description}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{selectedAssignment && formatDate(selectedAssignment.dueDate)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">Upload Your Work</Label>
              <FileUpload
                onFileSelect={handleSubmissionFileSelect}
                acceptedFileTypes=".pdf,.doc,.docx,.zip,.rar"
                buttonText="Upload Assignment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitAssignment}>Submit Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Assignments = () => {
  return (
    <AppLayout>
      <AssignmentsContent />
    </AppLayout>
  );
};

export default withAuth(Assignments);
