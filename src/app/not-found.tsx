"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('user_role');
    setUserRole(role);
    setIsLoading(false);
  }, []);

  // Get dashboard link based on role
  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'owner':
        return '/owner/dashboard';
      default:
        return '/'; // Homepage for non-logged in users
    }
  };

  // Get role-specific text
  const getRoleText = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Dashboard';
      case 'doctor':
        return 'Doctor Dashboard';
      case 'owner':
        return 'Owner Dashboard';
      default:
        return 'Homepage';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      {/* <div className="mb-8">
        <img 
          src="/tailbuddies-logo.png" 
          alt="TailBuddies Logo" 
          width="150" 
          height="80"
          className="cursor-pointer"
          onClick={() => router.push('/')}
        />
      </div> */}

      {/* 404 Content */}
      <div className="text-center max-w-2xl">
        {/* 404 Number */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-800 opacity-10">404</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl font-bold text-red-500">404</div>
            <div className="text-xl font-semibold text-gray-700 mt-2">Page Not Found</div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! Lost your way?
        </h1>
        
        <p className="text-gray-600 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Don't worry, we'll help you find your way back!
        </p>

        {/* User Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-12  rounded-full flex items-center justify-center `}>
              <span className="text-2xl">
                {userRole === 'admin' ? '' : 
                 userRole === 'doctor' ? '' : 
                 userRole === 'owner' ? '' : ''}
              </span>
            </div>
          </div>
          
          <h3 className="font-bold text-gray-900 text-center mb-2">
            {isLoading ? 'Checking your status...' : 
             userRole ? `You're logged in as ${userRole}` : 'You are not logged in'}
          </h3>
          
          <p className="text-gray-600 text-sm text-center">
            {userRole 
              ? `You'll be redirected to your ${userRole} dashboard` 
              : 'You can go back to the homepage or sign in'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Primary Button - Role-based dashboard */}
          <Link
            href={getDashboardLink()}
            className={`px-8 py-3 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl ${
              userRole === 'admin' ? 'bg-red-600 hover:bg-red-700 text-white' :
              userRole === 'doctor' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
              userRole === 'owner' ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' :
              'bg-gray-800 hover:bg-gray-900 text-white'
            }`}
          >
            {isLoading ? 'Loading...' : `Go to ${getRoleText()}`}
          </Link>

          {/* Secondary Options */}
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition"
            >
               Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
