"use client";

import { useAuth } from "../../store/hooks";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push('/');
  };

  const goDashboard = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    let dashboardPath = '/dashboard/hospital';
    if (user?.role === 'admin') {
      dashboardPath = '/dashboard/admin';
    } else if (user?.role === 'hospital') {
      dashboardPath = '/dashboard/hospital';
    } else if (user?.role === 'assistant') {
      dashboardPath = '/dashboard/assistant';
    }
    
    router.push(dashboardPath);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={goBack}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go Back
          </button>
          
          <button
            onClick={goDashboard}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={goHome}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to Home Page
          </button>
          
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 px-4 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 