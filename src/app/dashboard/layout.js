'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/store/hooks';
// import DashboardNavbar from '@/components/DashboardNavbar';

export default function DashboardLayout({ children }) {
    const { user, isAuthenticated, loading, refreshAuthToken } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const redirectAttempted = useRef(false);
    const refreshAttempted = useRef(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    useEffect(() => {
        // Handle authentication for dashboard
        const handleDashboardAuth = async () => {
            // If already authenticated, we're good
            if (isAuthenticated) {
                setAuthChecked(true);
                
                // If on root dashboard path, redirect based on role
                if (pathname === '/dashboard' && !redirectAttempted.current && user) {
                    redirectAttempted.current = true;
                    
                    // Route based on user role
                    if (user.role === 'admin') {
                        router.replace('/dashboard/admin');
                    } else if (user.rolena === 'assistant') {
                        router.replace('/dashboard/assistant');
                    } else {
                        router.replace('/dashboard/hospital');
                    }
                }
                return;
            }
            
            // If still loading, wait
            if (loading) {
                return;
            }
            
            // If user explicitly logged out, redirect immediately
            if (typeof localStorage !== 'undefined' && localStorage.getItem('loggedOut') === 'true') {
                router.replace('/auth/login');
                return;
            }
            
            // If not authenticated and haven't tried refreshing yet
            if (!isAuthenticated && !refreshAttempted.current && !authChecked && !refreshing) {
                refreshAttempted.current = true;
                setRefreshing(true);
                
                try {
                    // Try to refresh the token (only once)
                    const refreshResult = await refreshAuthToken();
                    
                    // Mark auth as checked regardless of result
                    setAuthChecked(true);
                    setRefreshing(false);
                    
                    // If refresh failed, redirect to login only if we're still not authenticated
                    if (!refreshResult.success && !isAuthenticated) {
                        // Add a small delay before redirecting to allow any state updates to complete
                        setTimeout(() => {
                            if (!isAuthenticated) {
                                console.log("Token refresh failed, redirecting to login");
                                router.replace('/auth/login');
                            }
                        }, 100);
                    }
                } catch (error) {
                    console.error("Token refresh error:", error);
                    setAuthChecked(true);
                    setRefreshing(false);
                    
                    // Add a small delay before redirecting
                    setTimeout(() => {
                        if (!isAuthenticated) {
                            router.replace('/auth/login');
                        }
                    }, 100);
                }
            } else if (!isAuthenticated && authChecked && !refreshing) {
                // If we've already checked auth and it failed, redirect to login
                // But only if we're not currently refreshing
                router.replace('/auth/login');
            }
        };
        
        handleDashboardAuth();
    }, [loading, isAuthenticated, user, router, pathname, refreshAuthToken, authChecked, refreshing]);

    // Show loading state only during initial load or when refreshing
    if ((loading && !authChecked) || refreshing) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // Let the ProtectedRoute in child layouts handle auth redirects
    return (
        <>
            {/* Top dashboard navbar with logout */}
            {/* <DashboardNavbar /> */}
            <div className="min-h-screen bg-gray-50">
                {children}
            </div>
        </>
    );
}
