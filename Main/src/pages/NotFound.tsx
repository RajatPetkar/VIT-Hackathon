
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="text-9xl font-bold text-primary/20">404</div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
