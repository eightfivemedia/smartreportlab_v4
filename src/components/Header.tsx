import React from 'react';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full bg-white z-50 transition-shadow duration-200 ${
      isScrolled ? 'shadow-md' : ''
    } h-[6.25rem]`}>
      <nav className="max-w-[95%] mx-auto h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <img
                src="/srl-logo-black.svg"
                alt="Smart Report Lab Logo"
                className="hidden md:block h-9"
              />
              <img
                src="/srl-logo-black.svg"
                alt="Smart Report Lab Logo"
                className="block md:hidden h-9"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-brand-dark/70 hover:text-brand-primary transition-colors">Home</a>
            <a href="/features" className="text-brand-dark/70 hover:text-brand-primary transition-colors">Features</a>
            <a href="/how-it-works" className="text-brand-dark/70 hover:text-brand-primary transition-colors">How it Works</a>
            <a href="/pricing" className="text-brand-dark/70 hover:text-brand-primary transition-colors">Pricing</a>
            {isLoggedIn ? (
              <a href="/dashboard" className="bg-brand-light text-brand-primary px-4 py-2 rounded-full btn-secondary">
                Open App
              </a>
            ) : (
              <div className="flex items-center gap-4">
                <a href="/login" className="text-brand-dark/70 hover:text-brand-primary transition-colors">
                  Log in
                </a>
                <a href="/signup" className="bg-brand-light text-brand-primary hover:bg-brand-secondary/50 px-4 py-2 rounded-full transition-colors duration-500">
                  Sign up
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-brand-dark hover:text-brand-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-[6.25rem] left-0 right-0 bg-white border-b border-brand-light py-4">
            <div className="flex flex-col space-y-4 px-2">
              <a href="/" className="text-brand-dark/70 hover:text-brand-primary transition-colors">Home</a>
              <a href="/features" className="text-brand-dark/70 hover:text-brand-primary transition-colors">Features</a>
              <a href="/how-it-works" className="text-brand-dark/70 hover:text-brand-primary transition-colors">How it Works</a>
              <a href="/pricing" className="text-brand-dark/70 hover:text-brand-primary transition-colors">Pricing</a>
              {isLoggedIn ? (
                <a href="/dashboard" className="bg-brand-light text-brand-primary px-4 py-2 rounded-full text-center btn-secondary">
                  Open App
                </a>
              ) : (
                <>
                  <a href="/login" className="text-brand-dark/70 hover:text-brand-primary transition-colors">
                    Log in
                  </a>
                  <a href="/signup" className="bg-brand-light text-brand-primary hover:bg-brand-secondary/.05 px-4 py-2 rounded-full text-center transition-colors duration-500">
                    Sign up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;