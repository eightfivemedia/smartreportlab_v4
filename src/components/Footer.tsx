import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-brand-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          {/* Brand Column */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <a href="/" className="block">
              <img src="/srl-logo-white.svg" alt="ReportAI Logo" className="h-8" />
            </a>
            <p className="text-sm">
              Transforming marketing data into actionable insights with AI-powered reporting.
            </p>
            <div className="flex space-x-5 justify-center md:justify-start">
              <a href="#" className="transition-transform hover:scale-110 hover:opacity-80">
                <img src="/facebook-logo-white.svg" alt="Facebook" className="h-5 w-5" />
              </a>
              <a href="#" className="transition-transform hover:scale-110 hover:opacity-80">
                <img src="/instagram-logo-white.svg" alt="Instagram" className="h-5 w-5" />
              </a>
              <a href="#" className="transition-transform hover:scale-110 hover:opacity-80">
                <img src="/linkedin-logo-white.svg" alt="LinkedIn" className="h-5 w-5" />
              </a>
              <a href="#" className="transition-transform hover:scale-110 hover:opacity-80">
                <img src="/x-logo-white.svg" alt="X" className="h-5 w-5" />
              </a>
              <a href="mailto:contact@reportai.com" className="transition-transform hover:scale-110 hover:opacity-80">
                <img src="/mail-icon.svg" alt="Email" className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <div className="relative mb-6">
              <h3 className="text-brand-white font-semibold mb-4">Product</h3>
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-secondary"></div>
            </div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <div className="relative mb-6">
              <h3 className="text-brand-white font-semibold mb-4">Company</h3>
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-secondary"></div>
            </div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-secondary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <div className="relative mb-6">
              <h3 className="text-brand-white font-semibold mb-4">Legal</h3>
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-secondary"></div>
            </div>
            <ul className="space-y-2">
              <li><a href="/privacy" className="hover:text-brand-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-brand-secondary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-brand-secondary transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-dark/30 pt-8">
          <p className="text-sm text-center">
            © {new Date().getFullYear()} Smart Report Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;