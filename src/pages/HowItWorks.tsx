import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTA from '../components/CTA';
import { 
  FileUp, 
  Wand2, 
  Share2, 
  Sparkles,
  ArrowRight,
  FileText,
  Bot,
  Send,
  CheckCircle,
  ArrowDown
} from 'lucide-react';

const steps = [
  {
    icon: FileUp,
    title: 'Upload Your Data',
    description: 'Simply upload your marketing data in CSV or Excel format. We support data from all major marketing platforms.',
  },
  {
    icon: Bot,
    title: 'AI Analysis',
    description: 'Our AI analyzes your data to identify trends, patterns, and actionable insights automatically.',
  },
  {
    icon: Wand2,
    title: 'Generate Report',
    description: 'Choose from beautiful templates and customize the design to match your brand. One click generates your report.',
  },
  {
    icon: Send,
    title: 'Share with Clients',
    description: 'Share reports securely with your clients via email or custom branded portal.',
  },
];

const features = [
  {
    title: 'Data Processing',
    items: [
      'Automatic data cleaning',
      'Format standardization',
      'Error detection',
      'Missing data handling',
    ],
  },
  {
    title: 'AI Analysis',
    items: [
      'Trend identification',
      'Anomaly detection',
      'Performance insights',
      'Recommendations',
    ],
  },
  {
    title: 'Report Generation',
    items: [
      'Custom templates',
      'Brand customization',
      'Interactive charts',
      'Multiple formats',
    ],
  },
  {
    title: 'Sharing & Collaboration',
    items: [
      'Secure sharing',
      'Client portal',
      'Team collaboration',
      'Access controls',
    ],
  },
];

const HowItWorks = () => {
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
                <span className="text-lg font-medium">Simple Process</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark mb-6 tracking-tight">
                How Smart Report Lab Works
              </h1>
              <p className="text-lg sm:text-xl text-brand-dark/80 mb-8">
                Transform your marketing data into beautiful reports in minutes, not hours. Our simple process makes it easy.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto bg-brand-primary text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:-translate-y-1 active:translate-y-0 hover:bg-brand-primary-dark"
                >
                  Start Free Trial
                </button>
                <button 
                  onClick={() => navigate('/features')}
                  className="w-full sm:w-auto bg-brand-light text-brand-primary px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                >
                  View Features
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-brand-primary group">
                    <div className="w-12 h-12 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-brand-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-6">
                What Happens Behind the Scenes
              </h2>
              <p className="text-lg text-brand-dark/80">
                Our platform handles all the complex processing to deliver perfect reports every time.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <ul className="space-y-3">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-6">
                See It in Action
              </h2>
              <p className="text-lg text-brand-dark/80 mb-8">
                Watch how easy it is to create beautiful reports with Smart Report Lab.
              </p>
              <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Demo video coming soon</p>
                </div>
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

export default HowItWorks;