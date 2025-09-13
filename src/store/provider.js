'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { useRef, useEffect, useState } from 'react';
import { checkAuthStatus, refreshToken, resetAuthState } from './slices/authSlice';

export function ReduxProvider({ children }) {
  const initialized = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only check auth status once when the app initializes
    const initializeAuth = async () => {
      // Use localStorage to prevent multiple initializations across remounts
      const lastInitTime = localStorage.getItem('auth_last_init_time');
      const now = Date.now();
      const initCooldown = 2000; // 2 seconds cooldown
      
      if (lastInitTime && (now - parseInt(lastInitTime)) < initCooldown) {
        console.log("Auth initialization attempted too soon, using existing state");
        setIsReady(true);
        return;
      }
      
      if (!initialized.current) {
        // Skip auth initialization completely if user logged out
        if (localStorage.getItem('loggedOut') === 'true') {
          // Ensure store auth state is reset so loading=false
          store.dispatch(resetAuthState());
          setIsReady(true);
          return;
        }

        initialized.current = true;
        localStorage.setItem('auth_last_init_time', now.toString());
        
        try {
          // First try to check auth status
          try {
            await store.dispatch(checkAuthStatus()).unwrap();
            console.log("Auth check successful");
          } catch (error) {
            console.log("Auth check failed, trying to refresh token");
            
            // If auth check fails, try to refresh the token
            try {
              await store.dispatch(refreshToken()).unwrap();
              console.log("Token refresh successful");
            } catch (refreshError) {
              console.log("Token refresh failed, user needs to login");
              // Clear any stale auth data from localStorage
              localStorage.removeItem('lastRefreshAttempt');
              localStorage.removeItem('refreshCount');
            }
          }
        } catch (error) {
          // Auth check failed, but we still consider initialization complete
          console.log("Auth initialization completed with error");
        } finally {
          // Mark as ready regardless of outcome
          setIsReady(true);
        }
      }
    };

    initializeAuth();
  }, []);

  // Only render children after initialization
  if (!isReady) {
    return <div className="flex justify-center items-center h-screen">Initializing...</div>;
  }

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
} 