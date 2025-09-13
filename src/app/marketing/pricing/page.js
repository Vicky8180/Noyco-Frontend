"use client"
import React, { useState } from 'react';
import { Check, User, Star, Zap } from 'lucide-react';

const PricingPage = () => {
  const [individualBilling, setIndividualBilling] = useState('monthly');

  const individualPlans = {
    monthly: [
      {
        name: 'Lite Plan',
        subtitle: 'Individual',
        price: '$49',
        period: 'monthly',
        description: 'Standard features for individual healthcare providers',
        popular: false,
        features: [
          'Standard patient management',
          'Basic memory stack',
          'Standard API access',
          'Email support',
          'Up to 1 agent • gemini-1.5 model'
        ]
      },
      {
        name: 'Pro Plan',
        subtitle: 'Individual',
        price: '$99',
        period: 'monthly',
        description: 'Extra capacity for busy individual practitioners',
        popular: true,
        features: [
          'Basic patient management',
          'Limited memory stack',
          'Restricted API access',
          'Community support',
          'Up to 2 agents • gemini-1.5 model'
        ]
      }
    ],
    yearly: [
      {
        name: 'Lite Plan',
        subtitle: 'Individual',
        price: '$470.40',
        period: 'yearly',
        originalPrice: '$588',
        savings: '20%',
        description: 'Standard features for individual healthcare providers',
        popular: false,
        features: [
          'Standard patient management',
          'Basic memory stack',
          'Standard API access',
          'Email support',
          'Up to 1 agent • gemini-1.5 model'
        ]
      },
      {
        name: 'Pro Plan',
        subtitle: 'Individual',
        price: '$950.40',
        period: 'yearly',
        originalPrice: '$1,188',
        savings: '20%',
        description: 'Extra capacity for busy individual practitioners',
        popular: true,
        features: [
          'Basic patient management',
          'Limited memory stack',
          'Restricted API access',
          'Community support',
          'Up to 2 agents • gemini-1.5 model'
        ]
      }
    ]
  };

  const PlanCard = ({ plan }) => (
    <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
      plan.popular 
        ? 'border-blue-500 shadow-xl shadow-blue-100' 
        : 'border-gray-200 shadow-lg hover:border-blue-300'
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            Most Popular
          </div>
        </div>
      )}
      
      <div className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <p className="text-sm text-gray-500">({plan.subtitle})</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">{plan.description}</p>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
            <span className="text-gray-500">/ {plan.period}</span>
          </div>
          {plan.originalPrice && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                Save {plan.savings}
              </span>
            </div>
          )}
        </div>
        
        <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 mb-6 ${
          plan.popular
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 hover:border-gray-400'
        }`}>
          Choose {plan.name}
        </button>
        
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Individual Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tailored healthcare solutions for independent practitioners
          </p>
        </div>

        {/* Individual Plans */}
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <User className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Individual Plans</h2>
            </div>
            <p className="text-lg text-gray-600 mb-8">Perfect for independent healthcare providers</p>
            
            {/* Individual Billing Toggle */}
            <div className="flex justify-center">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setIndividualBilling('monthly')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      individualBilling === 'monthly'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIndividualBilling('yearly')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 relative ${
                      individualBilling === 'yearly'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Yearly
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {individualPlans[individualBilling].map((plan, index) => (
              <PlanCard key={index} plan={plan} />
            ))}
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">All Plans Include</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">HIPAA Compliant</p>
                  <p className="text-gray-600 text-sm">Full compliance with healthcare regulations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">24/7 Uptime</p>
                  <p className="text-gray-600 text-sm">Reliable service with 99.9% uptime guarantee</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Data Security</p>
                  <p className="text-gray-600 text-sm">Enterprise-grade encryption and security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PricingPage;
