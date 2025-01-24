import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, LogIn, ArrowLeft, Quote, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, signInWithGoogle, signInWithLinkedIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col pt-8 px-4 sm:px-6 lg:px-8 bg-white relative">
        <Link to="/" className="mb-12">
          <img 
            src="/srl-logo-black.svg"
            alt="Smart Report Lab"
            className="h-8"
          />
        </Link>
        <div className="flex-1 flex flex-col justify-center">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 flex items-center justify-center gap-3">
          Welcome back! <Sparkles className="w-6 h-6 text-brand-primary" />
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/signup"
            className="font-medium text-brand-primary hover:text-brand-primary-dark"
          >
            join our community of data wizards
          </Link>
        </p>

        <div className="mt-8 mx-auto w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  placeholder="you@company.com"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 sm:text-sm transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  placeholder="••••••••"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 sm:text-sm transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-lg border border-transparent bg-brand-primary py-3 px-4 text-base font-medium text-white shadow-md hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <LogIn className="h-4 w-4" />
                Let's get started
              </button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="gsi-material-button"
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">Sign in with Google</span>
                <span style={{ display: 'none' }}>Sign in with Google</span>
              </div>
            </button>

            <button
              type="button"
              onClick={signInWithLinkedIn}
              className="linkedin-button"
            >
              <div className="linkedin-button-content-wrapper">
                <div className="linkedin-button-icon">
                  <img src="/linkedin-logo-white.svg" alt="LinkedIn" className="w-5 h-5" />
                </div>
                <span>Sign in with LinkedIn</span>
              </div>
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              By signing in, you agree to our{' '}
              <a href="#" className="text-brand-primary hover:text-brand-primary-dark">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-brand-primary hover:text-brand-primary-dark">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
        </div>
      </div>
      
      {/* Right side - Quote */}
      <div className="hidden lg:flex lg:flex-1 bg-brand-primary">
        <div className="flex flex-col justify-center px-12 lg:px-16">
          <Quote className="w-12 h-12 text-brand-secondary mb-8" />
          <blockquote className="text-2xl font-medium text-white mb-6">
            "Marketing is no longer about the stuff that you make, but about the stories you tell. In today's digital age, the ability to measure and analyze these stories has become the cornerstone of successful marketing."
          </blockquote>
          <p className="text-brand-secondary font-medium">Seth Godin</p>
          <p className="text-brand-light/80">Marketing Author & Entrepreneur</p>
        </div>
      </div>
    </div>
  );
};

export default Login;