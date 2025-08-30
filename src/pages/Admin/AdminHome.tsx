import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { 
  Home, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  BarChart3,
  Star,
  FileText,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminHome = () => {
  const { state } = useApp();
  
  // Filter complaints for this admin's department
  const departmentComplaints = state.complaints.filter(
    c => c.department === state.user?.department
  );
  
  const myComplaints = departmentComplaints.filter(
    c => c.assignedAdminId === state.user?.id
  );
  
  const unassignedComplaints = departmentComplaints.filter(
    c => c.status === 'pending'
  );

  const stats = {
    totalSolved: myComplaints.filter(c => c.status === 'resolved').length,
    yetToAttend: unassignedComplaints.length,
    pending: myComplaints.filter(c => c.status === 'assigned' || c.status === 'in-progress').length,
    solvedByMe: myComplaints.filter(c => c.status === 'resolved').length,
  };

  const feedbackStats = myComplaints
    .filter(c => c.status === 'resolved' && c.feedback)
    .map(c => c.feedback!.rating);
  
  const avgRating = feedbackStats.length > 0 
    ? feedbackStats.reduce((a, b) => a + b, 0) / feedbackStats.length 
    : 0;

  const recentComplaints = departmentComplaints
    .sort((a, b) => new Date(b.dateRaised).getTime() - new Date(a.dateRaised).getTime())
    .slice(0, 5);

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

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Home className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground">
                Welcome back, {state.user?.name} - {state.user?.department}
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-success">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Solved</p>
                      <p className="text-3xl font-bold text-success">{stats.totalSolved}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-warning">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Yet to Attend</p>
                      <p className="text-3xl font-bold text-warning">{stats.yetToAttend}</p>
                    </div>
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-in-progress">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-3xl font-bold text-in-progress">{stats.pending}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-in-progress" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Solved by Me</p>
                      <p className="text-3xl font-bold text-primary">{stats.solvedByMe}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analysis */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Feedback Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Feedback Analysis
                  </CardTitle>
                  <CardDescription>User satisfaction with resolved issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {avgRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.round(avgRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Average rating from {feedbackStats.length} reviews
                      </p>
                    </div>
                    
                    {feedbackStats.length > 0 && (
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(rating => {
                          const count = feedbackStats.filter(r => r === rating).length;
                          const percentage = (count / feedbackStats.length) * 100;
                          return (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-sm w-8">{rating}★</span>
                              <Progress value={percentage} className="flex-1" />
                              <span className="text-sm text-muted-foreground w-8">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                  <CardDescription>Your department's efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Resolution Rate</span>
                      <span className="text-sm text-muted-foreground">
                        {departmentComplaints.length > 0 
                          ? Math.round((departmentComplaints.filter(c => c.status === 'resolved').length / departmentComplaints.length) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={departmentComplaints.length > 0 
                        ? (departmentComplaints.filter(c => c.status === 'resolved').length / departmentComplaints.length) * 100
                        : 0} 
                      className="h-2" 
                    />
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{departmentComplaints.length}</p>
                        <p className="text-sm text-muted-foreground">Total Issues</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-success">
                          {departmentComplaints.filter(c => c.status === 'resolved').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Resolved</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Department Activity
                  </CardTitle>
                  <CardDescription>Latest issues in your department</CardDescription>
                </div>
                <Button asChild variant="outline">
                  <Link to="/admin/issues">View All Issues</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentComplaints.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent activity in your department.</p>
                    </div>
                  ) : (
                    recentComplaints.map(complaint => (
                      <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{complaint.category}</h4>
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status}
                            </Badge>
                            {complaint.isCritical && (
                              <Badge variant="destructive">Critical</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {complaint.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {complaint.userName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(complaint.dateRaised).toLocaleDateString()}
                            </div>
                            {complaint.assignedAdminName && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Assigned to {complaint.assignedAdminName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {complaint.status === 'pending' && (
                            <Button size="sm" asChild>
                              <Link to="/admin/issues">Take Action</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminHome;