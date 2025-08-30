import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApp } from '@/contexts/AppContext';
import { User, Mail, Building, Shield, Trophy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminProfile = () => {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (state.user) {
      const updatedUser = {
        ...state.user,
        name: formData.name,
        email: formData.email,
      };
      
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      
      toast({
        title: 'Profile updated successfully!',
        description: 'Your profile information has been saved.',
      });
      
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: state.user?.name || '',
      email: state.user?.email || '',
    });
    setIsEditing(false);
  };

  // Calculate admin stats
  const adminComplaints = state.complaints.filter(c => c.assignedAdminId === state.user?.id);
  const resolvedCount = adminComplaints.filter(c => c.status === 'resolved').length;
  const inProgressCount = adminComplaints.filter(c => c.status === 'in-progress').length;
  const assignedCount = adminComplaints.filter(c => c.status === 'assigned').length;

  if (!state.user) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">Admin Profile</h1>
              <p className="text-muted-foreground mt-2">Manage your profile and view your performance</p>
            </div>

            {/* Profile Information Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  View and update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-muted/50 rounded-md">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{state.user.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-muted/50 rounded-md">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{state.user.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <div className="flex items-center p-3 bg-muted/50 rounded-md">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{state.user.department}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="flex items-center p-3 bg-muted/50 rounded-md">
                        <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="capitalize">{state.user.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Performance Statistics
                </CardTitle>
                <CardDescription>
                  Your complaint handling performance overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
                    <div className="text-sm text-muted-foreground">Resolved</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{inProgressCount}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{inProgressCount}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{assignedCount}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{assignedCount}</div>
                    <div className="text-sm text-muted-foreground">Assigned</div>
                  </div>

                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <Trophy className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary">{adminComplaints.length}</div>
                    <div className="text-sm text-muted-foreground">Total Handled</div>
                  </div>
                </div>

                {adminComplaints.length > 0 && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <h3 className="font-medium mb-2">Resolution Rate</h3>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(resolvedCount / adminComplaints.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {Math.round((resolvedCount / adminComplaints.length) * 100)}% of complaints resolved
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminProfile;