"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  const userRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;

  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin': return '/admin/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'owner': return '/owner/dashboard';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-red-50 to-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-red-600"></span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">Error Details:</p>
          <p className="text-red-600 text-sm mt-1">{error.message || 'Unknown error occurred'}</p>
          {error.digest && (
            <p className="text-red-500 text-xs mt-2">Error ID: {error.digest}</p>
          )}
        </div>

        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Our team has been notified.
          You can try again or navigate to a safe page.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition"
          >
            Try Again
          </button>

          <Link
            href={getDashboardLink()}
            className={`px-8 py-3 rounded-full font-semibold transition ${
              userRole === 'admin' ? 'bg-gray-800 hover:bg-gray-900 text-white' :
              userRole === 'doctor' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
              userRole === 'owner' ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' :
              'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {userRole ? `Go to ${userRole} Dashboard` : 'Go to Homepage'}
          </Link>

        </div>

        {/* Technical Info for Developers */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200 text-left">
          <details className="bg-gray-50 p-4 rounded-lg">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Technical Information (for developers)
            </summary>
            <div className="mt-3 text-sm text-gray-600">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                {JSON.stringify({
                  message: error.message,
                  digest: error.digest,
                  stack: error.stack,
                  timestamp: new Date().toISOString(),
                }, null, 2)}
              </pre>
            </div>
          </details>
        </div> */}
      </div>
    </div>
  );
}
