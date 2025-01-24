import React, { useState } from 'react';
import { Check, ArrowRight, Sparkles, Rocket, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: 'Perfect for small agencies just getting started with client reporting.',
    features: [
      'Up to 10 clients',
      '50 reports per month',
      '3 team members',
      'Basic report templates',
      'CSV data import',
      'Email support',
    ],
    highlight: false,
    cta: 'Start free trial',
  },
  {
    name: 'Professional',
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: 'Ideal for growing agencies with advanced reporting needs.',
    features: [
      'Up to 50 clients',
      'Unlimited reports',
      '10 team members',
      'Custom report templates',
      'API integrations',
      'Priority support',
      'White-label reports',
      'Custom branding',
    ],
    highlight: true,
    cta: 'Start free trial',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    monthlyPrice: 249,
    yearlyPrice: 199,
    description: 'For large agencies requiring maximum flexibility and support.',
    features: [
      'Unlimited clients',
      'Unlimited reports',
      'Unlimited team members',
      'Custom report builder',
      'Advanced integrations',
      'Dedicated support',
      'White-label portal',
      'Custom development',
      'SLA guarantee',
    ],
    highlight: false,
    cta: 'Contact sales',
  },
];

const features = [
  {
    icon: Rocket,
    title: 'AI-Powered Insights',
    description: 'Our advanced AI analyzes your data to provide actionable insights and recommendations.',
  },
  {
    icon: Sparkles,
    title: 'Beautiful Reports',
    description: 'Create stunning, professional reports that will impress your clients every time.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate comprehensive reports in seconds, not hours.',
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-[6.25rem]">
        {/* Hero Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark mb-6 tracking-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg sm:text-xl text-brand-dark/80 mb-8 max-w-2xl mx-auto">
              Choose the perfect plan for your agency. All plans include a 14-day free trial.
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm font-medium ${!isYearly ? 'text-brand-primary' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                style={{ backgroundColor: isYearly ? '#2E64A0' : '#E0E9F6' }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium flex items-center gap-2 ${isYearly ? 'text-brand-primary' : 'text-gray-500'}`}>
                Yearly
                <span className="inline-flex items-center gap-1 bg-brand-light/50 rounded-full px-2 py-1 text-brand-primary text-xs">
                  <Sparkles className="w-3 h-3" />
                  Save 20%
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border-2 flex flex-col ${
                    plan.highlight
                      ? 'border-brand-primary shadow-lg scale-105'
                      : 'border-gray-200'
                  } p-8 transition-all duration-300 hover:border-brand-primary hover:shadow-lg`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-brand-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-4">
                      <span className="text-4xl font-bold">${isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                      <span className="text-gray-500">/{isYearly ? 'month' : 'month'}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                  <button
                    onClick={() => navigate('/signup')}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      plan.highlight
                        ? 'bg-brand-primary text-white hover:bg-brand-primary-dark'
                        : 'bg-brand-light text-brand-primary hover:bg-brand-light/80'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-brand-dark/80 max-w-2xl mx-auto">
                Our platform provides all the tools and features you need to create impressive client reports.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <feature.icon className="w-12 h-12 mx-auto mb-6 text-brand-primary" />
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;