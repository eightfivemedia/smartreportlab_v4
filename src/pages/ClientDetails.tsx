import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mail, Phone, Building2, Calendar, FileText, ArrowLeft, Archive, Trash2, AlertTriangle } from 'lucide-react';
import { useClients } from '../context/ClientContext';
import ReportClientPopup from '../components/ReportClientPopup';
import { supabase } from '../lib/supabase';

const ClientDetails = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { clients, archiveClient, deleteClient } = useClients();
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = clients.find(c => c.id === clientId);

  const handleArchive = async () => {
    if (!client) return;
    setIsLoading(true);
    setError(null);
    try {
      await archiveClient(client.id);
      // Stay on the page to show the updated status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive client');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!client) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteClient(client.id);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client');
      setShowDeleteModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const [reports, setReports] = useState<Array<{
    id: string;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    file_url: string | null;
    created_at: string;
  }>>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!client) return;
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('id, name, status, file_url, created_at')
          .eq('client_id', client.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReports(data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, [client]);

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Client Not Found</h1>
          <p className="text-gray-600 mb-4">The client you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-brand-primary hover:text-brand-primary-dark flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard', { state: { activeTab: 'clients' } })}
          className="flex items-center gap-2 text-gray-600 hover:text-brand-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Clients
        </button>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-semibold mb-1">{client.name}</h1>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  client.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {client.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => navigate(`/dashboard/clients/${client.id}/edit`)}
                  className="border border-brand-primary text-brand-primary px-4 py-2 rounded-lg hover:bg-brand-light transition-colors flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                >
                  Edit Client
                </button>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {client.status === 'active' && (
                    <button
                      onClick={handleArchive}
                      disabled={isLoading}
                      className="border border-yellow-500 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors flex items-center gap-2 disabled:opacity-50 w-full sm:w-auto justify-center"
                    >
                      <Archive className="w-5 h-5" />
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isLoading}
                    className="border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50 w-full sm:w-auto justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                </div>
                <button 
                  onClick={() => setShowReportPopup(true)}
                  className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-dark transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <FileText className="w-5 h-5" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-5 h-5" />
                      <a href={`mailto:${client.email}`} className="hover:text-brand-primary">
                        {client.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-5 h-5" />
                      <a href={`tel:${client.phone}`} className="hover:text-brand-primary">
                        {client.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-3 text-gray-600">
                      <Building2 className="w-5 h-5 flex-shrink-0" />
                      <span>{client.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>Client since {new Date(client.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Reports Overview</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Reports</p>
                        <p className="text-2xl font-semibold">{client.reports_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Report</p>
                        <p className="text-2xl font-semibold">{client.last_report_date ? new Date(client.last_report_date).toLocaleDateString() : 'No reports yet'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
                <div>
                  {loadingReports ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary mx-auto"></div>
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No reports generated yet</p>
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
                                  {new Date(report.created_at).toLocaleDateString()}
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
                                  target="_blank"
                                  rel="noopener noreferrer"
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
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Client</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {client.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Delete Client'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Report Generation Popup */}
      <ReportClientPopup
        isOpen={showReportPopup}
        onClose={() => {
          setShowReportPopup(false);
          setSelectedFile(null);
        }}
        onClientSelect={() => {
          setShowReportPopup(false);
          setSelectedFile(null);
        }}
        selectedFile={selectedFile}
        preselectedClientId={clientId}
      />
    </div>
  );
};

export default ClientDetails;