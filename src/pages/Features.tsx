import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTA from '../components/CTA';
import { 
  Sparkles, 
  Rocket, 
  Zap, 
  FileText, 
  PaintBucket, 
  BarChart2, 
  Bot, 
  Palette, 
  Wand2,
  Users,
  Lock,
  Clock,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Analysis',
    description: 'Our advanced AI analyzes your marketing data to uncover insights and trends, providing actionable recommendations.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Choose from a variety of professionally designed templates that make your reports stand out.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Wand2,
    title: 'One-Click Generation',
    description: 'Transform your raw data into polished reports with a single click. No manual formatting required.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: PaintBucket,
    title: 'Custom Branding',
    description: "Add your agency's logo, colors, and styling to create consistent, branded reports.",
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: BarChart2,
    title: 'Interactive Charts',
    description: 'Create dynamic, interactive visualizations that bring your data to life.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with role-based access control and real-time collaboration.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Lock,
    title: 'Secure Sharing',
    description: 'Share reports securely with clients through encrypted links and granular permissions.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: Clock,
    title: 'Automated Scheduling',
    description: 'Schedule reports to be generated and sent automatically at specified intervals.',
    color: 'bg-indigo-50 text-indigo-600',
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-[6.25rem]">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-light/30 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-brand-primary mb-6">
                <Sparkles className="w-6 h-6" />
                <span className="text-lg font-medium">Powerful Features</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark mb-6 tracking-tight">
                Everything You Need to Create Amazing Reports
              </h1>
              <p className="text-lg sm:text-xl text-brand-dark/80 mb-8">
                Transform your marketing data into beautiful, insightful reports that will impress your clients and save you hours of work.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto bg-brand-primary text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:-translate-y-1 active:translate-y-0 hover:bg-brand-primary-dark"
                >
                  Get Started Free
                </button>
                <button 
                  onClick={() => navigate('/how-it-works')}
                  className="w-full sm:w-auto bg-brand-light text-brand-primary px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                >
                  See How It Works
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-brand-primary group"
                >
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-6">
                Connect Your Data Sources
              </h2>
              <p className="text-lg text-brand-dark/80">
                Import data from all your favorite marketing platforms and tools. Our integrations make it easy to consolidate your data in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-lg bg-white border border-gray-200 flex items-center justify-center p-4">
                  <div className="w-full h-4 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="text-brand-primary hover:text-brand-primary-dark font-medium inline-flex items-center gap-2">
                View all integrations
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-primary mb-2">1M+</div>
                <div className="text-gray-600">Reports Generated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-primary mb-2">10k+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-primary mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-primary mb-2">4.9/5</div>
                <div className="text-gray-600">Customer Rating</div>
              </div>
            </div>
          </div>
        </section>

        <CTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;