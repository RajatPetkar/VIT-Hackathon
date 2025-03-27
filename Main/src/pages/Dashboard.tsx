
import React, { useState, useEffect } from 'react';
import { withAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { batches, presentations, assignments } from '@/lib/mock-data';
import { Users, FileText, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { User, Batch, Presentation, Assignment } from '@/lib/types';

const DashboardContent = () => {
  const { user } = useAuth();
  const [recentBatches, setRecentBatches] = useState<Batch[]>([]);
  const [recentPresentations, setRecentPresentations] = useState<Presentation[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (user) {
        // Filter data based on user role
        if (user.role === 'admin') {
          setRecentBatches(batches.slice(0, 3));
          setRecentPresentations(presentations.slice(0, 3));
          setRecentAssignments(assignments.slice(0, 3));
        } else if (user.role === 'trainer') {
          setRecentBatches(batches.filter(batch => batch.trainerId === user.id).slice(0, 3));
          setRecentPresentations(presentations.filter(pres => pres.trainerId === user.id).slice(0, 3));
          setRecentAssignments(assignments.filter(assign => assign.trainerId === user.id).slice(0, 3));
        } else if (user.role === 'student') {
          // For student, only show batches they are enrolled in
          const studentBatches = batches.filter(batch => 
            batch.students.some(s => s.id === user.id)
          );
          setRecentBatches(studentBatches.slice(0, 3));
          
          // Only show presentations that have been released for their batches
          const batchIds = studentBatches.map(b => b.id);
          const studentPresentations = presentations.filter(p => 
            batchIds.includes(p.batchId) && p.isReleased
          );
          setRecentPresentations(studentPresentations.slice(0, 3));
          
          // Only show assignments for their batches
          const studentAssignments = assignments.filter(a => 
            batchIds.includes(a.batchId)
          );
          setRecentAssignments(studentAssignments.slice(0, 3));
        }
      }
      setLoading(false);
    }, 800);
  }, [user]);

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title={`Welcome back, ${user?.name}`}
        description={`Here's an overview of your ${user?.role === 'admin' ? 'platform' : user?.role === 'trainer' ? 'training' : 'learning'} activities`}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === 'admin' ? 'Total Batches' : 'My Batches'}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                user?.role === 'admin' ? batches.length : 
                user?.role === 'trainer' ? batches.filter(b => b.trainerId === user.id).length :
                batches.filter(b => b.students.some(s => s.id === user?.id)).length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'admin' ? 'Active course batches' : 'Assigned to you'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === 'student' ? 'Available Content' : 'Presentations'}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                user?.role === 'admin' ? presentations.length : 
                user?.role === 'trainer' ? presentations.filter(p => p.trainerId === user.id).length :
                presentations.filter(p => 
                  p.isReleased && 
                  batches.filter(b => 
                    b.students.some(s => s.id === user?.id)
                  ).some(b => b.id === p.batchId)
                ).length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'student' ? 'Available for you' : 'Total presentations'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                user?.role === 'admin' ? assignments.length : 
                user?.role === 'trainer' ? assignments.filter(a => a.trainerId === user.id).length :
                assignments.filter(a => 
                  batches.filter(b => 
                    b.students.some(s => s.id === user?.id)
                  ).some(b => b.id === a.batchId)
                ).length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'student' ? 'Total tasks assigned to you' : 'Total assignments'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === 'student' ? 'Upcoming Deadlines' : 'Recent Activities'}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                user?.role === 'student' ?
                assignments.filter(a => 
                  new Date(a.dueDate) > new Date() &&
                  batches.filter(b => 
                    b.students.some(s => s.id === user?.id)
                  ).some(b => b.id === a.batchId)
                ).length :
                '7 days'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'student' ? 'Tasks due soon' : 'Last login activity'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1">
        <Tabs defaultValue="recent">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Overview</h3>
            <TabsList>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="recent" className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 w-1/3 bg-muted rounded"></div>
                    <div className="h-4 w-1/4 bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-muted rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                {recentBatches.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Batches</CardTitle>
                      <CardDescription>
                        Your {user?.role === 'admin' ? 'platform' : 'active'} batches
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      {recentBatches.map((batch) => (
                        <div key={batch.id} className="flex items-center p-2 hover:bg-accent rounded-md transition-colors">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{batch.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Started {formatDate(batch.startDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
                
                {recentPresentations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Presentations</CardTitle>
                      <CardDescription>
                        {user?.role === 'student' ? 'Available for you' : 'Your course materials'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      {recentPresentations.map((presentation) => (
                        <div key={presentation.id} className="flex items-center p-2 hover:bg-accent rounded-md transition-colors">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{presentation.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {presentation.isReleased 
                                ? `Released on ${formatDate(presentation.releaseDate)}`
                                : `Scheduled for ${formatDate(presentation.releaseDate)}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
                
                {recentAssignments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Assignments</CardTitle>
                      <CardDescription>
                        {user?.role === 'student' ? 'Your tasks' : 'Tasks you have assigned'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      {recentAssignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center p-2 hover:bg-accent rounded-md transition-colors">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{assignment.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Due on {formatDate(assignment.dueDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  {user?.role === 'student' 
                    ? 'Your upcoming assignment deadlines' 
                    : 'Assignment deadlines for your batches'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center p-2 animate-pulse">
                      <div className="h-8 w-8 rounded-full bg-muted mr-3"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/3 bg-muted rounded"></div>
                        <div className="h-3 w-1/4 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))
                ) : assignments.filter(a => 
                    new Date(a.dueDate) > new Date() &&
                    (user?.role === 'admin' || 
                     (user?.role === 'trainer' && a.trainerId === user.id) ||
                     (user?.role === 'student' && batches.filter(b => 
                       b.students.some(s => s.id === user?.id)
                     ).some(b => b.id === a.batchId)))
                  ).length > 0 ? (
                  <div className="grid gap-2">
                    {assignments.filter(a => 
                      new Date(a.dueDate) > new Date() &&
                      (user?.role === 'admin' || 
                       (user?.role === 'trainer' && a.trainerId === user.id) ||
                       (user?.role === 'student' && batches.filter(b => 
                         b.students.some(s => s.id === user?.id)
                       ).some(b => b.id === a.batchId)))
                    )
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 5)
                    .map((assignment) => (
                      <div key={assignment.id} className="flex items-center p-2 hover:bg-accent rounded-md transition-colors">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{assignment.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Due on {formatDate(assignment.dueDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No upcoming deadlines
                  </div>
                )}
              </CardContent>
            </Card>
            
            {user?.role !== 'student' && (
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Releases</CardTitle>
                  <CardDescription>
                    Scheduled presentation releases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center p-2 animate-pulse">
                        <div className="h-8 w-8 rounded-full bg-muted mr-3"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-1/3 bg-muted rounded"></div>
                          <div className="h-3 w-1/4 bg-muted rounded"></div>
                        </div>
                      </div>
                    ))
                  ) : presentations.filter(p => 
                      !p.isReleased && new Date(p.releaseDate) > new Date() &&
                      (user?.role === 'admin' || p.trainerId === user?.id)
                    ).length > 0 ? (
                    <div className="grid gap-2">
                      {presentations.filter(p => 
                        !p.isReleased && new Date(p.releaseDate) > new Date() &&
                        (user?.role === 'admin' || p.trainerId === user?.id)
                      )
                      .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
                      .slice(0, 5)
                      .map((presentation) => (
                        <div key={presentation.id} className="flex items-center p-2 hover:bg-accent rounded-md transition-colors">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{presentation.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Scheduled for {formatDate(presentation.releaseDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No upcoming releases scheduled
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
};

export default withAuth(Dashboard);
