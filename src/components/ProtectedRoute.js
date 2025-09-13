"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../store/hooks';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [],
  redirectTo = '/auth/login'
}) => {
  const router = useRouter();
  const { user, isAuthenticated, loading, refreshAuthToken } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const redirectInitiated = useRef(false);
  const refreshAttempted = useRef(false);

  useEffect(() => {
    let isMounted = true;
    
    // If already redirecting, do nothing to prevent loops
    if (isRedirecting || redirectInitiated.current) {
      return;
    }
    
    // If still loading, wait
    if (loading) {
      return;
    }
    
    const verifyAuth = async () => {
      // If already authenticated, check role permissions
      if (isAuthenticated) {
        // If authenticated but doesn't have required role, redirect to unauthorized
        if (allowedRoles.length > 0 && user) {
          const hasRequiredRole = allowedRoles.includes(user.role);
          if (!hasRequiredRole) {
            redirectInitiated.current = true;
            if (isMounted) {
              setIsRedirecting(true);
              router.push('/unauthorized');
            }
            return;
          }
        }
        
        // If we get here, user is authenticated and has required role
        if (isMounted) {
          setIsVerifying(false);
        }
        return;
      }
      
      // Try to refresh the token if not authenticated and not already attempted
      if (!isAuthenticated && !refreshAttempted.current) {
        refreshAttempted.current = true;
        setIsVerifying(true);
        
        try {
          const refreshResult = await refreshAuthToken();
          
          // If refresh failed and we're still not authenticated, redirect
          if (!refreshResult.success && !isAuthenticated) {
            // Add a small delay to allow state updates
            setTimeout(() => {
              if (!isAuthenticated && isMounted) {
                redirectInitiated.current = true;
                setIsRedirecting(true);
                router.replace(redirectTo);
              }
            }, 100);
          } else {
            // Refresh succeeded, stop verifying
            setIsVerifying(false);
          }
        } catch (error) {
          console.error("Auth verification failed:", error);
          if (isMounted) {
            redirectInitiated.current = true;
            setIsRedirecting(true);
            router.replace(redirectTo);
          }
        }
      } else if (!isAuthenticated) {
        // If we've already tried refreshing and still not authenticated, redirect
        redirectInitiated.current = true;
        if (isMounted) {
          setIsRedirecting(true);
          router.replace(redirectTo);
        }
      }
    };
    
    verifyAuth();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, loading, user, router, redirectTo, allowedRoles, isRedirecting, refreshAuthToken]);

  // Show loading indicator during verification
  if (loading || isVerifying) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If redirecting, show nothing
  if (isRedirecting || !isAuthenticated) {
    return null;
  }

  // Render children if authenticated and has required role
  return children;
};

export default ProtectedRoute; 