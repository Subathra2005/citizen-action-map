import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  ThumbsUp, 
  MapPin, 
  Filter,
  Calendar,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Heatmaps = () => {
  const { state, dispatch, categories } = useApp();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    dateRange: 'all',
  });

  const filteredComplaints = useMemo(() => {
    return state.complaints.filter(complaint => {
      if (filters.category !== 'all' && complaint.category !== filters.category) return false;
      if (filters.status !== 'all' && complaint.status !== filters.status) return false;
      
      if (filters.dateRange !== 'all') {
        const complaintDate = new Date(complaint.dateRaised);
        const now = new Date();
        const daysAgo = {
          '7': 7,
          '30': 30,
          '90': 90,
        }[filters.dateRange];
        
        if (daysAgo) {
          const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
          if (complaintDate < cutoffDate) return false;
        }
      }
      
      return true;
    });
  }, [state.complaints, filters]);

  const stats = useMemo(() => {
    const total = filteredComplaints.length;
    const uniqueUsers = new Set(filteredComplaints.map(c => c.userId)).size;
    const solved = filteredComplaints.filter(c => c.status === 'resolved').length;
    const pending = filteredComplaints.filter(c => c.status === 'pending' || c.status === 'assigned' || c.status === 'in-progress').length;
    
    return { total, uniqueUsers, solved, pending };
  }, [filteredComplaints]);

  const categoryStats = useMemo(() => {
    const categoryCount: { [key: string]: number } = {};
    categories.forEach(cat => {
      categoryCount[cat] = filteredComplaints.filter(c => c.category === cat).length;
    });
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  }, [filteredComplaints, categories]);

  const handleUpvote = (complaintId: string) => {
    if (!state.user) {
      toast({
        title: 'Login required',
        description: 'Please login to upvote complaints.',
        variant: 'destructive',
      });
      return;
    }

    const complaint = state.complaints.find(c => c.id === complaintId);
    if (complaint?.upvotedBy.includes(state.user.id)) {
      toast({
        title: 'Already upvoted',
        description: 'You have already upvoted this complaint.',
        variant: 'destructive',
      });
      return;
    }

    dispatch({
      type: 'UPVOTE_COMPLAINT',
      payload: { complaintId, userId: state.user.id },
    });

    toast({
      title: 'Upvote added!',
      description: 'Thank you for supporting this complaint.',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Community Heatmaps</h1>
            <p className="text-muted-foreground">Live data on civic issues and community engagement</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <CardDescription>Filter the data to see specific insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={filters.category} 
                    onValueChange={(value) => setFilters({...filters, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters({...filters, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select 
                    value={filters.dateRange} 
                    onValueChange={(value) => setFilters({...filters, dateRange: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Problems</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold text-accent">{stats.uniqueUsers}</div>
                <div className="text-sm text-muted-foreground">Active Citizens</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                <div className="text-3xl font-bold text-success">{stats.solved}</div>
                <div className="text-sm text-muted-foreground">Problems Solved</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
                <div className="text-3xl font-bold text-warning">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending Issues</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Issues by Category</CardTitle>
                <CardDescription>Most reported categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats.map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max((count / stats.total) * 100, 5)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Rate</CardTitle>
                <CardDescription>Tracking problem resolution efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Resolution Rate</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Solved</span>
                      <span className="text-success">{stats.solved}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>In Progress</span>
                      <span className="text-warning">{stats.pending}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Reported</span>
                      <span className="text-muted-foreground">{stats.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Complaints Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Live Community Feed
              </CardTitle>
              <CardDescription>Recent complaints that you can support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredComplaints.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No complaints match your current filters.</p>
                  </div>
                ) : (
                  filteredComplaints
                    .sort((a, b) => new Date(b.dateRaised).getTime() - new Date(a.dateRaised).getTime())
                    .slice(0, 10)
                    .map((complaint) => (
                      <div key={complaint.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{complaint.category}</h3>
                              <Badge className={getStatusColor(complaint.status)}>
                                {complaint.status}
                              </Badge>
                              {complaint.isCritical && (
                                <Badge variant="destructive">Critical</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {complaint.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {complaint.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(complaint.dateRaised).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                By {complaint.userName}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpvote(complaint.id)}
                              disabled={!state.user || complaint.upvotedBy.includes(state.user?.id || '')}
                              className="flex items-center gap-1"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              {complaint.upvotes}
                            </Button>
                          </div>
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
  );
};

export default Heatmaps;