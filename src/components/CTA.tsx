import React from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-brand-primary py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-dark/20 to-transparent"></div>
      <div className="container mx-auto px-2">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-8 text-brand-secondary" />
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-light mb-6">
            Ready to Transform Your Client Reporting?
          </h2>
          <p className="text-lg text-brand-light mb-8">
            Join thousands of marketing agencies who have streamlined their reporting process with Smart Report Lab.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-brand-secondary text-brand-primary px-8 py-3 rounded-lg text-lg font-semibold transition-transform duration-300 hover:-translate-y-1 active:scale-95"
            >
              Start Free Trial
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold transition-transform duration-300 hover:-translate-y-1 active:scale-95">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;