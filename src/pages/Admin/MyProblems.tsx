import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '@/contexts/AppContext';
import { 
  Users, 
  Eye, 
  Settings, 
  CheckCircle, 
  Star,
  MapPin,
  Calendar,
  FileText,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

const MyProblems = () => {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [progressUpdate, setProgressUpdate] = useState({
    step1: false,
    step2: false,
    step3: false,
    currentStep: '',
  });

  // Filter complaints assigned to this admin
  const myComplaints = state.complaints.filter(
    c => c.assignedAdminId === state.user?.id
  );

  const handleUpdateProgress = () => {
    if (!selectedComplaint) return;

    const completedSteps = Object.values(progressUpdate).slice(0, 3).filter(Boolean).length;
    let newCurrentStep = '';
    
    if (completedSteps === 1) newCurrentStep = 'Initial assessment completed';
    else if (completedSteps === 2) newCurrentStep = 'Work in progress';
    else if (completedSteps === 3) newCurrentStep = 'Final stage - nearing completion';
    else newCurrentStep = 'Work assigned and started';

    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: {
        complaintId: selectedComplaint.id,
        progressSteps: {
          step1: progressUpdate.step1,
          step2: progressUpdate.step2,
          step3: progressUpdate.step3,
        },
        currentStep: progressUpdate.currentStep || newCurrentStep,
      },
    });

    toast({
      title: 'Progress updated!',
      description: 'The complaint progress has been updated successfully.',
    });

    setSelectedComplaint(null);
    setProgressUpdate({ step1: false, step2: false, step3: false, currentStep: '' });
  };

  const handleResolveComplaint = (complaintId: string) => {
    dispatch({
      type: 'RESOLVE_COMPLAINT',
      payload: { complaintId },
    });

    toast({
      title: 'Complaint resolved!',
      description: 'The complaint has been marked as resolved. User will be notified.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-pending text-pending-foreground';
      case 'assigned': return 'bg-assigned text-assigned-foreground';
      case 'in-progress': return 'bg-in-progress text-in-progress-foreground';
      case 'resolved': return 'bg-resolved text-resolved-foreground';
      case 'escalated': return 'bg-escalated text-escalated-foreground';
      default: return 'bg-pending text-pending-foreground';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const openProgressDialog = (complaint: any) => {
    setSelectedComplaint(complaint);
    setProgressUpdate({
      step1: complaint.progressSteps?.step1 || false,
      step2: complaint.progressSteps?.step2 || false,
      step3: complaint.progressSteps?.step3 || false,
      currentStep: complaint.currentStep || '',
    });
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">My Problems</h1>
                <p className="text-muted-foreground">
                  Issues you've taken responsibility for
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {myComplaints.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Assigned</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-in-progress">
                    {myComplaints.filter(c => c.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-resolved">
                    {myComplaints.filter(c => c.status === 'resolved').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">
                    {myComplaints.filter(c => c.status === 'assigned').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Start</div>
                </CardContent>
              </Card>
            </div>

            {/* Problems Table */}
            <Card>
              <CardHeader>
                <CardTitle>Your Assigned Problems</CardTitle>
                <CardDescription>
                  Manage and update the progress of your assigned issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Issue Details</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myComplaints.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No problems assigned to you yet.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        myComplaints.map((complaint) => (
                          <TableRow key={complaint.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{complaint.category}</div>
                                <div className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                                  {complaint.description}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {complaint.location}
                                </div>
                                {complaint.isCritical && (
                                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{complaint.userName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {complaint.upvotes} upvotes
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <Badge className={getStatusColor(complaint.status)}>
                                {complaint.status}
                              </Badge>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">{new Date(complaint.dateRaised).toLocaleDateString()}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatTimeAgo(complaint.dateRaised)}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              {complaint.status === 'in-progress' ? (
                                <div className="space-y-1">
                                  <div className="text-xs">
                                    Step {Object.values(complaint.progressSteps || {}).filter(Boolean).length}/3
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {complaint.currentStep || 'In progress'}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  {complaint.status === 'resolved' ? 'Completed' : 'Not started'}
                                </span>
                              )}
                            </TableCell>
                            
                            <TableCell>
                              {complaint.status === 'resolved' && complaint.feedback ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < complaint.feedback!.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  {complaint.feedback.comment && (
                                    <div className="text-xs text-muted-foreground line-clamp-1">
                                      {complaint.feedback.comment}
                                    </div>
                                  )}
                                </div>
                              ) : complaint.status === 'resolved' ? (
                                <span className="text-xs text-muted-foreground">No feedback yet</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {/* View Details Dialog */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Issue Details</DialogTitle>
                                      <DialogDescription>
                                        Complete information about this issue
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium">Category</Label>
                                          <p className="text-sm">{complaint.category}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Status</Label>
                                          <Badge className={getStatusColor(complaint.status)}>
                                            {complaint.status}
                                          </Badge>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Label className="text-sm font-medium">Description</Label>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {complaint.description}
                                        </p>
                                      </div>
                                      
                                      {complaint.photo && (
                                        <div>
                                          <Label className="text-sm font-medium">Photo</Label>
                                          <img 
                                            src={complaint.photo} 
                                            alt="Issue" 
                                            className="w-full h-48 object-cover rounded-lg border mt-2"
                                          />
                                        </div>
                                      )}
                                      
                                      {complaint.feedback && (
                                        <div className="p-3 bg-success/5 rounded-lg">
                                          <Label className="text-sm font-medium text-success">User Feedback</Label>
                                          <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                              <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                  i < complaint.feedback!.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-muted-foreground'
                                                }`}
                                              />
                                            ))}
                                          </div>
                                          {complaint.feedback.comment && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                              "{complaint.feedback.comment}"
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                {/* Update Progress Dialog */}
                                {(complaint.status === 'assigned' || complaint.status === 'in-progress') && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        size="sm"
                                        onClick={() => openProgressDialog(complaint)}
                                      >
                                        <Settings className="h-3 w-3 mr-1" />
                                        Update
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Update Progress</DialogTitle>
                                        <DialogDescription>
                                          Update the work progress for this issue
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <div className="space-y-4">
                                        <div className="space-y-3">
                                          <Label className="text-base font-medium">Work Progress</Label>
                                          
                                          <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                              <Checkbox 
                                                id="step1"
                                                checked={progressUpdate.step1}
                                                onCheckedChange={(checked) => 
                                                  setProgressUpdate({...progressUpdate, step1: !!checked})
                                                }
                                              />
                                              <Label htmlFor="step1" className="text-sm">
                                                Step 1: Initial Assessment & Planning
                                              </Label>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                              <Checkbox 
                                                id="step2"
                                                checked={progressUpdate.step2}
                                                onCheckedChange={(checked) => 
                                                  setProgressUpdate({...progressUpdate, step2: !!checked})
                                                }
                                              />
                                              <Label htmlFor="step2" className="text-sm">
                                                Step 2: Work Implementation
                                              </Label>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                              <Checkbox 
                                                id="step3"
                                                checked={progressUpdate.step3}
                                                onCheckedChange={(checked) => 
                                                  setProgressUpdate({...progressUpdate, step3: !!checked})
                                                }
                                              />
                                              <Label htmlFor="step3" className="text-sm">
                                                Step 3: Final Review & Completion
                                              </Label>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="currentStep">Current Status Message</Label>
                                          <Textarea
                                            id="currentStep"
                                            placeholder="Describe the current work status..."
                                            value={progressUpdate.currentStep}
                                            onChange={(e) => 
                                              setProgressUpdate({...progressUpdate, currentStep: e.target.value})
                                            }
                                          />
                                        </div>
                                      </div>
                                      
                                      <DialogFooter>
                                        <Button onClick={handleUpdateProgress}>
                                          <Save className="h-4 w-4 mr-2" />
                                          Save Progress
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                )}

                                {/* Resolve Button */}
                                {complaint.status === 'in-progress' && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleResolveComplaint(complaint.id)}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Resolve
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MyProblems;