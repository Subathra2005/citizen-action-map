import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/contexts/AppContext';
import { MapPin, FileText, CheckCircle, BarChart3, User, LogOut, Home, Users, ClipboardList, Settings } from 'lucide-react';

const Navbar = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // User Navigation Links
  const userNavLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/heatmaps', label: 'Heatmaps', icon: BarChart3 },
    { to: '/raise-problem', label: 'Raise Problem', icon: FileText },
    { to: '/check-status', label: 'Check Status', icon: CheckCircle },
  ];

  // Admin Navigation Links
  const adminNavLinks = [
    { to: '/admin', label: 'Dashboard', icon: Home },
    { to: '/admin/issues', label: 'Issue Management', icon: ClipboardList },
    { to: '/admin/my-problems', label: 'My Problems', icon: Users },
    { to: '/admin/profile', label: 'Profile', icon: Settings },
  ];

  const navLinks = state.user?.role === 'admin' ? adminNavLinks : userNavLinks;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CivicReport
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.to}
                  variant={isActive(link.to) ? "default" : "ghost"}
                  asChild
                  className="h-9"
                >
                  <Link to={link.to} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-2">
            {state.isAuthenticated && state.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {state.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{state.user.name}</p>
                    <p className="text-xs text-muted-foreground">{state.user.email}</p>
                    {state.user.role === 'admin' && (
                      <p className="text-xs text-primary">Admin - {state.user.department}</p>
                    )}
                  </div>
                  <DropdownMenuItem onClick={() => navigate(state.user?.role === 'admin' ? '/admin/profile' : '/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-center space-x-1 pb-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.to}
                variant={isActive(link.to) ? "default" : "ghost"}
                size="sm"
                asChild
                className="h-8"
              >
                <Link to={link.to} className="flex items-center space-x-1">
                  <Icon className="h-3 w-3" />
                  <span className="text-xs">{link.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;