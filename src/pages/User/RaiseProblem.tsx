import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApp } from '@/contexts/AppContext';
import { Camera, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

const RaiseProblem = () => {
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    photo: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { state, dispatch, categories, departmentMapping } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError('');
  };

  const handleCategoryChange = (category: string) => {
    setFormData({
      ...formData,
      category,
    });
    setValidationError('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          photo: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateSubmission = () => {
    // Check if user already has unresolved complaint in same category
    const userComplaints = state.complaints.filter(
      c => c.userId === state.user?.id && c.status !== 'resolved'
    );
    
    const existingCategoryComplaint = userComplaints.find(
      c => c.category === formData.category
    );

    if (existingCategoryComplaint) {
      return 'You already have an unresolved complaint in this category. Please wait for it to be resolved or choose a different category.';
    }

    // Basic AI validation simulation
    if (formData.description.length < 20) {
      return 'Description too short. Please provide more details about the issue.';
    }

    if (!formData.description.toLowerCase().includes(formData.category.toLowerCase().split(' ')[0])) {
      return 'Description does not seem to match the selected category. Please review.';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationError('');

    // Validate submission
    const validationResult = validateSubmission();
    if (validationResult) {
      setValidationError(validationResult);
      setIsLoading(false);
      return;
    }

    if (!state.user) {
      setIsLoading(false);
      return;
    }

    // Create complaint
    const now = new Date();
    const slaDeadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days default

    const newComplaint = {
      id: `complaint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: state.user.id,
      userName: state.user.name,
      description: formData.description,
      category: formData.category,
      photo: formData.photo,
      location: formData.location || 'Location not specified',
      status: 'pending' as const,
      dateRaised: now.toISOString(),
      slaDeadline: slaDeadline.toISOString(),
      upvotes: 0,
      upvotedBy: [],
      progressSteps: {
        step1: false,
        step2: false,
        step3: false,
      },
      isCritical: false,
    };

    dispatch({ type: 'SUBMIT_COMPLAINT', payload: newComplaint });
    
    toast({
      title: 'Complaint submitted successfully!',
      description: 'Your issue has been reported and will be reviewed by the relevant department.',
    });

    // Navigate to status page
    navigate('/check-status');
    
    setIsLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Camera className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Report a Civic Issue</CardTitle>
                <CardDescription>
                  Help improve your community by reporting problems that need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {validationError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.category && (
                      <p className="text-sm text-muted-foreground">
                        Department: <span className="font-medium">{departmentMapping[formData.category]}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Problem Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the issue in detail. Include location landmarks, severity, and any other relevant information..."
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="min-h-[100px]"
                    />
                    <p className="text-sm text-muted-foreground">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Specific Location</Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="e.g., Near City Mall, Main Street intersection"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo">Upload Photo</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="flex-1"
                      />
                      {formData.photo && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                    </div>
                    {formData.photo && (
                      <div className="mt-2">
                        <img
                          src={formData.photo}
                          alt="Uploaded preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Auto-filled Information
                    </h3>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Reported by:</span> {state.user?.name}</p>
                      <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                      <p><span className="font-medium">Time:</span> {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !formData.category || !formData.description}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Complaint'}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium mb-2 text-primary">What happens next?</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Your complaint is reviewed and validated</li>
                    <li>• It becomes visible on heatmaps for community verification</li>
                    <li>• Assigned to the relevant department within 24 hours</li>
                    <li>• You'll receive updates as progress is made</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RaiseProblem;