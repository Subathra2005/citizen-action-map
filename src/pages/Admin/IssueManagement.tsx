import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { 
  ClipboardList, 
  Eye, 
  UserCheck, 
  Filter, 
  Search, 
  Calendar, 
  MapPin, 
  Users,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

const IssueManagement = () => {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateRaised');

  // Filter complaints for this admin's department
  const departmentComplaints = state.complaints.filter(
    c => c.department === state.user?.department
  );

  // Apply filters and search
  const filteredComplaints = departmentComplaints
    .filter(complaint => {
      const matchesSearch = complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           complaint.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateRaised':
          return new Date(b.dateRaised).getTime() - new Date(a.dateRaised).getTime();
        case 'priority':
          if (a.isCritical && !b.isCritical) return -1;
          if (!a.isCritical && b.isCritical) return 1;
          return b.upvotes - a.upvotes;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const handleAcceptComplaint = (complaintId: string) => {
    if (!state.user) return;

    dispatch({
      type: 'ASSIGN_COMPLAINT',
      payload: {
        complaintId,
        adminId: state.user.id,
        adminName: state.user.name,
      },
    });

    toast({
      title: 'Complaint assigned!',
      description: 'You have successfully taken this complaint. Start working on it.',
    });

    setSelectedComplaint(null);
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

  const getPriorityColor = (complaint: any) => {
    if (complaint.isCritical) return 'destructive';
    if (complaint.upvotes >= 10) return 'destructive';
    return 'secondary';
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

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <ClipboardList className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Issue Management</h1>
                <p className="text-muted-foreground">
                  Manage issues for {state.user?.department}
                </p>
              </div>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Issues</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by description, user, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status Filter</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                    <Label>Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dateRaised">Date Raised</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredComplaints.length} of {departmentComplaints.length} issues
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issues Table */}
            <Card>
              <CardHeader>
                <CardTitle>Department Issues</CardTitle>
                <CardDescription>
                  All issues assigned to your department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Issue Details</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComplaints.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No issues found matching your criteria.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredComplaints.map((complaint) => (
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
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{complaint.userName}</div>
                                <div className="text-sm text-muted-foreground">ID: {complaint.userId}</div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant={getPriorityColor(complaint)}>
                                  {complaint.isCritical ? 'Critical' : 
                                   complaint.upvotes >= 10 ? 'High' : 'Normal'}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
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
                              {complaint.assignedAdminName ? (
                                <div className="space-y-1">
                                  <div className="text-sm font-medium">{complaint.assignedAdminName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {complaint.assignedAdminId === state.user?.id ? '(You)' : ''}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">Unassigned</span>
                              )}
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedComplaint(complaint)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <ClipboardList className="h-5 w-5" />
                                        Issue Details
                                      </DialogTitle>
                                      <DialogDescription>
                                        Review the complete issue information
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    {selectedComplaint && (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-sm font-medium">Category</Label>
                                            <p className="text-sm">{selectedComplaint.category}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium">Status</Label>
                                            <Badge className={getStatusColor(selectedComplaint.status)}>
                                              {selectedComplaint.status}
                                            </Badge>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <Label className="text-sm font-medium">Description</Label>
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {selectedComplaint.description}
                                          </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-sm font-medium">Location</Label>
                                            <p className="text-sm">{selectedComplaint.location}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium">Reported By</Label>
                                            <p className="text-sm">{selectedComplaint.userName}</p>
                                          </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-sm font-medium">Date Raised</Label>
                                            <p className="text-sm">{new Date(selectedComplaint.dateRaised).toLocaleString()}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium">SLA Deadline</Label>
                                            <p className="text-sm">{new Date(selectedComplaint.slaDeadline).toLocaleString()}</p>
                                          </div>
                                        </div>
                                        
                                        {selectedComplaint.photo && (
                                          <div>
                                            <Label className="text-sm font-medium">Attached Photo</Label>
                                            <img 
                                              src={selectedComplaint.photo} 
                                              alt="Issue photo" 
                                              className="w-full h-48 object-cover rounded-lg border mt-2"
                                            />
                                          </div>
                                        )}
                                        
                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                          <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span className="text-sm">Community Support: {selectedComplaint.upvotes} upvotes</span>
                                          </div>
                                          {selectedComplaint.isCritical && (
                                            <Badge variant="destructive">Critical Issue</Badge>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                    <DialogFooter>
                                      {selectedComplaint?.status === 'pending' && (
                                        <Button 
                                          onClick={() => handleAcceptComplaint(selectedComplaint.id)}
                                          className="flex items-center gap-2"
                                        >
                                          <UserCheck className="h-4 w-4" />
                                          Accept & Assign to Me
                                        </Button>
                                      )}
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                
                                {complaint.status === 'pending' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => handleAcceptComplaint(complaint.id)}
                                    className="flex items-center gap-1"
                                  >
                                    <UserCheck className="h-3 w-3" />
                                    Accept
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

export default IssueManagement;