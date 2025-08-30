import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, FileText, CheckCircle, BarChart3, Users, Shield, Zap } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: FileText,
      title: 'Report Issues',
      description: 'Easily report civic problems with photos and descriptions',
      link: '/raise-problem',
    },
    {
      icon: BarChart3,
      title: 'View Heatmaps',
      description: 'See live complaint data and community verification',
      link: '/heatmaps',
    },
    {
      icon: CheckCircle,
      title: 'Track Status',
      description: 'Monitor your complaints and get real-time updates',
      link: '/check-status',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Report',
      description: 'Submit your civic issue with details and photos',
      icon: FileText,
    },
    {
      number: '02',
      title: 'Track',
      description: 'Monitor progress and receive updates',
      icon: CheckCircle,
    },
    {
      number: '03',
      title: 'Resolve',
      description: 'Issues are assigned and resolved by departments',
      icon: Shield,
    },
    {
      number: '04',
      title: 'Feedback',
      description: 'Rate the resolution and help improve the system',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Powered by Community
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Voice, Your City
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Report civic issues, track their progress, and work together to build a better community. 
              Your problems are heard, tracked, and resolved efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="shadow-lg">
                <Link to="/raise-problem" className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Report an Issue</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/heatmaps" className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>View Heatmaps</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How CivicReport Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, transparent process that ensures your civic issues are addressed efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="relative text-center group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                          {step.number}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-4 h-6 w-6 text-muted-foreground transform -translate-y-1/2" />
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Can Do</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to help you engage with your community and track civic improvements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" asChild className="w-full justify-start group-hover:bg-primary/5">
                      <Link to={feature.link} className="flex items-center space-x-2">
                        <span>Get Started</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Making a Real Impact</h2>
            <p className="text-lg opacity-90 mb-12 max-w-2xl mx-auto">
              Join thousands of citizens working together to improve their communities
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">1,247</div>
                <div className="text-lg opacity-80">Issues Reported</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">892</div>
                <div className="text-lg opacity-80">Issues Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">3,456</div>
                <div className="text-lg opacity-80">Active Citizens</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
