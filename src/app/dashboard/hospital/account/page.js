"use client"; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Bot, Sparkles, Check, Phone } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import CheckoutButton from '@/stripe/components/CheckoutButton';
import SubscriptionManager from '@/stripe/components/SubscriptionManager';
import { useAuth } from '@/store/hooks';
import ServicesManager from "@/components/ServicesManager";
import PhoneNumberGenerator from "@/components/PhoneNumberGenerator";

export default function HospitalAccountPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [availablePlans, setAvailablePlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const [showServicesManager, setShowServicesManager] = useState(false);
  const [showPhoneManager, setShowPhoneManager] = useState(false);
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);

  // Fetch current subscription and available plans
  useEffect(() => {
    async function loadData() {
      let current = null;

      // 1️⃣ Attempt to fetch current subscription – errors are non-fatal
      try {
        current = await apiRequest('/billing/plan/current', { suppressError: true });
        if (current && current.status === 'active') {
          setCurrentPlan({
            plan_type: current.plan_type,
            details: {
              name: current.plan_type?.toUpperCase(),
              description: `${current.plan_type} subscription`,
              ...current,
            },
          });
          setShowPlans(false);
        } else {
          setShowPlans(true);
        }
      } catch (_) {
        setShowPlans(true);
      }

      // 2️⃣ Fetch available plans (always)
      try {
        const response = await apiRequest('/billing/plan');
        if (response?.plans) {
          setAvailablePlans(response.plans);

          // enrich current subscription details
          if (current && current.status === 'active') {
            const match = response.plans.find(p => p.plan_type === current.plan_type);
            if (match) {
              setCurrentPlan(cp => cp ? { ...cp, details: match } : cp);
            }
          }
        }
      } catch (e) {
        console.error('Error fetching available plans:', e);
      }

      // 3️⃣ Check if hospital has a phone number
      if (user?.role_entity_id) {
        try {
          const phoneConfig = await apiRequest(`/phone/config/${user.role_entity_id}`, {
            suppressError: true
          });
          setHasPhoneNumber(!!phoneConfig?.twilio_config?.phone_number);
        } catch (e) {
          // Ignore 404 errors (no phone number yet)
          setHasPhoneNumber(false);
        }
      }
    }
    loadData();
  }, [user?.role_entity_id]);

  // POST selection to /billing/plan/select
  const handlePlanSelect = async (planType, planName) => {
    if (!user?.role_entity_id) {
      console.error("User or role_entity_id is missing");
      alert('Cannot select plan: user information is missing.');
      return;
    }
    
    try {
      const res = await apiRequest('/billing/plan/select', {
        method: 'POST',
        body: JSON.stringify({ plan_type: planType, id: user.role_entity_id }),
      });
      if (res?.id) {
        alert(`Plan switched to ${planName}!`);
        window.location.reload();
      }
    } catch (err) {
      console.error('Error switching plan:', err);
      alert('Failed to switch plan.');
    }
  };

  // ------------------------------------------------------------------
  // Show subscription summary when subscribed and not opting to change
  // ------------------------------------------------------------------
  if (currentPlan && !showPlans) {
    const { details } = currentPlan;
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-6">Your Subscription</h1>
        <div className="max-w-2xl mx-auto bg-white shadow rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">{details?.name}</h2>
          <p className="text-gray-600 mb-4">{details?.description}</p>
          <p className="text-sm text-gray-500 mb-4">Plan type: <strong>{currentPlan.plan_type}</strong></p>
          <div className="flex justify-center gap-4 mt-6">
            <SubscriptionManager className="flex-1" />
            <button
              onClick={() => setShowPlans(true)}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
            >
              Change Plan
            </button>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white shadow rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Service Management</h2>
              <p className="text-sm text-gray-500 mt-1">
                Customize your hospital's AI services based on your needs
              </p>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h3 className="text-base font-medium mb-1">Available Services</h3>
                <p className="text-sm text-gray-600">
                  {currentPlan.plan_type === 'lite' 
                    ? 'Your plan includes basic services and allows selection of 1 optional service' 
                    : 'Your plan includes all available services with premium support'}
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowServicesManager(true)}
                  className="w-full group relative overflow-hidden bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200/50 rounded-2xl px-6 py-4 transition-all duration-200 ease-out"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                      Manage Services
                    </span>
                    <ArrowRight className="ml-2 w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Widget Embed Section */}
        {(currentPlan.plan_type === 'lite' || currentPlan.plan_type === 'pro') && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white shadow rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold">Voice Widget Embed</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Generate and customise an embeddable iframe to add the Noyco Voice Assistant to your website.
                </p>
              </div>
              <div className="p-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-medium mb-1">Embed Assistant</h3>
                  <p className="text-sm text-gray-600">
                    Create a JavaScript snippet that injects a secure iframe powered by LiveKit and Gemini AI.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => router.push('/dashboard/hospital/iframe')}
                    className="w-full group relative overflow-hidden bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/50 rounded-2xl px-6 py-4 transition-all duration-200 ease-out"
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-base font-medium text-blue-700 group-hover:text-blue-900">
                        Generate & Customise Iframe
                      </span>
                      <ArrowRight className="ml-2 w-4 h-4 text-blue-500" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phone Number Management Section */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white shadow rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Phone Number Management</h2>
              <p className="text-sm text-gray-500 mt-1">
                Generate and manage your dedicated hospital phone number
              </p>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h3 className="text-base font-medium mb-1">Dedicated Phone Line</h3>
                <p className="text-sm text-gray-600">
                  {hasPhoneNumber 
                    ? 'Your hospital has a dedicated phone number for patient calls' 
                    : 'Generate a dedicated phone number to enable voice calling features'}
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowPhoneManager(true)}
                  className={`w-full group relative overflow-hidden ${
                    hasPhoneNumber 
                      ? 'bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200/50' 
                      : 'bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/50'
                  } rounded-2xl px-6 py-4 transition-all duration-200 ease-out`}
                >
                  <div className="flex items-center justify-center">
                    <Phone className={`mr-2 w-4 h-4 ${hasPhoneNumber ? 'text-gray-400' : 'text-blue-500'}`} />
                    <span className={`text-base font-medium ${
                      hasPhoneNumber ? 'text-gray-700 group-hover:text-gray-900' : 'text-blue-700 group-hover:text-blue-900'
                    }`}>
                      {hasPhoneNumber ? 'Manage Phone Number' : 'Generate Phone Number'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {showServicesManager && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <ServicesManager
              hospitalId={user?.role_entity_id}
              planType={currentPlan.plan_type}
              onClose={() => {
                setShowServicesManager(false);
                window.location.reload();
              }}
            />
          </div>
        )}

        {showPhoneManager && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <PhoneNumberGenerator
              hospitalId={user?.role_entity_id}
              onClose={() => {
                setShowPhoneManager(false);
                window.location.reload();
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Billing Toggle */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">
            Healthcare AI Solutions
                  </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Choose your plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Simple pricing that grows with your practice. No hidden fees.
          </p>
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-white/50">
          {['monthly', 'yearly'].map(cycle => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === cycle
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Cards */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
      <div className="flex flex-wrap justify-center gap-6">

        {availablePlans.map(plan => (
          <div
            key={plan.plan_type}
            onMouseEnter={() => setHoveredPlan(plan.plan_type)}
            onMouseLeave={() => setHoveredPlan(null)}
            className={`relative bg-white rounded-2xl shadow-lg border transition-transform ${
              hoveredPlan === plan.plan_type ? 'scale-105' : ''
            }`}
          >
            {plan.is_recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
                    </div>
                  )}
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 mx-auto">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>

              {/* Features */}
              <ul className="text-left mb-6 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Pricing values fetched from backend */}
              <div className="text-3xl font-bold mb-4">
                ${billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly}
                <span className="text-base text-gray-500"> / {billingCycle}</span>
              </div>

                <CheckoutButton planType={plan.plan_type} billingCycle={billingCycle}>
                  Choose {plan.name} <ArrowRight className="ml-2 w-4 h-4" />
                </CheckoutButton>
            </div>
          </div>
        ))}
        </div>
      {/* Manage subscription button */}
      <div className="flex justify-center mt-10">
        <SubscriptionManager />
      </div>
    </div>
  );
}