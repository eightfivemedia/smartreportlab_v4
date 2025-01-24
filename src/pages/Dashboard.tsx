import React from 'react';
import { FileText, BarChart2, Clock, Users, Phone, ArrowUpRight, Building2, LayoutTemplate, UserPlus, Rocket, Lock, LayoutGrid, List, Search, SlidersHorizontal, X, ExternalLink, Mail, Calendar, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import FileUpload from '../components/FileUpload';
import AccountPopup from '../components/AccountPopup';
import ReportClientPopup from '../components/ReportClientPopup';
import { supabase } from '../lib/supabase';
import { useEffect, useState, useMemo } from 'react';
import { useClients } from '../context/ClientContext';
import { useAuth } from '../context/AuthContext';

interface ReportStats {
  totalReports: number;
  monthlyReports: number;
  monthlyGrowth: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clients, loading: clientsLoading } = useClients();
  const { user } = useAuth();
  
  const userInitials = useMemo(() => {
    if (!user?.full_name) return 'U';
    return user.full_name.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }, [user?.full_name]);
  const [reportStats, setReportStats] = useState<ReportStats>({
    totalReports: 0,
    monthlyReports: 0,
    monthlyGrowth: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        // Get total reports count
        const { count: totalReports } = await supabase
          .from('clients')
          .select('reports_count', { count: 'exact' });

        // Get this month's reports
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: monthlyReports } = await supabase
          .from('clients')
          .select('last_report_date', { count: 'exact' })
          .gte('last_report_date', startOfMonth.toISOString());

        // Calculate growth (mock data for now since we don't have historical data)
        const monthlyGrowth = 12; // This would normally be calculated from historical data

        setReportStats({
          totalReports: totalReports || 0,
          monthlyReports: monthlyReports || 0,
          monthlyGrowth
        });
      } catch (error) {
        console.error('Error fetching report stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchReportStats();
  }, []);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'reports');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'email' | 'address' | 'reports_count' | 'status';
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showClientPopup, setShowClientPopup] = useState(false);
  const [reports, setReports] = useState<Array<{
    id: string;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    file_url: string | null;
    created_at: string;
    client: { name: string } | null;
  }>>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select(`
            id,
            name,
            status,
            file_url,
            created_at,
            client:clients(name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setReports(data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, []);

  // Set up polling for pending reports
  useEffect(() => {
    const pendingReports = reports.filter(r => r.status === 'pending' || r.status === 'processing');
    
    if (pendingReports.length > 0) {
      // Start polling if there are pending reports
      const interval = setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('reports')
            .select(`
              id,
              name,
              status,
              file_url,
              created_at,
              client:clients(name)
            `)
            .order('created_at', { ascending: false })
            .limit(5);

          if (error) throw error;
          setReports(data || []);

          // Stop polling if no more pending reports
          if (!data?.some(r => r.status === 'pending' || r.status === 'processing')) {
            if (pollingInterval) {
              clearInterval(pollingInterval);
              setPollingInterval(null);
            }
          }
        } catch (error) {
          console.error('Error polling reports:', error);
        }
      }, 5000); // Poll every 5 seconds

      setPollingInterval(interval);
      return () => clearInterval(interval);
    } else if (pollingInterval) {
      // Clear polling if no pending reports
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [reports]);
  const clearFilters = () => {
    setSearchQuery('');
    setSortConfig({ key: 'name', direction: 'asc' });
    setFilterStatus('all');
  };

  const handleSort = (key: typeof sortConfig.key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredClients = clients
    ?.filter(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === 'all' || client.status === filterStatus)
    )
    .sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      switch (sortConfig.key) {
        case 'name':
          return direction * a.name.localeCompare(b.name);
        case 'email':
          return direction * a.email.localeCompare(b.email);
        case 'address':
          return direction * a.address.localeCompare(b.address);
        case 'reports_count':
          return direction * (a.reports_count - b.reports_count);
        case 'status':
          return direction * a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleClientSelect = async (clientId: string) => {
    if (!selectedFile) return;
    
    // Refresh reports list after a short delay to allow for processing
    setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select(`
            id,
            name,
            status,
            file_url,
            created_at,
            client:clients(name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setReports(data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    }, 1000);

    // Close the popup
    setShowClientPopup(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className={`hidden md:block ${isSidebarCollapsed ? 'w-20' : 'w-64'} h-screen bg-brand-primary-dark flex-shrink-0 transition-all duration-300 relative`}>
          <div className="flex items-center justify-between p-4 mb-8">
            <div className="flex items-center w-full">
              <img
                src={isSidebarCollapsed ? '/srl-logo-icon-white.svg' : '/srl-logo-white.svg'}
                alt="Smart Report Lab Logo"
                className={`${isSidebarCollapsed ? 'h-8 mx-auto' : 'h-9'}`}
              />
            </div>
          </div>
          <nav className="flex flex-col space-y-1 px-3">
            <div
              onClick={() => setActiveTab('reports')}
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                activeTab === 'reports' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="ml-2">Reports</span>}
            </div>
            <div
              onClick={() => setActiveTab('clients')}
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                activeTab === 'clients' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Building2 className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="ml-2">Clients</span>}
            </div>
            <div
              onClick={() => setActiveTab('templates')}
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                activeTab === 'templates' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="ml-2">Templates</span>}
            </div>
            <div
              onClick={() => setActiveTab('team')}
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${
                activeTab === 'team' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="ml-2">Team Access</span>}
            </div>
          </nav>
          
          {/* User Account - Bottom */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className={`relative flex items-center ${isSidebarCollapsed ? 'justify-center p-2 rounded-full' : 'px-3 py-2 rounded-lg'} gap-2 hover:bg-white/5 cursor-pointer text-white/70 hover:text-white group`}
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/90 text-brand-primary-dark flex items-center justify-center text-sm font-medium">
                  {userInitials}
                </div>
              )}
              {!isSidebarCollapsed && <span>Account Settings</span>}
            </div>
            {isAccountOpen && (
              <AccountPopup
                isOpen={isAccountOpen}
                onClose={() => setIsAccountOpen(false)}
                userInitials={userInitials}
                userImage={user?.avatar_url}
                isSidebarCollapsed={isSidebarCollapsed}
                isMobile={window.innerWidth < 768}
              />
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <DashboardHeader
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            isScrolled={isScrolled}
          />

          {/* Content Area */}
          <div className="p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
            {activeTab === 'reports' && (
              <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Total Reports</span>
                  <BarChart2 className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex items-baseline gap-3">
                  {loadingStats ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                  ) : (
                    <span className="text-2xl font-bold">0</span>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>No change</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">This Month</span>
                  <Clock className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex items-baseline gap-3">
                  {loadingStats ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                  ) : (
                    <span className="text-2xl font-bold">0</span>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>No change</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Team Members</span>
                  <Users className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold">0</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>Coming soon</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Active Clients</span>
                  <Building2 className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold">
                    {clientsLoading ? (
                      <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                    ) : (
                      clients.filter(client => client.status === 'active').length
                    )}
                  </span>
                  {!clientsLoading && clients.length > 0 && (
                    <div className="flex items-center gap-1 text-sm text-green-500">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>New</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-xl border border-gray-200 mb-8">
              <div className="border-b border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">Create New Report</h2>
                <button 
                  onClick={() => {
                    if (selectedFile) {
                      setShowClientPopup(true);
                    }
                  }}
                  disabled={!selectedFile}
                  className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  New Report
                </button>
              </div>
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClearFile={handleClearFile}
              />
            </div>
            
            {/* Client Selection Popup */}
            <ReportClientPopup
              isOpen={showClientPopup}
              onClose={() => {
                setShowClientPopup(false);
                setSelectedFile(null);
              }}
              onClientSelect={handleClientSelect}
              selectedFile={selectedFile}
            />

            {/* Recent Reports */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold">Recent Reports</h2>
              </div>
              {loadingReports ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary mx-auto"></div>
                </div>
              ) : reports.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                  <p className="text-gray-500">Start by creating your first report</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <div key={report.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className={`w-5 h-5 ${
                            report.status === 'completed' ? 'text-brand-primary' : 'text-gray-400'
                          }`} />
                          <div>
                            <h4 className="font-medium">{report.name}</h4>
                            <p className="text-sm text-gray-500">
                              {report.client?.name} • {new Date(report.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : report.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : report.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                          {report.status === 'completed' && report.file_url && (
                            <a
                              href={report.file_url}
                             className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors"
                              download
                            >
                             <FileText className="w-4 h-4" />
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
              </>
            )}

            {activeTab === 'clients' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold">Clients</h2>
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded ${
                          viewMode === 'grid'
                            ? 'bg-white shadow text-brand-primary'
                            : 'text-gray-500 hover:text-brand-primary'
                        }`}
                      >
                        <LayoutGrid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded ${
                          viewMode === 'list'
                            ? 'bg-white shadow text-brand-primary'
                            : 'text-gray-500 hover:text-brand-primary'
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/dashboard/clients/new')}
                    className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-dark transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Client
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 ${
                        showFilters ? 'bg-brand-light text-brand-primary' : 'hover:bg-gray-50'
                      }`}
                    >
                      <SlidersHorizontal className="w-5 h-5" /> 
                      Filters
                    </button>
                  </div>
                  
                  {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-700">Filters</h3>
                        <button
                          onClick={clearFilters}
                          className="text-sm text-gray-500 hover:text-brand-primary flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Clear filters
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                          >
                            <option value="name">Name</option>
                            <option value="reports">Number of Reports</option>
                            <option value="lastReport">Last Report Date</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                          >
                            <option value="all">All Clients</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClients.map((client, index) => (
                    <div 
                      key={index} 
                      onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-2 hover:text-brand-primary">
                            {client.name}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Reports: {client.reports_count}</p>
                            <p className="text-sm text-gray-500">
                              Last report: {client.last_report_date 
                                ? new Date(client.last_report_date).toLocaleDateString()
                                : 'No reports yet'}
                            </p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              client.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {client.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="text-brand-primary hover:text-brand-primary-dark">
                          <FileText className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                    {clients.length === 0 ? ( 
                      <div className="p-12 text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                        <p className="text-gray-500 mb-4">Get started by adding your first client</p>
                        <button
                          onClick={() => navigate('/dashboard/clients/new')}
                          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-dark"
                        >
                          <UserPlus className="w-5 h-5" />
                          Add Client
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="min-w-[1000px]">
                          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
                            <div className="grid grid-cols-[2fr,2fr,2fr,1fr,1fr]">
                              <button
                                onClick={() => handleSort('name')}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-primary text-left p-3 border-r border-gray-200 bg-gray-100"
                              >
                                Client
                                <span className="flex flex-col">
                                  <ChevronUp className={`w-3 h-3 ${
                                    sortConfig.key === 'name' && sortConfig.direction === 'asc' 
                                      ? 'text-brand-primary' 
                                      : 'text-gray-400'
                                  }`} />
                                  <ChevronDown className={`w-3 h-3 -mt-1 ${
                                    sortConfig.key === 'name' && sortConfig.direction === 'desc'
                                      ? 'text-brand-primary'
                                      : 'text-gray-400'
                                  }`} />
                                </span>
                              </button>
                              <button
                                onClick={() => handleSort('email')}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-primary text-left p-3 border-r border-gray-200 bg-gray-100"
                              >
                                Email
                                <span className="flex flex-col">
                                  <ChevronUp className={`w-3 h-3 ${
                                    sortConfig.key === 'email' && sortConfig.direction === 'asc'
                                      ? 'text-brand-primary'
                                      : 'text-gray-400'
                                  }`} />
                                  <ChevronDown className={`w-3 h-3 -mt-1 ${
                                    sortConfig.key === 'email' && sortConfig.direction === 'desc'
                                      ? 'text-brand-primary'
                                      : 'text-gray-400'
                                  }`} />
                                </span>
                              </button>
                              <button
                                onClick={() => handleSort('address')}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-primary text-left p-3 border-r border-gray-200 bg-gray-100"
                              >
                                Address
                                <span className="flex flex-col">
                                  <ChevronUp className={`w-3 h-3 ${
                                    sortConfig.key === 'address' && sortConfig.direction === 'asc'
                                      ? 'text-brand-primary'
                                      : 'text-gray-400'
                                  }`} />
                                  <ChevronDown className={`w-3 h-3 -mt-1 ${
                                    sortConfig.key === 'address' && sortConfig.direction === 'desc'
                                      ? 'text-brand-primary'
                                      : 'text-gray-400'
                                  }`} />
                                </span>
                              </button>
                              <button
                                onClick={() => handleSort('reports_count')}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-primary text-left p-3 border-r border-gray-200 bg-gray-100"
                              >
                                Reports
                                <span className="flex flex-col">
                                  <ChevronUp className={`w-3 h-3 ${
                                    sortConfig.key === 'reports_count' && sortConfig.direction === 'asc'
                                      ? 'text-brand-primary'
                                      : 'text-gray-400'
                                  }`} />
                                  <ChevronDown className={`w-3 h-3 -mt-1 ${
                                    sortConfig.key === 'reports_count' && sortConfig.direction === 'desc'
                                      ? 'text-brand-primary'
                                      : 'text-gray-400'
                                  }`} />
                                </span>
                              </button>
                              <button
                                onClick={() => handleSort('status')}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-primary text-left p-3 border-r border-gray-200 bg-gray-100"
                              >
                                Status
                                <span className="flex flex-col">
                                  <ChevronUp className={`w-3 h-3 ${
                                    sortConfig.key === 'status' && sortConfig.direction === 'asc'
                                      ? 'text-brand-primary'
                                      : 'text-gray-400'
                                  }`} />
                                  <ChevronDown className={`w-3 h-3 -mt-1 ${
                                    sortConfig.key === 'status' && sortConfig.direction === 'desc'
                                      ? 'text-brand-primary'
                                      : 'text-gray-400'
                                  }`} />
                                </span>
                              </button>
                            </div>
                          </div>
                          <div>
                          {filteredClients.map((client, index) => (
                            <div key={index} className="hover:bg-gray-50">
                              <div className="grid grid-cols-[2fr,2fr,2fr,1fr,1fr] border-b border-gray-200">
                                <div className="flex items-center gap-4 p-3 border-r border-gray-200">
                                  <div className="w-8 h-8 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-medium">
                                    {client.name.charAt(0)}
                                  </div>
                                  <div
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                                  >
                                    <h3 className="font-medium hover:text-brand-primary">{client.name}</h3>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-500 p-3 border-r border-gray-200">{client.email}</div>
                                <div className="text-sm text-gray-500 truncate p-3 border-r border-gray-200">{client.address}</div>
                                <div className="text-sm text-gray-500 p-3 border-r border-gray-200">{client.reports_count}</div>
                                <div className="flex items-center p-3 border-r border-gray-200">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    client.status === 'active'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {client.status === 'active' ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          </div>
                        </div>
                      </>
                    )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
                <Rocket className="w-16 h-16 text-brand-primary mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
                <p className="text-gray-500 text-center max-w-md">
                  We're working on bringing you customizable report templates. Stay tuned for updates!
                </p>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Team Access</h2>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold">Team Members</h3>
                  </div>
                  <div className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Team Access Coming Soon</h3>
                    <p className="text-gray-500">Collaborate with your team members</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default Dashboard;