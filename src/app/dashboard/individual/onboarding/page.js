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
        if (data.onboarding_completed) {
          router.push('/dashboard/individual');
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
      // Create the user profile
      const result = await createProfile(profileData);
      
      if (result.success) {
        // Notify backend that onboarding completed
        try {
          await apiRequest('/auth/onboarding/complete', { method: 'POST' });
        } catch (e) {
          console.error('Failed to mark onboarding complete', e);
        }

        router.push('/dashboard/individual?onboarding=completed');
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
