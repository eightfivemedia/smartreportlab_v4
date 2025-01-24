import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, Building2, AlertCircle, Loader2 } from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { supabase } from '../lib/supabase';

interface ReportClientPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onClientSelect: (clientId: string) => void;
  selectedFile: File | null;
  preselectedClientId?: string;
}

const ReportClientPopup = ({ isOpen, onClose, onClientSelect, selectedFile, preselectedClientId }: ReportClientPopupProps) => {
  const { clients, addClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(preselectedClientId || null);
  const [activeTab, setActiveTab] = useState<'select' | 'create'>('select');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportName, setReportName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

  // Fetch webhook URL from system_config
  useEffect(() => {
    const fetchWebhookUrl = async () => {
      const { data, error } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'make_webhook_url')
        .single();

      if (error) {
        console.error('Error fetching webhook URL:', error);
        setError('Failed to load configuration');
        return;
      }

      setWebhookUrl(data.value);
    };

    fetchWebhookUrl();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    submit?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof formErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Client name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setFormErrors({});
      try {
        const newClient = await addClient(formData);
        if (newClient && newClient.id) {
          // Reset form
          setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            status: 'active'
          });
          // Switch back to select tab and select the new client
          setActiveTab('select');
          setSelectedClientId(newClient.id);
          // Clear search to show the new client
          setSearchQuery('');
        } else {
          setFormErrors({
            submit: 'Failed to create client: Invalid response from server'
          });
        }
      } catch (err) {
        setFormErrors({
          ...formErrors,
          submit: err instanceof Error ? err.message : 'Failed to create client'
        });
      }
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedClientId || !selectedFile || !webhookUrl) {
      setError('Missing required configuration');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Validate file type
      if (!selectedFile.type || selectedFile.type !== 'text/csv') {
        throw new Error('Only CSV files are supported');
      }

      // Get the selected client
      const client = clients.find(c => c.id === selectedClientId);
      if (!client) throw new Error('Client not found');

      // Upload the file to Supabase storage
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${selectedClientId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('report-files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('report-files')
        .getPublicUrl(filePath);

      // Ensure the URL is properly formatted
      const fullUrl = `${supabase.supabaseUrl}/storage/v1/object/public/report-files/${filePath}`;

      // Create a new report record
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          name: reportName || 'Untitled Report',
          client_id: selectedClientId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          original_file_url: fullUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // Trigger the Make.com webhook with client and file details
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_id: report.id,
          report_name: reportName || 'Untitled Report',
          original_file_name: selectedFile.name,
          client: {
            id: client.id,
            name: client.name,
            email: client.email,
            address: client.address,
            logo_url: null
          },
          user: {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata.full_name,
            company: user.user_metadata.company
          },
          file_url: fullUrl
        }),
      });

      if (!webhookResponse.ok) {
        throw new Error('Failed to trigger report generation');
      }

      // Success - close the popup and reset state
      setReportName('');
      setSelectedClientId(null);
      setIsGenerating(false);
      onClose();

    } catch (err) {
      console.error('Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4">Client for Report</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('select')}
                className={`pb-2 px-1 font-medium ${
                  activeTab === 'select'
                    ? 'text-brand-primary border-b-2 border-brand-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Select Existing
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`pb-2 px-1 font-medium ${
                  activeTab === 'create'
                    ? 'text-brand-primary border-b-2 border-brand-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Create New
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Selected file: {selectedFile?.name}</p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Name*
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
                className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>
          </div>
          
          {activeTab === 'select' ? (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {filteredClients.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => setSelectedClientId(client.id)}
                        className={`p-3 cursor-pointer flex items-center justify-between group transition-colors ${
                          selectedClientId === client.id
                            ? 'bg-brand-light/20 hover:bg-brand-light/30'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-medium">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium group-hover:text-brand-primary">
                              {client.name}
                            </h3>
                            <p className="text-sm text-gray-500">{client.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          client.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {client.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                    <p className="text-gray-500 mb-4">Try a different search or create a new client</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-dark"
                    >
                      <UserPlus className="w-5 h-5" />
                      Create New Client
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formErrors.submit && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{formErrors.submit}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name*
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full rounded-lg border ${
                    formErrors.name ? 'border-red-300' : 'border-gray-200'
                  } py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`}
                  placeholder="Enter client name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full rounded-lg border ${
                    formErrors.email ? 'border-red-300' : 'border-gray-200'
                  } py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`}
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full rounded-lg border ${
                    formErrors.phone ? 'border-red-300' : 'border-gray-200'
                  } py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`}
                  placeholder="Enter phone number"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address*
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full rounded-lg border ${
                    formErrors.address ? 'border-red-300' : 'border-gray-200'
                  } py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`}
                  placeholder="Enter client address"
                  rows={3}
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </form>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          {activeTab === 'select' ? (
            <>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('create')}
                  className="text-brand-primary hover:text-brand-primary-dark flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <UserPlus className="w-5 h-5" />
                  Add New Client
                </button>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  disabled={isGenerating}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={!selectedClientId || !reportName.trim() || isGenerating}
                  className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Report'
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('select')}
                className="text-gray-600 hover:text-gray-800 w-full sm:w-auto text-center"
              >
                Back to Selection
              </button>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-dark transition-colors w-full sm:w-auto"
                >
                  Create & Select
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportClientPopup;