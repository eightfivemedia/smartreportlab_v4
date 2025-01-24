import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

export interface Client {
  id: string;
  name: string;
  reports_count: number;
  last_report_date: string | null;
  status: 'active' | 'inactive';
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'reports_count' | 'last_report_date' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  updateClient: (id: string, client: Omit<Client, 'id' | 'reports_count' | 'last_report_date' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  archiveClient: (id: string) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Client | undefined;
  loading: boolean;
  error: string | null;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      fetchClients();
    }
  }, [isLoggedIn]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching clients');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (newClient: Omit<Client, 'id' | 'reports_count' | 'last_report_date' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...newClient,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      setClients([data, ...clients]);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding the client');
      throw err;
    }
  };

  const updateClient = async (id: string, updatedClient: Omit<Client, 'id' | 'reports_count' | 'last_report_date' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updatedClient)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClients(clients.map(client => client.id === id ? data : client));
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the client');
      throw err;
    }
  };

  const archiveClient = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClients(clients.map(client => client.id === id ? data : client));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while archiving the client');
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(clients.filter(client => client.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the client');
      throw err;
    }
  };

  const value = {
    clients,
    addClient,
    updateClient,
    archiveClient,
    deleteClient,
    loading,
    error
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
}