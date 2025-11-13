'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  User, 
  Lock, 
  Activity, 
  BarChart3, 
  Shield, 
  Trash2, 
  LogOut,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  Settings,
  Bell,
  Globe,
  Palette
} from 'lucide-react';

interface UserStats {
  totalCVs: number;
  createdAt: string;
  mostUsedTemplate: string;
  lastActivity: string;
}

interface ActivityLog {
  _id: string;
  activityType: string;
  timestamp: string;
  ipAddress?: string;
}

interface Session {
  _id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export default function SettingsContent() {
  const { data: session, update } = useSession();
  const { language, setLanguage } = useLanguage();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'preferences' | 'stats' | 'sessions'>('account');
  
  // Account State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  
  // Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Stats State
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  
  // Delete Account State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email }),
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Session'ı güncelle
        await update({
          name: data.user.fullName,
          email: data.user.email,
        });
        
        toast.success('Profile updated successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.warning('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.warning('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      if (res.ok) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to change password');
      }
    } catch {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/user/statistics');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // Silently fail
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/user/security-logs');
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch {
      // Silently fail
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/user/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch {
      // Silently fail
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.warning('Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
      });
      
      if (res.ok) {
        toast.success('Account deleted successfully');
        signOut({ callbackUrl: '/' });
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete account');
      }
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStats();
      fetchActivities();
    } else if (activeTab === 'sessions') {
      fetchSessions();
    }
  }, [activeTab]);

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Tabs - Modern Design with Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-8">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl font-medium transition-all text-xs sm:text-sm ${
            activeTab === 'account'
              ? 'bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
          }`}
        >
          <User size={20} className="sm:w-6 sm:h-6" />
          <span>Account</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl font-medium transition-all text-xs sm:text-sm ${
            activeTab === 'security'
              ? 'bg-linear-to-br from-red-500 to-red-600 text-white shadow-lg scale-105'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
          }`}
        >
          <Lock size={20} className="sm:w-6 sm:h-6" />
          <span>Security</span>
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl font-medium transition-all text-xs sm:text-sm ${
            activeTab === 'preferences'
              ? 'bg-linear-to-br from-purple-500 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
          }`}
        >
          <Palette size={20} className="sm:w-6 sm:h-6" />
          <span>Preferences</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl font-medium transition-all text-xs sm:text-sm ${
            activeTab === 'stats'
              ? 'bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg scale-105'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
          }`}
        >
          <BarChart3 size={20} className="sm:w-6 sm:h-6" />
          <span>Statistics</span>
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl font-medium transition-all text-xs sm:text-sm ${
            activeTab === 'sessions'
              ? 'bg-linear-to-br from-orange-500 to-orange-600 text-white shadow-lg scale-105'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
          }`}
        >
          <Shield size={20} className="sm:w-6 sm:h-6" />
          <span>Sessions</span>
        </button>
      </div>

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} className="text-primary" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="max-w-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="max-w-md"
                />
              </div>
              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-2 border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle size={20} />
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 size={18} className="mr-2" />
                Delete Account
              </Button>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="animate-fade-in">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock size={20} className="text-primary" />
              Change Password
            </h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPasswords ? 'Hide passwords' : 'Show passwords'}
              </button>
              <Button
                onClick={handleChangePassword}
                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                className="flex items-center gap-2"
              >
                <Lock size={18} />
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              Language
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select your preferred language
              </p>
              <div className="flex gap-3">
                <Button
                  variant={language === 'en' ? 'primary' : 'outline'}
                  onClick={() => setLanguage('en')}
                  className="min-w-[120px]"
                >
                  🇬🇧 English
                </Button>
                <Button
                  variant={language === 'tr' ? 'primary' : 'outline'}
                  onClick={() => setLanguage('tr')}
                  className="min-w-[120px]"
                >
                  🇹🇷 Türkçe
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive email notifications about your account activity
                  </p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive updates about new features and tips
                  </p>
                </div>
                <button
                  onClick={() => setMarketingEmails(!marketingEmails)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    marketingEmails ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      marketingEmails ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              Your Statistics
            </h2>
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total CVs</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalCVs}</p>
                </div>
                <div className="p-4 bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Favorite Template</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {stats.mostUsedTemplate || 'None'}
                  </p>
                </div>
                <div className="p-4 bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Member Since</p>
                  <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    {new Date(stats.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Activity</p>
                  <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                    {stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Loading statistics...</p>
            )}
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-2">
              {activities.length > 0 ? (
                activities.slice(0, 10).map((activity) => (
                  <div 
                    key={activity._id} 
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{activity.activityType}</p>
                      {activity.ipAddress && (
                        <p className="text-sm text-gray-500">IP: {activity.ipAddress}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="animate-fade-in">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              Active Sessions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage your active sessions and devices
            </p>
            <div className="space-y-3">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <div 
                    key={session._id} 
                    className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-gray-500">{session.location}</p>
                      {session.current && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No active sessions</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
              <AlertTriangle size={24} />
              Delete Account
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            <p className="text-sm mb-4 font-medium">
              Type <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">DELETE</span> to confirm:
            </p>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              className="mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE' || loading}
                variant="outline"
                className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
