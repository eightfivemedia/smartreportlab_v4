import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { MessageSquare, Users, FileText, Phone, LayoutTemplate, Building2, Search, BarChart2, Clock, ArrowUpRight, PanelLeft } from 'lucide-react';

function Landing() {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-[6.25rem] pb-24">
        <div className="max-w-[95%] mx-auto">
          <div className="max-w-3xl mx-auto text-center pt-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark mb-6 tracking-tight">
              Transform Data
              <br />
              into Client-Ready Reports
            </h1>
            <p className="text-lg sm:text-xl text-brand-dark/80 mb-8 max-w-2xl mx-auto">
              Effortlessly convert your marketing data into professional, branded reports with AI-driven insights.
            </p>
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="max-w-[280px] w-full sm:w-auto gradient-primary text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Start for free →
              </button>
              <p className="text-sm text-brand-dark/60 mb-8">
                14-day free trial, no credit card required. Up and running in two minutes.
              </p>
            </div>
          </div>
          <div className="mt-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-350 ease-in-out hover:shadow-[0_0_30px_rgba(46,100,160,0.15)] hover:-translate-y-1">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
                {/* Sidebar */}
                <div className={`hidden md:block ${isSidebarCollapsed ? 'md:col-span-1' : 'md:col-span-2'} bg-brand-primary-dark text-white p-3 sm:p-4 transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center justify-center w-full">
                      <img
                        src={window.innerWidth < 768 ? "/srl-logo-white.svg" : (isSidebarCollapsed ? "/srl-logo-icon-white.svg" : "/srl-logo-white.svg")}
                        alt="Smart Report Lab Logo"
                        className={`h-8 sm:h-10 ${isSidebarCollapsed ? 'mx-auto' : ''}`}
                      />
                    </div>
                  </div>
                  <div className="flex md:block overflow-x-auto pb-2 md:pb-0 space-x-2 md:space-x-0 md:space-y-1 no-scrollbar">
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} gap-2 px-1 py-2 rounded-lg bg-white/10 text-white cursor-default flex-shrink-0`}>
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                      {!isSidebarCollapsed && <span className="whitespace-nowrap">Reports</span>}
                    </div>
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} gap-2 px-1 py-2 rounded-lg text-white/70 cursor-default flex-shrink-0`}>
                      <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                      {!isSidebarCollapsed && <span className="whitespace-nowrap">Clients</span>}
                    </div>
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} gap-2 px-1 py-2 rounded-lg text-white/70 cursor-default flex-shrink-0`}>
                      <LayoutTemplate className="w-6 h-6 sm:w-7 sm:h-7" />
                      {!isSidebarCollapsed && <span className="whitespace-nowrap">Templates</span>}
                    </div>
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} gap-2 px-1 py-2 rounded-lg text-white/70 cursor-default flex-shrink-0`}>
                      <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                      {!isSidebarCollapsed && <span className="whitespace-nowrap">Team Access</span>}
                    </div>
                  </div>
                </div>
                {/* Main Content */}
                <div className={`${isSidebarCollapsed ? 'md:col-span-11' : 'md:col-span-10'} bg-gray-50 transition-all duration-300`}>
                  {/* Content */}
                  <div className="p-4 lg:p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-500">Total Reports</span>
                          <BarChart2 className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">247</span>
                          <span className="text-green-500 text-sm flex items-center">
                            <ArrowUpRight className="w-4 h-4" />
                            12%
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-500">This Month</span>
                          <Clock className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">32</span>
                          <span className="text-green-500 text-sm flex items-center">
                            <ArrowUpRight className="w-4 h-4" />
                            8%
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-500">Team Members</span>
                          <Users className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold">8</span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-500">Templates</span>
                          <LayoutTemplate className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold">12</span>
                        </div>
                      </div>
                    </div>

                    {/* Upload Area */}
                    <div className="bg-white rounded-xl border border-gray-200 mb-8">
                      <div className="border-b border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold text-center sm:text-left">Create New Report</h2>
                        <button className="bg-brand-primary text-white px-4 py-2 rounded-lg">
                          New Report
                        </button>
                      </div>
                      <div className="p-6 text-center">
                        <div className="border-2 border-dashed rounded-lg p-8 border-gray-200">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
                          <h3 className="text-base sm:text-lg font-semibold mb-2">Drop your marketing data file here</h3>
                          <p className="text-gray-500 mb-4">or click to browse</p>
                          <p className="text-sm text-gray-400">Supports CSV and Excel files up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <CTA />
      <Footer />
    </div>
  );
}

export default Landing;