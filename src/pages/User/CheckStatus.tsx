import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { Clock, Calendar, User, FileText, Star, MessageCircle, ThumbsUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

const CheckStatus = () => {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, comment: '' });
  const [selectedComplaint, setSelectedComplaint] = useState<string>('');

  const userComplaints = state.complaints.filter(c => c.userId === state.user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'assigned': return 'assigned';
      case 'in-progress': return 'in-progress';
      case 'resolved': return 'resolved';
      case 'escalated': return 'escalated';
      default: return 'pending';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'assigned': return 'Assigned to Department';
      case 'in-progress': return 'Work in Progress';
      case 'resolved': return 'Resolved';
      case 'escalated': return 'Escalated';
      default: return status;
    }
  };

  const getProgressPercentage = (complaint: any) => {
    if (complaint.status === 'resolved') return 100;
    if (complaint.status === 'in-progress') {
      const completedSteps = Object.values(complaint.progressSteps).filter(Boolean).length;
      return Math.max(25, (completedSteps / 3) * 75);
    }
    if (complaint.status === 'assigned') return 25;
    return 0;
  };

  const formatTimeLeft = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours left`;
    return `${hours} hours left`;
  };

  const handleFeedbackSubmit = () => {
    if (!selectedComplaint || feedbackForm.rating === 0) {
      toast({
        title: 'Invalid feedback',
        description: 'Please provide a rating for the resolution.',
        variant: 'destructive',
      });
      return;
    }

    dispatch({
      type: 'ADD_FEEDBACK',
      payload: {
        complaintId: selectedComplaint,
        feedback: feedbackForm,
      },
    });

    toast({
      title: 'Feedback submitted!',
      description: 'Thank you for your feedback. It helps us improve our services.',
    });

    setFeedbackForm({ rating: 0, comment: '' });
    setSelectedComplaint('');
  };

  const userStats = {
    total: userComplaints.length,
    resolved: userComplaints.filter(c => c.status === 'resolved').length,
    pending: userComplaints.filter(c => c.status === 'pending').length,
    inProgress: userComplaints.filter(c => c.status === 'in-progress' || c.status === 'assigned').length,
    escalated: userComplaints.filter(c => c.status === 'escalated').length,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Your Complaints Status</h1>
              <p className="text-muted-foreground">Track the progress of your submitted issues</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{userStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-pending">{userStats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-in-progress">{userStats.inProgress}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-resolved">{userStats.resolved}</div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-escalated">{userStats.escalated}</div>
                  <div className="text-sm text-muted-foreground">Escalated</div>
                </CardContent>
              </Card>
            </div>

            {/* Complaints List */}
            <div className="space-y-6">
              {userComplaints.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="mb-2">No complaints yet</CardTitle>
                    <CardDescription className="mb-4">
                      You haven't submitted any complaints. Start by reporting an issue to help improve your community.
                    </CardDescription>
                    <Button asChild>
                      <a href="/raise-problem">Report Your First Issue</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                userComplaints.map((complaint) => (
                  <Card key={complaint.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{complaint.category}</CardTitle>
                            <Badge variant="secondary" className={`bg-${getStatusColor(complaint.status)}`}>
                              {getStatusText(complaint.status)}
                            </Badge>
                            {complaint.isCritical && (
                              <Badge variant="destructive">Critical</Badge>
                            )}
                          </div>
                          <CardDescription className="line-clamp-2">
                            {complaint.description}
                          </CardDescription>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1 sm:text-right">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(complaint.dateRaised).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeLeft(complaint.slaDeadline)}
                          </div>
                          {complaint.assignedAdminName && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {complaint.assignedAdminName}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{getProgressPercentage(complaint)}%</span>
                        </div>
                        <Progress value={getProgressPercentage(complaint)} className="h-2" />
                      </div>

                      {/* Current Step */}
                      {complaint.currentStep && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Current Status</p>
                          <p className="text-sm text-muted-foreground">{complaint.currentStep}</p>
                        </div>
                      )}

                      {/* Progress Steps for In-Progress */}
                      {complaint.status === 'in-progress' && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Work Progress</p>
                          <div className="space-y-1">
                            {Object.entries(complaint.progressSteps).map(([step, completed], index) => (
                              <div key={step} className="flex items-center gap-2 text-sm">
                                {completed ? (
                                  <CheckCircle className="h-4 w-4 text-success" />
                                ) : (
                                  <div className="h-4 w-4 border-2 rounded-full border-muted-foreground/20" />
                                )}
                                <span className={completed ? 'text-foreground' : 'text-muted-foreground'}>
                                  Step {index + 1} - {completed ? 'Completed' : 'Pending'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Community Support */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-primary" />
                          <span className="text-sm">{complaint.upvotes} upvotes</span>
                        </div>
                        {complaint.photo && (
                          <Badge variant="outline">Photo attached</Badge>
                        )}
                      </div>

                      {/* Feedback Section for Resolved */}
                      {complaint.status === 'resolved' && (
                        <div className="border-t pt-4">
                          {complaint.feedback ? (
                            <div className="p-3 bg-success/5 rounded-lg">
                              <p className="text-sm font-medium mb-2 text-success">Feedback Submitted</p>
                              <div className="flex items-center gap-1 mb-1">
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
                                <p className="text-sm text-muted-foreground">{complaint.feedback.comment}</p>
                              )}
                            </div>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => setSelectedComplaint(complaint.id)}
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Provide Feedback
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Rate the Resolution</DialogTitle>
                                  <DialogDescription>
                                    How satisfied are you with how this issue was resolved?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Rating</Label>
                                    <div className="flex gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Button
                                          key={i}
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setFeedbackForm({ ...feedbackForm, rating: i + 1 })}
                                        >
                                          <Star
                                            className={`h-5 w-5 ${
                                              i < feedbackForm.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-muted-foreground'
                                            }`}
                                          />
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="comment">Additional Comments (Optional)</Label>
                                    <Textarea
                                      id="comment"
                                      placeholder="Share your experience..."
                                      value={feedbackForm.comment}
                                      onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={handleFeedbackSubmit}>Submit Feedback</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CheckStatus;