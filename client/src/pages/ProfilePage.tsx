import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Application } from '../types';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  HeartHandshake,
  Users,
  Edit3,
  Key,
  LogOut,
  Bell,
  CheckCircle2,
  Clock,
  Ban,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

const GOVERNORATES = ['Gaza', 'North Gaza', 'Deir al-Balah', 'Khan Younis', 'Rafah'];

export const ProfilePage: React.FC = () => {
  const { user, logout, updateUser, refreshUser } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Edit Profile Modal state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    governorate: user?.governorate || 'Gaza',
    address: user?.address || '',
    bio: user?.bio || '',
    birthDate: user?.birthDate ? user.birthDate.split('T')[0] : '',
  });

  // Change Password Modal state
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [passFormData, setPassFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await api.get('/users/me/applications');
      if (res.data?.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to load user applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    if (user) {
      setEditFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        governorate: user.governorate || 'Gaza',
        address: user.address || '',
        bio: user.bio || '',
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setErrorMsg(null);
      const res = await api.patch('/users/me', editFormData);
      if (res.data?.success) {
        updateUser(res.data.user);
        setProfileMsg('Profile information updated successfully.');
        setIsEditProfileOpen(false);
        setTimeout(() => setProfileMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passFormData.newPassword !== passFormData.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }
    try {
      setSavingPass(true);
      setErrorMsg(null);
      const res = await api.patch('/users/me/password', {
        currentPassword: passFormData.currentPassword,
        newPassword: passFormData.newPassword,
      });
      if (res.data?.success) {
        setPassMsg('Password changed successfully.');
        setIsChangePassOpen(false);
        setPassFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPassMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 skew-x-12 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-emerald-900/40">
              {user?.firstName?.[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {user?.firstName} {user?.lastName}
                </h1>
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center space-x-2">
                <span>{user?.email}</span>
                <span>•</span>
                <span>{user?.governorate || 'Gaza'} Governorate</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition border border-white/10 flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setIsChangePassOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition border border-white/10 flex items-center space-x-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
            <button
              onClick={() => logout()}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition border border-rose-500/30 flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {profileMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{profileMsg}</span>
        </div>
      )}

      {passMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{passMsg}</span>
        </div>
      )}

      {/* Main Profile Grid: Personal Info + My Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Personal Information Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-400">
              Personal Information
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Full Name</p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Email Address</p>
                <p className="font-bold text-slate-800 mt-0.5">{user?.email}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Phone Number</p>
                <p className="font-bold text-slate-800 mt-0.5">{user?.phone || 'Not specified'}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Governorate</p>
                <p className="font-bold text-slate-800 mt-0.5">{user?.governorate || 'Gaza'}</p>
              </div>

              {user?.address && (
                <div>
                  <p className="text-slate-400 font-medium">Detailed Address / Shelter</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{user.address}</p>
                </div>
              )}

              {user?.birthDate && (
                <div>
                  <p className="text-slate-400 font-medium">Date of Birth</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {new Date(user.birthDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {user?.bio && (
                <div>
                  <p className="text-slate-400 font-medium">Biography / Notes</p>
                  <p className="text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {user.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Recent Notifications</span>
              </h3>
              {notifications.some((n) => !n.isRead) && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-[11px] text-emerald-700 hover:underline font-semibold"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No notifications</p>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: My Applications Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">My Project Applications</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track the status and reviews of all initiatives you applied for.
                </p>
              </div>

              <Link
                to="/projects"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
              >
                <span>Browse Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingApps ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Loading your applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl p-6">
                <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No Applications Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  You haven't submitted any applications. Explore active relief projects in Gaza and join our programs.
                </p>
                <Link
                  to="/projects"
                  className="mt-4 inline-block px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  Explore Projects
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Project</th>
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Applied At</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-bold text-slate-800 max-w-xs truncate">
                          {app.project?.title}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {app.project?.category.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              app.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/projects/${app.project?.slug || app.project?.id}`}
                            className="text-emerald-700 hover:text-emerald-900 font-semibold"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Edit Personal Information</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">First Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.firstName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 mt-1"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.lastName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Phone</label>
                <input
                  type="text"
                  required
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Governorate</label>
                <select
                  value={editFormData.governorate}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, governorate: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 mt-1 bg-white"
                >
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g} Governorate
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Detailed Address</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Biography</label>
                <textarea
                  rows={3}
                  value={editFormData.bio}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, bio: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 mt-1"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePassOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Current Password</label>
                <input
                  type="password"
                  required
                  value={passFormData.currentPassword}
                  onChange={(e) =>
                    setPassFormData({ ...passFormData, currentPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 mt-1"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">New Password (min 6)</label>
                <input
                  type="password"
                  required
                  value={passFormData.newPassword}
                  onChange={(e) =>
                    setPassFormData({ ...passFormData, newPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 mt-1"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passFormData.confirmPassword}
                  onChange={(e) =>
                    setPassFormData({ ...passFormData, confirmPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 mt-1"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsChangePassOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPass}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  {savingPass ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

