import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useClients } from '../context/ClientContext';

const EditClient = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { clients, updateClient } = useClients();
  const client = clients.find(c => c.id === clientId);

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
  }>({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        status: client.status
      });
    }
  }, [client]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && client) {
      try {
        updateClient(client.id, formData)
          .then(() => {
            navigate(`/dashboard/clients/${client.id}`);
          })
          .catch((error) => {
            setError(error.message);
          });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update client');
      }
    }
  };

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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/dashboard/clients/${client.id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-brand-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Client Details
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold">Edit Client</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
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
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-dark transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClient;