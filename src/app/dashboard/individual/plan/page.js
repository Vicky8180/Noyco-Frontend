

"use client";
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../../../../store/hooks';
import { apiRequest } from '../../../../lib/api';
import CheckoutButton from '@/stripe/components/CheckoutButton';
import SubscriptionManager from '@/stripe/components/SubscriptionManager';

export default function Plan() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load plans + current plan from /billing/plan
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      let current = null;

      // 1️⃣ Fetch current subscription, ignore 404
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
        // treat as no plan
        setShowPlans(true);
      }

      // 2️⃣ Fetch available plans always
      try {
        const resp = await apiRequest('/billing/plan');
        setPlans(resp.plans || []);

        if (current && current.status === 'active' && resp.plans) {
          const match = resp.plans.find(p => p.plan_type === current.plan_type);
          if (match) {
            setCurrentPlan(cp => cp ? { ...cp, details: match } : cp);
          }
        }
      } catch (err) {
        console.error('Error fetching available plans:', err);
        setError('Failed to load plans');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // POST to select an individual plan
  const selectPlan = async (planType) => {
    if (!user?.role_entity_id) return;
    setLoading(true);
    try {
      const resp = await apiRequest('/billing/plan/select', {
        method: 'POST',
        body: JSON.stringify({ plan_type: planType }),
      });
      setCurrentPlan({
        plan_type: resp.plan_type,
        details: resp.plan_details
      });
      setError('');
    } catch (err) {
      console.error('Error selecting plan:', err);
      setError('Failed to select plan');
    } finally {
      setLoading(false);
    }
  };

  const isActive = (type) => currentPlan?.plan_type === type;
  const calcSave = (m, y) =>
    Math.round(((m * 12 - y) / (m * 12)) * 100);

  // ------------------------------------------------------------------
  // Render subscription summary if already subscribed and not choosing new
  // ------------------------------------------------------------------
  if (currentPlan && !showPlans) {
    const { details } = currentPlan;
    return (
      <div className="bg-beige min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2 tracking-tight">
              Your Subscription
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
          </div>
          
          <div className="bg-beige border-accent-right border-accent-left border-accent-top border-accent shadow-lg p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]"></div>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {details?.name || currentPlan.plan_type?.toUpperCase()} Plan
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your subscription is active and ready to use
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 font-semibold shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm">
                  Active Subscription
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/50 p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Plan Type</div>
                <div className="text-lg font-semibold text-gray-900 capitalize">{currentPlan.plan_type}</div>
              </div>
              <div className="bg-white/50 p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className="text-lg font-semibold text-green-600">Active</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <SubscriptionManager className="w-full bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] hover:shadow-lg text-gray-800 font-semibold py-3 px-6 transition-all duration-200" />
              </div>
              <button
                onClick={() => setShowPlans(true)}
                className="flex-1 px-6 py-3 bg-beige border-accent-right border-accent-left border-accent-top border-accent text-gray-700 font-medium transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
              >
                Change Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-beige min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Select the perfect plan for your needs. All plans include our core features with flexible scaling options.
          </p>
          
          {currentPlan && (
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 font-semibold shadow-sm mt-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Currently on {currentPlan.details?.name || currentPlan.plan_type?.toUpperCase()} Plan
            </div>
          )}
          
          {error && (
            <div className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-100 text-red-800 rounded-full text-sm font-medium mt-4">
              {error}
            </div>
          )}
        </div>
              
        {/* Billing Toggle */}
        <div className="flex justify-center mb-10 ">
          <div className="bg-beige backdrop-blur-xl p-2 inline-flex  border-accent-right border-accent-left border-accent-top border-accent">
            {['monthly', 'yearly'].map(cycle => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-6 py-2  font-medium transition-all duration-300 ease-out ${
                  billingCycle === cycle
                    ? 'bg-gray-900 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Plan Grid */}
        <div className=" bg-beige grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto">
          {plans.map(plan => {
            // Price fields come from backend
            const price =
              billingCycle === 'monthly'
                ? plan.price_monthly
                : plan.price_yearly;
            const save = calcSave(plan.price_monthly, plan.price_yearly);
            const isCurrentPlan = isActive(plan.plan_type);
            const isRecommended = plan.plan_type === 'pro';

            return (
              <div
                key={plan.plan_type}
                className={`relative bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent rounded-none p-6 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl ${
                  isCurrentPlan
                    ? 'border-blue-500 shadow-xl ring-1 ring-blue-500/20'
                    : isRecommended
                    ? 'border-gray-200 shadow-xl'
                    : 'border-white/20 shadow-lg hover:border-gray-200'
                }`}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-4 py-1  text-sm font-medium shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center px-2 py-1 bg-green-50 border border-green-200 text-green-800 rounded-full text-xs font-medium">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                      Current
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
                    {plan.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-light text-gray-900 tracking-tight">
                      ${price}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {billingCycle === 'monthly' ? '/month' : '/year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && save > 0 && (
                    <div className="inline-flex items-center px-2 py-1 bg-green-50 border border-green-200 text-green-800 rounded-full text-xs font-medium">
                      Save {save}% annually
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-50 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Details */}
                <div className="mb-6 p-3 bg-beige   border-accent-right border-accent-left border-accent-top border-accent   border-gray-100 ">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Max Agents</span>
                    <span className="font-medium text-gray-900">{plan.max_agents}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Model Tier</span>
                    <span className="font-medium text-gray-900 capitalize">{plan.model_tier}</span>
                  </div>
                </div>

                {/* CTA Button */}
                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full py-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl font-medium  "
                  >
                    Current Plan
                  </button>
                ) : (
                  <div className="w-full ">
                    <CheckoutButton planType={plan.plan_type} billingCycle={billingCycle}>
                      <span className="font-medium">Get Started</span>
                    </CheckoutButton>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Subscription Management */}
        <div className="flex justify-center mt-12">
          <div className="bg-beige backdrop-blur-xl  border-white/20  p-4">
            <SubscriptionManager />
          </div>
        </div>
      </div>
    </div>
  );
}