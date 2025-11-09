/**
 * Admin Users Content Component
 * 
 * User management interface
 * 
 * @module components/admin/AdminUsersContent
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Search, UserCheck, UserX, Shield, Mail, Phone, Calendar } from 'lucide-react';

interface User {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export default function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      }
    } catch {
      // Silently fail - user will see empty list
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          User Management
        </h1>
        <p className="text-muted-foreground">
          Toplam {users.length} kullanıcı ({users.filter(u => u.isActive).length} aktif)
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="İsim veya email ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Role Filter */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as 'all' | 'user' | 'admin')}
          className="px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">Tüm Roller</option>
          <option value="user">Kullanıcı</option>
          <option value="admin">Admin</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user._id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  user.role === 'admin' ? 'bg-orange-500' : 'bg-blue-500'
                }`}>
                  {user.fullName.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{user.fullName}</h3>
                    {user.role === 'admin' && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-orange-500 text-white rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        ADMIN
                      </span>
                    )}
                    {user.isActive ? (
                      <span className="px-2 py-0.5 text-xs font-bold bg-green-500 text-white rounded-full flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Aktif
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full flex items-center gap-1">
                        <UserX className="w-3 h-3" />
                        Pasif
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                      {user.emailVerified && (
                        <span className="text-green-500 text-xs">✓</span>
                      )}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {user.lastLogin && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Son Giriş: {new Date(user.lastLogin).toLocaleDateString('tr-TR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  onClick={() => {/* TODO: Implement user details modal */}}
                >
                  Detaylar
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Filtrelere uygun kullanıcı bulunamadı'
                : 'Henüz kullanıcı yok'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
