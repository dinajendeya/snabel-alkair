import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Project, Application, User, AuditLogItem } from '../types';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { EditProjectModal } from '../components/EditProjectModal';
import { ProjectDrawer } from '../components/ProjectDrawer';
import { ReviewApplicationModal } from '../components/ReviewApplicationModal';
import { UserDetailModal } from '../components/UserDetailModal';
import {
  LayoutDashboard,
  FolderKanban,
  HeartHandshake,
  Users,
  FileCheck2,
  ScrollText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Pause,
  Play,
  CheckCircle,
  Trash2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Building2,
  RefreshCw,
} from 'lucide-react';

type TabType = 'OVERVIEW' | 'PROJECTS' | 'BENEFICIARIES' | 'VOLUNTEERS' | 'APPLICATIONS' | 'AUDIT_LOGS';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');

  // Overview data
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Projects data
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Beneficiaries data
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);

  // Volunteers data
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  // Applications data
  const [applications, setApplications] = useState<Application[]>([]);
  const [appFilterStatus, setAppFilterStatus] = useState<string>('ALL');
  const [appFilterRole, setAppFilterRole] = useState<string>('ALL');
  const [loadingApps, setLoadingApps] = useState(false);

  // Audit logs data
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Modals
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [drawerProjectId, setDrawerProjectId] = useState<string | null>(null);
  const [reviewingApp, setReviewingApp] = useState<Application | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);

  // Status message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoadingOverview(true);
      const res = await api.get('/dashboard/overview');
      if (res.data?.success) {
        setOverviewStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard overview:', err);
    } finally {
      setLoadingOverview(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await api.get('/dashboard/projects');
      if (res.data?.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Error fetching dashboard projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchBeneficiaries = async () => {
    try {
      setLoadingBeneficiaries(true);
      const res = await api.get('/dashboard/beneficiaries');
      if (res.data?.success) {
        setBeneficiaries(res.data.beneficiaries);
      }
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
    } finally {
      setLoadingBeneficiaries(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      setLoadingVolunteers(true);
      const res = await api.get('/dashboard/volunteers');
      if (res.data?.success) {
        setVolunteers(res.data.volunteers);
      }
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoadingVolunteers(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const params: any = {};
      if (appFilterStatus !== 'ALL') params.status = appFilterStatus;
      if (appFilterRole !== 'ALL') params.role = appFilterRole;

      const res = await api.get('/dashboard/applications', { params });
      if (res.data?.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoadingAudit(true);
      const params: any = {};
      if (auditSearch.trim()) params.search = auditSearch.trim();

      const res = await api.get('/dashboard/audit-logs', { params });
      if (res.data?.success) {
        setAuditLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoadingAudit(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOverview();
  }, []);

  // Tab switch loader
  useEffect(() => {
    if (activeTab === 'OVERVIEW') fetchOverview();
    if (activeTab === 'PROJECTS') fetchProjects();
    if (activeTab === 'BENEFICIARIES') fetchBeneficiaries();
    if (activeTab === 'VOLUNTEERS') fetchVolunteers();
    if (activeTab === 'APPLICATIONS') fetchApplications();
    if (activeTab === 'AUDIT_LOGS') fetchAuditLogs();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'APPLICATIONS') {
      fetchApplications();
    }
  }, [appFilterStatus, appFilterRole]);

  // Project Actions: Pause, Resume, Complete, Delete
  const handleUpdateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      const res = await api.patch(`/projects/${projectId}/status`, { status: newStatus });
      if (res.data?.success) {
        setStatusMessage(`Project status updated to ${newStatus}.`);
        fetchProjects();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update project status.');
    }
  };

  const handleDeleteProject = async (projectId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await api.delete(`/projects/${projectId}`);
      if (res.data?.success) {
        setStatusMessage(`Project "${title}" deleted.`);
        fetchProjects();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  // Open review modal from applicant ID (e.g. from Project Drawer)
  const handleSelectApplicantFromDrawer = async (applicationId: string) => {
    try {
      const app = applications.find((a) => a.id === applicationId);
      if (app) {
        setReviewingApp(app);
      } else {
        const res = await api.get('/dashboard/applications');
        const found = res.data?.applications?.find((a: any) => a.id === applicationId);
        if (found) setReviewingApp(found);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Admin Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Senabil Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time project governance, applicant review workflows, and comprehensive audit transparency.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 border border-emerald-200 animate-in fade-in">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200/80 scrollbar-none">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition whitespace-nowrap ${
            activeTab === 'OVERVIEW'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('PROJECTS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition whitespace-nowrap ${
            activeTab === 'PROJECTS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Project Management</span>
        </button>

        <button
          onClick={() => setActiveTab('BENEFICIARIES')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition whitespace-nowrap ${
            activeTab === 'BENEFICIARIES'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Beneficiaries</span>
        </button>

        <button
          onClick={() => setActiveTab('VOLUNTEERS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition whitespace-nowrap ${
            activeTab === 'VOLUNTEERS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Volunteers</span>
        </button>

        <button
          onClick={() => setActiveTab('APPLICATIONS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition whitespace-nowrap ${
            activeTab === 'APPLICATIONS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Applications</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition whitespace-nowrap ${
            activeTab === 'AUDIT_LOGS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ScrollText className="w-4 h-4" />
          <span>Audit Logs</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Top 5 Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Projects</span>
              <p className="text-3xl font-extrabold text-slate-900">
                {overviewStats?.stats?.totalProjects ?? 0}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block">
                {overviewStats?.stats?.runningProjects ?? 0} Active Running
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Applications</span>
              <p className="text-3xl font-extrabold text-slate-900">
                {overviewStats?.stats?.totalApplications ?? 0}
              </p>
              <span className="text-[10px] text-slate-500 font-bold block">Across all initiatives</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending Review</span>
              <p className="text-3xl font-extrabold text-amber-700">
                {overviewStats?.stats?.pendingApplications ?? 0}
              </p>
              <span className="text-[10px] text-amber-600 font-bold block">Requires decision</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Beneficiaries</span>
              <p className="text-3xl font-extrabold text-emerald-700">
                {overviewStats?.stats?.totalBeneficiaries ?? 0}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block">Enrolled families</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Volunteers</span>
              <p className="text-3xl font-extrabold text-blue-700">
                {overviewStats?.stats?.totalVolunteers ?? 0}
              </p>
              <span className="text-[10px] text-blue-600 font-bold block">Field professionals</span>
            </div>
          </div>

          {/* Category Breakdown & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Category Breakdown */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900">Projects by Sector</h3>
              <div className="space-y-3">
                {overviewStats?.categoryCounts?.map((c: any) => (
                  <div key={c.category} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>{c.category.replace('_', ' ')}</span>
                      <span>{c.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (c.count / (overviewStats.stats.totalProjects || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Activities */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900">Recent Audit Business Events</h3>
                <button
                  onClick={() => setActiveTab('AUDIT_LOGS')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View All Logs
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {overviewStats?.recentAuditLogs?.map((log: any) => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100 mr-2 text-[10px]">
                        {log.action}
                      </span>
                      <span className="text-slate-600">{log.description}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-3">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PROJECT MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'PROJECTS' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Projects Table ({projects.length})
            </h2>
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Project</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Applications</th>
                    <th className="py-3 px-4 font-semibold">Beneficiaries</th>
                    <th className="py-3 px-4 font-semibold">Volunteers</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 max-w-xs truncate">{p.title}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{p.slug}</p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {p.category.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            p.status === 'RUNNING'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'PAUSED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {p.totalApplications ?? p.stats?.totalApplications ?? 0}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {p.beneficiaries ?? p.stats?.beneficiaries ?? 0}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-700">
                        {p.volunteers ?? p.stats?.volunteers ?? 0}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* View Drawer */}
                          <button
                            onClick={() => setDrawerProjectId(p.id)}
                            title="View Project Drawer & Applicants"
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => setEditingProject(p)}
                            title="Edit Project"
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Pause / Resume */}
                          {p.status === 'RUNNING' ? (
                            <button
                              onClick={() => handleUpdateProjectStatus(p.id, 'PAUSED')}
                              title="Pause Applications"
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateProjectStatus(p.id, 'RUNNING')}
                              title="Resume Applications"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}

                          {/* Complete */}
                          {p.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleUpdateProjectStatus(p.id, 'COMPLETED')}
                              title="Mark as Completed"
                              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteProject(p.id, p.title)}
                            title="Delete Project"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BENEFICIARIES */}
      {/* ========================================================================= */}
      {activeTab === 'BENEFICIARIES' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <h2 className="text-lg font-bold text-slate-900">
            Registered Beneficiaries ({beneficiaries.length})
          </h2>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Phone</th>
                    <th className="py-3 px-4 font-semibold">Governorate</th>
                    <th className="py-3 px-4 font-semibold">Projects Joined</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {beneficiaries.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{b.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{b.email}</td>
                      <td className="py-3.5 px-4 text-slate-600">{b.phone}</td>
                      <td className="py-3.5 px-4 text-slate-600">{b.governorate || 'Gaza'}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {b.approvedProjects} Approved ({b.totalApplications} Applied)
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedUserDetail(b)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-semibold text-slate-700"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VOLUNTEERS */}
      {/* ========================================================================= */}
      {activeTab === 'VOLUNTEERS' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <h2 className="text-lg font-bold text-slate-900">
            Registered Volunteers ({volunteers.length})
          </h2>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Phone</th>
                    <th className="py-3 px-4 font-semibold">Governorate</th>
                    <th className="py-3 px-4 font-semibold">Projects Joined</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {volunteers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{v.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{v.email}</td>
                      <td className="py-3.5 px-4 text-slate-600">{v.phone}</td>
                      <td className="py-3.5 px-4 text-slate-600">{v.governorate || 'Gaza'}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-700">
                        {v.approvedProjects} Approved ({v.totalApplications} Applied)
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedUserDetail(v)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-semibold text-slate-700"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: APPLICATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'APPLICATIONS' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900">
              Applications Workflow ({applications.length})
            </h2>

            {/* Filters */}
            <div className="flex items-center space-x-3 text-xs">
              <select
                value={appFilterStatus}
                onChange={(e) => setAppFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={appFilterRole}
                onChange={(e) => setAppFilterRole(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="ALL">All Roles</option>
                <option value="BENEFICIARY">Beneficiaries Only</option>
                <option value="VOLUNTEER">Volunteers Only</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Applicant</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Project</th>
                    <th className="py-3 px-4 font-semibold">Motivation Preview</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Applied At</th>
                    <th className="py-3 px-4 font-semibold text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">
                          {app.user?.firstName} {app.user?.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400">{app.user?.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                          {app.user?.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 max-w-xs truncate">
                        {app.project?.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate italic">
                        "{app.motivation}"
                      </td>
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setReviewingApp(app)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: AUDIT LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">System Audit Trail</h2>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all business events and security actions.
              </p>
            </div>

            {/* Search audit */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAuditLogs()}
                placeholder="Search action or entity..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Action</th>
                    <th className="py-3 px-4 font-semibold">Entity</th>
                    <th className="py-3 px-4 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800">
                          {log.actor?.firstName} {log.actor?.lastName}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{log.actor?.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-semibold">{log.entityType}</td>
                      <td className="py-3 px-4 text-slate-700 max-w-md">{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onSuccess={() => {
          fetchProjects();
          fetchOverview();
        }}
      />

      <EditProjectModal
        project={editingProject}
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSuccess={() => {
          fetchProjects();
          fetchOverview();
        }}
      />

      <ProjectDrawer
        projectId={drawerProjectId}
        isOpen={!!drawerProjectId}
        onClose={() => setDrawerProjectId(null)}
        onSelectApplicant={(applicantId) => {
          handleSelectApplicantFromDrawer(applicantId);
        }}
      />

      <ReviewApplicationModal
        application={reviewingApp}
        isOpen={!!reviewingApp}
        onClose={() => setReviewingApp(null)}
        onSuccess={() => {
          fetchApplications();
          fetchProjects();
          fetchOverview();
        }}
      />

      <UserDetailModal
        user={selectedUserDetail}
        isOpen={!!selectedUserDetail}
        onClose={() => setSelectedUserDetail(null)}
      />
    </div>
  );
};

