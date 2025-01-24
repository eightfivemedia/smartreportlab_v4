import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, UserPlus, ArrowLeft, Sparkles, Rocket, Zap, BarChart2, Users, FileText, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, signInWithGoogle, signInWithLinkedIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-brand-light/5 to-brand-secondary/10 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col pt-8 px-4 sm:px-6 lg:px-8 relative">
        <Link to="/" className="mb-12">
          <img
            src="/srl-logo-black.svg"
            alt="Smart Report Lab"
            className="h-8"
          />
        </Link>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 flex items-center justify-center gap-3">
            Join the revolution <Sparkles className="w-6 h-6 text-brand-primary" />
          </h2>
          <p className="mt-3 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-brand-primary hover:text-brand-primary-dark"
            >
              already part of our community?
            </Link>
          </p>

          <div className="mt-8 mx-auto w-full max-w-md">
            <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  placeholder="Jane Smith"
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 sm:text-sm transition-all duration-200"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
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
                <UserPlus className="h-4 w-4" />
                Start your journey
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
                <span className="gsi-material-button-contents">Sign up with Google</span>
                <span style={{ display: 'none' }}>Sign up with Google</span>
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
                <span>Sign up with LinkedIn</span>
              </div>
            </button>

          </form>
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Rocket className="w-4 h-4" />
              <span>Join our community of data wizards</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Right side - Dashboard Preview */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-brand-light/20">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <div className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400">
                Search reports...
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm">Total Reports</span>
                  <BarChart2 className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-2xl font-bold">247</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm">Team Members</span>
                  <Users className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-2xl font-bold">8</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm">Active Clients</span>
                  <FileText className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-2xl font-bold">12</span>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-semibold">Recent Reports</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-brand-primary" />
                      <div>
                        <h4 className="font-medium">Q{4-i} Marketing Report</h4>
                        <p className="text-sm text-gray-500">Generated {i === 1 ? 'today' : `${i} days ago`}</p>
                      </div>
                    </div>
                    <div className="text-sm text-brand-primary">View</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;