import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApp } from '@/contexts/AppContext';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
    department: '',
    deptId: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { state, dispatch, departmentMapping } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const departments = Object.values(departmentMapping);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRoleChange = (role: 'user' | 'admin') => {
    setFormData({
      ...formData,
      role,
      department: '',
      deptId: '',
    });
    setError('');
  };

  const handleDepartmentChange = (department: string) => {
    setFormData({
      ...formData,
      department,
      deptId: `${department.toLowerCase().replace(/\s+/g, '_')}_001`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check if email already exists
    const existingUser = state.users.find(u => u.email === formData.email);
    if (existingUser) {
      setError('An account with this email already exists');
      setIsLoading(false);
      return;
    }

    // Validate admin fields
    if (formData.role === 'admin' && (!formData.department || !formData.deptId)) {
      setError('Please select a department for admin role');
      setIsLoading(false);
      return;
    }

    // Create new user
    const newUser = {
      id: formData.password, // Using password as ID for demo purposes
      name: formData.name,
      email: formData.email,
      role: formData.role,
      ...(formData.role === 'admin' && {
        department: formData.department,
        deptId: formData.deptId,
      }),
    };

    // Register user
    dispatch({ type: 'REGISTER_USER', payload: newUser });
    
    // Auto-login after registration
    dispatch({ type: 'LOGIN', payload: newUser });
    
    toast({
      title: 'Account created successfully!',
      description: `Welcome to CivicReport, ${newUser.name}!`,
    });

    // Redirect based on role
    if (newUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="self-start">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <UserPlus className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join CivicReport to start reporting issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Citizen</SelectItem>
                    <SelectItem value="admin">Department Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'admin' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={handleDepartmentChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.department && (
                    <div className="space-y-2">
                      <Label htmlFor="deptId">Department ID</Label>
                      <Input
                        id="deptId"
                        name="deptId"
                        type="text"
                        value={formData.deptId}
                        onChange={handleInputChange}
                        placeholder="Auto-generated"
                        disabled
                      />
                    </div>
                  )}
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;