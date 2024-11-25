import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { stripePromise } from '../lib/stripe';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId: user.id,
        }),
      });

      const { sessionId } = await response.json();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe error:', error);
      }
    } catch (err) {
      console.error('Subscription error:', err);
    }
  };

  const plans = [
    {
      name: 'Basic',
      price: isAnnual ? '990' : '99',
      period: isAnnual ? 'per year' : 'per month',
      priceId: isAnnual ? 'price_basic_yearly' : 'price_basic_monthly',
      features: [
        'CSV data import/export',
        'Basic bidding parameters',
        'Access to BidBuddy AI',
        'Up to 100 vehicle analyses per month',
        'Basic profit calculator',
        'Email support',
      ],
      notIncluded: [
        'Chrome extension for instant valuations',
        'Advanced bidding strategies',
        'Unlimited vehicle analyses',
        'Priority support',
        'Custom integrations',
        'AI Vehicle Analysis & Condition Prediction',
        'AI Market Trend Prediction & Forecasting',
      ],
    },
    {
      name: 'Pro',
      popular: true,
      price: isAnnual ? '1490' : '149',
      period: isAnnual ? 'per year' : 'per month',
      priceId: isAnnual ? 'price_pro_yearly' : 'price_pro_monthly',
      features: [
        'All Basic features',
        'Chrome extension for instant valuations',
        'Unlimited vehicle analyses',
        'Advanced profit calculator',
        'Custom bidding parameters',
        'Real-time market insights',
        'Advanced bidding strategies',
        'Priority email and chat support',
        'Basic API access',
      ],
      notIncluded: [
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager',
        'AI Vehicle Analysis & Condition Prediction',
        'AI Market Trend Prediction & Forecasting',
      ],
    },
    {
      name: 'Enterprise',
      price: isAnnual ? '5990' : '599',
      period: isAnnual ? 'per year' : 'per month',
      priceId: isAnnual ? 'price_enterprise_yearly' : 'price_enterprise_monthly',
      features: [
        'AI Vehicle Analysis & Condition Prediction',
        'AI Market Trend Prediction & Forecasting',
        'All Pro features',
        'White-label solution',
        'Unlimited vehicle analyses',
        'Custom integrations',
        'Custom API development',
        'Dedicated account manager',
        'On-site training',
        '24/7 Priority support',
        'Full API access',
      ],
      notIncluded: [],
    },
  ];

  const CheckIcon = () => (
    <Check className="text-green-500 mr-2 flex-shrink-0" size={20} strokeWidth={3} />
  );

  const XIcon = () => (
    <X className="text-red-500 mr-2 flex-shrink-0" size={20} strokeWidth={3} />
  );

  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-900 min-h-screen text-white">
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Choose Your BidBuddy Plan</h1>
        <p className="text-xl text-center mb-8">Supercharge your car bidding with AI-powered insights</p>
        
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 p-1 rounded-full">
            <button
              className={`px-6 py-2 rounded-full ${!isAnnual ? 'bg-blue-600' : 'text-gray-300'}`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-full ${isAnnual ? 'bg-blue-600' : 'text-gray-300'}`}
              onClick={() => setIsAnnual(true)}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-gray-800 rounded-lg p-8 shadow-lg relative ${
                plan.popular ? 'border-2 border-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <div className="text-4xl font-bold mb-2">£{plan.price}</div>
              <div className="text-gray-400 mb-6">{plan.period}</div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckIcon />
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <li key={i} className="flex items-start text-gray-500">
                    <XIcon />
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSubscribe(plan.priceId)}
                className={`w-full ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white font-bold py-3 px-4 rounded transition duration-300`}
              >
                {plan.name === 'Enterprise' ? 'Contact Us' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose BidBuddy?</h2>
          <p className="text-xl mb-8">BidBuddy uses advanced AI to help you make smarter bidding decisions and maximize your profits.</p>
          <ul className="text-left max-w-2xl mx-auto space-y-4">
            <li className="flex items-start">
              <CheckIcon />
              <span>Instant vehicle valuations with our Chrome extension</span>
            </li>
            <li className="flex items-start">
              <CheckIcon />
              <span>AI-powered profit optimization and risk assessment</span>
            </li>
            <li className="flex items-start">
              <CheckIcon />
              <span>Comprehensive bidding strategy management</span>
            </li>
            <li className="flex items-start">
              <CheckIcon />
              <span>Real-time market data and competitor analysis</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;