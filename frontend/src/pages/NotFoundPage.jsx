import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/shared/Button';
import { Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="p-4 bg-indigo-50 rounded-2xl mb-6">
        <Search className="h-12 w-12 text-indigo-600" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md text-center">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link to="/">
        <Button size="lg">Return to Home Feed</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
