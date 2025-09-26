"use client";

import { useState, useEffect } from "react";
import { useAuth, useAgentProfile } from "@/store/hooks";
import { useRouter } from "next/navigation";
import OnboardingFlow from "./components/OnboardingFlow";
import { apiRequest } from "@/lib/api";

export default function OnboardingPage() {
  const { user } = useAuth();
  const { createProfile } = useAgentProfile();
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  // Check with backend if onboarding already done
  useEffect(() => {
    const checkStatus = async () => {
      if (!user?.role_entity_id) return;
      try {
        const data = await apiRequest('/auth/onboarding/status');
        console.log('Onboarding page - checking status:', data);
        if (data.onboarding_completed) {
          console.log('Onboarding already completed, redirecting to dashboard');
          router.replace('/dashboard/individual?onboarding=completed');
        }
      } catch (e) {
        console.error('Failed to fetch onboarding status', e);
      }
    };
    checkStatus();
  }, [user?.role_entity_id, router]);

  const handleOnboardingComplete = async (profileData) => {
    setIsCompleting(true);
    
    try {
      console.log('Starting onboarding completion process...');
      
      // Create the user profile
      const result = await createProfile(profileData);
      
      if (result.success) {
        console.log('Profile created successfully:', result.data);
        
        // The backend now automatically marks onboarding as completed when profile is created
        // But let's also try the explicit endpoint as a backup
        try {
          await apiRequest('/auth/onboarding/complete', { method: 'POST' });
          console.log('Explicitly marked onboarding as complete');
        } catch (e) {
          console.warn('Failed to explicitly mark onboarding complete (profile creation should have done this):', e);
        }

        console.log('Redirecting to dashboard with completion flag...');
        router.replace('/dashboard/individual?onboarding=completed');
      } else {
        console.error('Failed to create profile:', result.error);
        alert('Failed to save your profile. Please try again.');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('An error occurred while saving your profile. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        isCompleting={isCompleting}
        user={user}
      />
    </div>
  );
}
