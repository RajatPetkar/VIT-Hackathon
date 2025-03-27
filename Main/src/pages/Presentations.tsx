
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
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/ui/file-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/lib/auth-context';
import { Presentation, Batch } from '@/lib/types';
import { presentations, batches } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';
import { FileText, Plus, Download, Calendar, Users, Info, ExternalLink } from 'lucide-react';

const PresentationsContent = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userPresentations, setUserPresentations] = useState<Presentation[]>([]);
  const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // New presentation form state
  const [newPresentation, setNewPresentation] = useState({
    title: '',
    description: '',
    batchId: '',
    releaseDate: '',
    isReleased: false,
  });
  const [presentationFile, setPresentationFile] = useState<File | null>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      let filteredPresentations: Presentation[] = [];
      let userBatches: Batch[] = [];
      
      if (user?.role === 'admin') {
        // Admin sees all presentations
        filteredPresentations = [...presentations];
        userBatches = [...batches];
      } else if (user?.role === 'trainer') {
        // Trainer sees only their presentations
        filteredPresentations = presentations.filter(p => p.trainerId === user.id);
        userBatches = batches.filter(b => b.trainerId === user.id);
      } else if (user?.role === 'student') {
        // Student sees only released presentations from their batches
        const studentBatches = batches.filter(batch => 
          batch.students.some(s => s.id === user.id)
        );
        const batchIds = studentBatches.map(b => b.id);
        filteredPresentations = presentations.filter(p => 
          batchIds.includes(p.batchId) && p.isReleased
        );
        userBatches = studentBatches;
      }
      
      setUserPresentations(filteredPresentations);
      setAvailableBatches(userBatches);
      if (userBatches.length > 0) {
        setSelectedBatch(userBatches[0].id);
      }
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const handleNewPresentationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPresentation(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setNewPresentation(prev => ({
      ...prev,
      isReleased: checked
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setNewPresentation(prev => ({
      ...prev,
      batchId: value
    }));
  };
  
  const handleFileSelect = (file: File) => {
    setPresentationFile(file);
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!newPresentation.title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a title for the presentation.',
      });
      return;
    }
    
    if (!newPresentation.batchId) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select a batch for the presentation.',
      });
      return;
    }
    
    if (!presentationFile) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please upload a presentation file.',
      });
      return;
    }
    
    // In a real app, this would upload the file and save to the database
    toast({
      title: 'Presentation Created',
      description: 'Your presentation has been created successfully.',
    });
    
    // Reset form and close dialog
    setNewPresentation({
      title: '',
      description: '',
      batchId: '',
      releaseDate: '',
      isReleased: false,
    });
    setPresentationFile(null);
    setDialogOpen(false);
    
    // Simulate adding the new presentation to the list
    const newPresentationObj: Presentation = {
      id: `new-${Date.now()}`,
      title: newPresentation.title,
      description: newPresentation.description,
      fileUrl: URL.createObjectURL(presentationFile),
      batchId: newPresentation.batchId,
      trainerId: user?.id || '',
      releaseDate: newPresentation.releaseDate ? new Date(newPresentation.releaseDate) : new Date(),
      isReleased: newPresentation.isReleased,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setUserPresentations(prev => [newPresentationObj, ...prev]);
  };
  
  const handleDownload = (presentation: Presentation) => {
    // In a real app, this would download the file from the server
    toast({
      title: 'Download Started',
      description: `Downloading ${presentation.title}...`,
    });
  };
  
  const handleBatchFilterChange = (value: string) => {
    setSelectedBatch(value);
  };

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const columns = [
    {
      id: 'title',
      header: 'Title',
      cell: (presentation: Presentation) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">{presentation.title}</span>
        </div>
      ),
    },
    {
      id: 'batch',
      header: 'Batch',
      cell: (presentation: Presentation) => {
        const batch = batches.find(b => b.id === presentation.batchId);
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{batch?.name || 'Unknown Batch'}</span>
          </div>
        );
      },
    },
    {
      id: 'releaseDate',
      header: 'Release Date',
      cell: (presentation: Presentation) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(presentation.releaseDate)}</span>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (presentation: Presentation) => (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          presentation.isReleased 
            ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
        }`}>
          {presentation.isReleased ? 'Released' : 'Scheduled'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (presentation: Presentation) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDownload(presentation)}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {(user?.role === 'admin' || user?.role === 'trainer') && (
            <Button 
              variant="ghost" 
              size="icon"
              title="View Details"
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
          
          {user?.role === 'student' && (
            <Button variant="ghost" size="icon" asChild>
              <a href={presentation.fileUrl} target="_blank" rel="noopener noreferrer" title="Open in new tab">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      ),
    },
  ];
  
  const filteredPresentations = selectedBatch === 'all' 
    ? userPresentations 
    : userPresentations.filter(p => p.batchId === selectedBatch);

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title="Presentations"
        description={user?.role === 'student' 
          ? "Access your course materials" 
          : "Manage your course presentations"}
        actions={
          (user?.role === 'admin' || user?.role === 'trainer') && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Presentation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Presentation</DialogTitle>
                  <DialogDescription>
                    Upload a new presentation for a batch. You can release it immediately or schedule it for later.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Presentation Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter presentation title"
                      value={newPresentation.title}
                      onChange={handleNewPresentationChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter a brief description"
                      value={newPresentation.description}
                      onChange={handleNewPresentationChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="batch">Select Batch</Label>
                    <Select
                      onValueChange={handleSelectChange}
                      defaultValue={newPresentation.batchId}
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
                    <Label htmlFor="file">Upload Presentation</Label>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      acceptedFileTypes=".ppt,.pptx,.pdf"
                      buttonText="Upload Presentation"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="releaseDate">Release Date</Label>
                    <Input
                      id="releaseDate"
                      name="releaseDate"
                      type="date"
                      value={newPresentation.releaseDate}
                      onChange={handleNewPresentationChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="release"
                      checked={newPresentation.isReleased}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="release">Release Immediately</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleSubmit}>Add Presentation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />
      
      <div className="grid gap-4">
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
            <Input id="search" placeholder="Search presentations..." />
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <DataTable
              data={filteredPresentations}
              columns={columns}
              isLoading={isLoading}
              noResultsMessage="No presentations found"
            />
          </CardContent>
        </Card>
      </div>
      
      {filteredPresentations.length > 0 && !isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPresentations.slice(0, 3).map(presentation => (
            <Card key={presentation.id} className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">{presentation.title}</CardTitle>
                <CardDescription>
                  {batches.find(b => b.id === presentation.batchId)?.name || 'Unknown Batch'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {presentation.description || 'No description provided'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  {presentation.isReleased 
                    ? `Released on ${formatDate(presentation.releaseDate)}` 
                    : `Scheduled for ${formatDate(presentation.releaseDate)}`}
                </p>
                <Button variant="outline" size="sm" onClick={() => handleDownload(presentation)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const Presentations = () => {
  return (
    <AppLayout>
      <PresentationsContent />
    </AppLayout>
  );
};

export default withAuth(Presentations);
