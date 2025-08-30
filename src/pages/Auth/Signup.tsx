import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Shield, ArrowLeft } from 'lucide-react';

const Signup = () => {

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
            <CardTitle className="text-2xl font-bold">Choose Account Type</CardTitle>
            <CardDescription>
              Select the type of account you want to create
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Citizen Account Option */}
            <Button asChild className="w-full h-20 text-left" variant="outline">
              <Link to="/user-signup" className="flex items-center space-x-4 p-4">
                <UserPlus className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-medium">Citizen Account</div>
                  <div className="text-sm text-muted-foreground">
                    Report civic issues in your community
                  </div>
                </div>
              </Link>
            </Button>

            {/* Admin Account Option */}
            <Button asChild className="w-full h-20 text-left" variant="outline">
              <Link to="/admin-signup" className="flex items-center space-x-4 p-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-medium">Department Admin</div>
                  <div className="text-sm text-muted-foreground">
                    Manage and resolve civic issues
                  </div>
                </div>
              </Link>
            </Button>

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