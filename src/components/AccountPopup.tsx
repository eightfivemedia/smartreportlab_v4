import React, { useState, useRef, useEffect } from 'react';
import { Settings, HelpCircle, LogOut, X, User, Bell, Lock, Moon, CreditCard, Shield, Info, Upload, Building2, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface UserProfile {
  full_name: string;
  email: string;
  company: string;
  phone: string;
  avatar_url: string | null;
}

interface AccountPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userInitials?: string;
  userImage?: string;
  isSidebarCollapsed?: boolean;
  isMobile?: boolean;
}

const AccountPopup = ({ isOpen, onClose, userInitials = 'JD', userImage, isSidebarCollapsed, isMobile }: AccountPopupProps) => {
  const { logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    email: '',
    company: '',
    phone: '(   )    -    ',
    avatar_url: null
  });
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          full_name: user.user_metadata.full_name || user.email?.split('@')[0] || '',
          email: user.email || '',
          company: user.user_metadata.company || '',
          phone: user.user_metadata.phone || '(   )    -    ',
          avatar_url: user.user_metadata.avatar_url || null
        });
      }
    };

    loadProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;
      
      // Update local state
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));

    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveError(null);

    // Format phone number
    const formattedPhone = profile.phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    try {
      const { error } = await supabase.auth.updateUser({
        email: profile.email,
        data: {
          full_name: profile.full_name,
          company: profile.company,
          phone: formattedPhone
        }
      });

      if (error) throw error;
      setShowSettings(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => setShowSettings(true),
    },
    {
      icon: HelpCircle,
      label: 'Support',
      onClick: () => console.log('Support clicked'),
    },
    {
      icon: LogOut,
      label: 'Log out',
      onClick: logout,
      className: 'text-red-600 hover:bg-red-50',
    },
  ];

  return (
    <div 
      className="absolute w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
      style={{ inset: 'auto auto 100% 6%' }}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {userImage || profile.avatar_url ? (
            <img
              src={userImage || profile.avatar_url}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-medium">
              {userInitials}
            </div>
          )}
          <div>
            <h4 className="font-medium">{profile.full_name}</h4>
          </div>
        </div>
      </div>
      <div className="py-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors ${
              item.className || 'text-gray-700'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
              {/* Tabs */}
              <div className="border-b sm:border-b-0 sm:border-r border-gray-200 bg-gray-50">
                <div className="flex sm:flex-col overflow-x-auto sm:overflow-x-visible p-2 sm:p-4 sm:w-48 sm:space-y-1 no-scrollbar">
                  {[
                    { id: 'general', label: 'General', icon: Settings },
                    { id: 'account', label: 'Account', icon: User },
                    { id: 'subscription', label: 'Subscription', icon: CreditCard },
                    { id: 'privacy', label: 'Privacy', icon: Shield },
                    { id: 'help', label: 'Help', icon: Info }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                        activeSettingsTab === tab.id
                          ? 'bg-brand-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeSettingsTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications about your reports</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'account' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-4">Profile Picture</h3>
                      <div className="flex items-center gap-4">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-brand-primary text-white flex items-center justify-center text-xl font-medium">
                            {userInitials}
                          </div>
                        )}
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            <Upload className="w-4 h-4" />
                            {isUploading ? 'Uploading...' : 'Upload New Picture'}
                          </button>
                          {uploadError && (
                            <p className="text-sm text-red-500 mt-2">{uploadError}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-4">Profile Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={profile.company}
                              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              maxLength={14}
                              value={profile.phone}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 10) value = value.slice(0, 10);
                                const formatted = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                                setProfile({ ...profile, phone: formatted || '(   )    -    ' });
                              }}
                              onFocus={(e) => {
                                if (e.target.value === '(   )    -    ') {
                                  setProfile({ ...profile, phone: '' });
                                }
                              }}
                              onBlur={(e) => {
                                if (!e.target.value) {
                                  setProfile({ ...profile, phone: '(   )    -    ' });
                                }
                              }}
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                              placeholder="(555) 555-5555"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'subscription' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-4">Current Plan</h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="font-medium">Free Trial</p>
                        <p className="text-sm text-gray-500">14 days remaining</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-4">Security</h3>
                      <div className="space-y-4">
                        <button className="text-brand-primary hover:text-brand-primary-dark">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'help' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-4">Support</h3>
                      <div className="space-y-4">
                        <a href="#" className="text-brand-primary hover:text-brand-primary-dark block">
                          Documentation
                        </a>
                        <a href="#" className="text-brand-primary hover:text-brand-primary-dark block">
                          Contact Support
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-dark transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            {saveError && (
              <div className="mt-4 text-sm text-red-500">
                {saveError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPopup;