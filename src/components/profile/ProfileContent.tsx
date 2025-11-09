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
  AlertTriangle
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

export default function ProfileContent() {
  const { data: session, update } = useSession();
  const { t } = useLanguage();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'stats' | 'sessions'>('personal');
  
  // Personal Info State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  
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
        
        toast.success(t('profile.updateSuccess'));
        
        // Sayfayı yeniden yükle
        window.location.reload();
      } else {
        const data = await res.json();
        toast.error(data.error || t('profile.updateError'));
      }
    } catch {
      toast.error(t('profile.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.warning(t('profile.passwordMismatch'));
      return;
    }
    
    if (newPassword.length < 6) {
      toast.warning(t('profile.passwordTooShort'));
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
        toast.success(t('profile.passwordChanged'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        toast.error(data.error || t('profile.passwordChangeError'));
      }
    } catch {
      toast.error(t('profile.passwordChangeError'));
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
      // Silently fail - stats are not critical
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
      // Silently fail - activities are not critical
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
      // Silently fail - sessions are not critical
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.warning(t('profile.deleteConfirmationError'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
      });
      
      if (res.ok) {
        toast.success(t('profile.accountDeleted'));
        signOut({ callbackUrl: '/' });
      } else {
        const data = await res.json();
        toast.error(data.error || t('profile.deleteError'));
      }
    } catch {
      toast.error(t('profile.deleteError'));
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
      <h1 className="text-3xl font-bold mb-8 text-foreground">
        {t('profile.title')}
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={activeTab === 'personal' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('personal')}
          className="flex items-center gap-2"
        >
          <User size={18} />
          {t('profile.tabs.personal')}
        </Button>
        <Button
          variant={activeTab === 'security' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('security')}
          className="flex items-center gap-2"
        >
          <Lock size={18} />
          {t('profile.tabs.security')}
        </Button>
        <Button
          variant={activeTab === 'stats' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('stats')}
          className="flex items-center gap-2"
        >
          <BarChart3 size={18} />
          {t('profile.tabs.stats')}
        </Button>
        <Button
          variant={activeTab === 'sessions' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('sessions')}
          className="flex items-center gap-2"
        >
          <Shield size={18} />
          {t('profile.tabs.sessions')}
        </Button>
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} />
              {t('profile.personalInfo.title')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('profile.personalInfo.fullName')}
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('profile.personalInfo.fullNamePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('profile.personalInfo.email')}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('profile.personalInfo.emailPlaceholder')}
                />
              </div>
              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save size={18} />
                {loading ? t('profile.saving') : t('profile.saveChanges')}
              </Button>
            </div>
          </Card>

          {/* Delete Account Section */}
          <Card className="p-6 border-red-200 dark:border-red-800">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle size={20} />
              {t('profile.dangerZone.title')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('profile.dangerZone.description')}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 size={18} className="mr-2" />
                {t('profile.dangerZone.deleteAccount')}
              </Button>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut size={18} className="mr-2" />
                {t('profile.dangerZone.logout')}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock size={20} />
            {t('profile.security.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('profile.security.currentPassword')}
              </label>
              <div className="relative">
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('profile.security.newPassword')}
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
                {t('profile.security.confirmPassword')}
              </label>
              <Input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPasswords ? t('profile.security.hidePasswords') : t('profile.security.showPasswords')}
              </button>
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              className="flex items-center gap-2"
            >
              <Lock size={18} />
              {loading ? t('profile.changing') : t('profile.security.changePassword')}
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              {t('profile.stats.title')}
            </h2>
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.stats.totalCVs')}</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalCVs}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.stats.mostUsedTemplate')}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.mostUsedTemplate || t('profile.stats.none')}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.stats.memberSince')}</p>
                  <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    {new Date(stats.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.stats.lastActivity')}</p>
                  <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                    {stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : t('profile.stats.never')}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">{t('profile.stats.loading')}</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity size={20} />
              {t('profile.activity.title')}
            </h2>
            <div className="space-y-2">
              {activities.length > 0 ? (
                activities.slice(0, 10).map((activity) => (
                  <div key={activity._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">{t(`profile.activity.types.${activity.activityType}`)}</p>
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
                <p className="text-gray-500 text-center py-4">{t('profile.activity.noActivity')}</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield size={20} />
            {t('profile.sessions.title')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('profile.sessions.description')}
          </p>
          <div className="space-y-3">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div key={session._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-gray-500">{session.location}</p>
                    {session.current && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                        {t('profile.sessions.current')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(session.lastActive).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">{t('profile.sessions.noSessions')}</p>
            )}
          </div>
        </Card>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              {t('profile.deleteModal.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('profile.deleteModal.warning')}
            </p>
            <p className="text-sm mb-4">
              {t('profile.deleteModal.instruction')}
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
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? t('profile.deleting') : t('profile.deleteModal.confirm')}
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                variant="outline"
                className="flex-1"
              >
                {t('profile.deleteModal.cancel')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
