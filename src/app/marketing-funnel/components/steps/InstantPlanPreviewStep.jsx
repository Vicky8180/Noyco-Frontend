"use client";

import { useMarketingFunnel } from '../../context/MarketingFunnelContext';
import { useRouter } from 'next/navigation';

const InstantPlanPreviewStep = () => {
  const { data, actions } = useMarketingFunnel();
  const router = useRouter();

  const keepPlan = () => {
    router.push('/auth/signup');
  };

  const editDetails = () => {
    actions.previousStep();
  };

  const looksGood = () => {
    
    keepPlan();
  };

  const anchors = (data.copingAnchors || []).slice(0, 2).join(', ') || 'Music, Walk';
  const language = 'Hinglish';
  const voice = 'Female';
  const checkinTime = '7pm';

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">Here's your starter plan:</h2>
        <p className="text-gray-500 leading-relaxed">
          Personalized based on everything you've shared
        </p>
      </div>

      {/* Image placeholder */}
      {/* <div className="flex justify-center my-8">
        <div className="w-80 h-80 flex items-center justify-center">
        </div>
      </div> */}

      {/* Plan Preview Cards */}
      <div className="space-y-4 text-left">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">2-min Reset</h3>
          <p className="text-gray-600 text-sm">your anchors: {anchors}</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">5-min Evening Wind-down</h3>
          <p className="text-gray-600 text-sm">language: {language}, voice: {voice}</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-ins</h3>
          <p className="text-gray-600 text-sm">Quick nudges at {checkinTime} on WhatsApp</p>
        </div>
      </div>

      {/* First CTA buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={editDetails}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
        >
          Edit details
        </button>
        
        <button
          onClick={looksGood}
          className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-8 py-3 rounded-none hover:shadow-lg transition-all duration-200 text-sm font-semibold"
        >
          Looks good
        </button>
      </div>

      {/* Soft Wall → Create Account */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Keep this plan (free)</h3>
        
        {/* Auth options */}
        <div className="space-y-3 mb-4">
          <button 
            onClick={() => router.push('/auth/signup')}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            📱 Phone (OTP)
          </button>
         
          <button 
            onClick={() => router.push('/auth/signup')}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            📧 Google
          </button>
          <button 
            onClick={() => router.push('/auth/signup')}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ✉️ Email
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">~10 seconds. Delete anytime.</p>
      </div>

      {/* Value & CTA (ethical, simple) */}
      <div className="space-y-4 mt-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Free</h4>
          <p className="text-gray-600 text-sm">3 voice sessions/day, basic nudges</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Pro (7-day free)</h4>
          <p className="text-gray-600 text-sm">Unlimited voice, guided audios, custom schedules, priority support</p>
        </div>
        
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={() => router.push('/stripe/success')}
            className="bg-black text-white px-8 py-3 rounded-none font-semibold text-sm hover:shadow-lg transition-all duration-200"
          >
            Start Pro Free — ₹0 today
          </button>
          <button 
            onClick={() => router.push('/auth/signup')} 
            className="text-gray-600 text-sm hover:text-gray-800 underline"
          >
            Stay on Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstantPlanPreviewStep;


