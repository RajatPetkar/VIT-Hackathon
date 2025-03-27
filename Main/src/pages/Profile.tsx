
import React, { useState } from 'react';
import { withAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload';
import { users } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/hooks/use-toast';
import { UserRound, Mail, Phone, Users, Pencil, Save } from 'lucide-react';

const ProfileContent = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contactNumber: '',
    parentName: '',
    parentContactNumber: '',
  });
  
  // For demonstration purposes - in a real app this would come from the backend
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileImageUpload = (file: File) => {
    // In a real app, this would upload to a server
    // For demo purposes, we'll create a data URL
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleResumeUpload = (file: File) => {
    setResumeFile(file);
  };
  
  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been updated successfully.',
    });
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="My Profile"
        description="View and manage your personal information"
        actions={
          isEditing ? (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )
        }
      />
      
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-center">
                {profileImage ? (
                  <div className="relative mb-4 mx-auto">
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-background"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <UserRound className="w-12 h-12 text-primary" />
                  </div>
                )}
                {isEditing && (
                  <FileUpload 
                    onFileSelect={handleProfileImageUpload}
                    acceptedFileTypes=".jpg,.jpeg,.png"
                    buttonText="Upload Photo"
                    maxSizeMB={2}
                  />
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium">{user?.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            </CardFooter>
          </Card>
          
          {user?.role === 'student' && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resume</CardTitle>
                <CardDescription>Upload your latest resume</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  onFileSelect={handleResumeUpload}
                  acceptedFileTypes=".pdf,.doc,.docx"
                  buttonText="Upload Resume"
                  maxSizeMB={5}
                  defaultValue={resumeFile ? URL.createObjectURL(resumeFile) : undefined}
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex">
                    <div className="bg-muted rounded-l-md w-10 flex items-center justify-center border-y border-l border-input">
                      <UserRound className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex">
                    <div className="bg-muted rounded-l-md w-10 flex items-center justify-center border-y border-l border-input">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true} // Email is not editable
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                
                {user?.role === 'student' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <div className="flex">
                        <div className="bg-muted rounded-l-md w-10 flex items-center justify-center border-y border-l border-input">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="contactNumber"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="rounded-l-none"
                          placeholder="Your contact number"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent Name</Label>
                      <div className="flex">
                        <div className="bg-muted rounded-l-md w-10 flex items-center justify-center border-y border-l border-input">
                          <UserRound className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="parentName"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="rounded-l-none"
                          placeholder="Parent's name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="parentContactNumber">Parent Contact Number</Label>
                      <div className="flex">
                        <div className="bg-muted rounded-l-md w-10 flex items-center justify-center border-y border-l border-input">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="parentContactNumber"
                          name="parentContactNumber"
                          value={formData.parentContactNumber}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="rounded-l-none"
                          placeholder="Parent's contact number"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {(user?.role === 'trainer' || user?.role === 'student') && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>My Batches</CardTitle>
                <CardDescription>Batches you {user?.role === 'trainer' ? 'manage' : 'are enrolled in'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user?.role === 'trainer'
                    ? users.filter(u => u.id === user.id)[0]?.batches?.map((batch: any) => (
                        <div key={batch.id} className="flex items-center p-2 hover:bg-accent rounded-md transition-colors">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{batch.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {batch.students.length} students
                            </p>
                          </div>
                        </div>
                      ))
                    : users.filter(u => u.id === user.id)[0]?.batches?.map((batch: any) => (
                        <div key={batch.id} className="flex items-center p-2 hover:bg-accent rounded-md transition-colors">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{batch.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Started {new Date(batch.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                  }
                  {(!users.filter(u => u.id === user.id)[0]?.batches || users.filter(u => u.id === user.id)[0]?.batches?.length === 0) && (
                    <div className="text-center py-6 text-muted-foreground">
                      No batches {user?.role === 'trainer' ? 'assigned to you' : 'you are enrolled in'} yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  return (
    <AppLayout>
      <ProfileContent />
    </AppLayout>
  );
};

export default withAuth(Profile);
