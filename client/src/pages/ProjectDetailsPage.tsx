import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Project } from '../types';
import { ApplicationModal } from '../components/ApplicationModal';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Users,
  HeartHandshake,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Ban,
  ShieldCheck,
  Target,
  FileCheck2,
  Award,
  Sparkles,
  Share2,
} from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, setReturnUrl } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}`);
      if (res.data?.success) {
        setProject(res.data.project);

        // If returned from auth flow with ?apply=true, open modal automatically!
        if (searchParams.get('apply') === 'true' && res.data.project.status === 'RUNNING') {
          setIsApplyModalOpen(true);
        }
      }
    } catch (err) {
      console.error('Failed to load project details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const handleApplyClick = () => {
    if (!project || project.status !== 'RUNNING') return;

    if (!isAuthenticated) {
      setReturnUrl(`/projects/${project.slug || project.id}?apply=true`);
      navigate('/auth');
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading project specifications...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Project Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The requested humanitarian initiative could not be found or has been moved.
        </p>
        <Link
          to="/projects"
          className="mt-6 inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const isPaused = project.status === 'PAUSED';
  const isCompleted = project.status === 'COMPLETED';
  const isRunning = project.status === 'RUNNING';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Top Navigation & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Project'}</span>
        </button>
      </div>

      {/* Project Banner & Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl min-h-[300px] sm:min-h-[380px] flex items-end">
        <img
          src={
            project.imageUrl ||
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80'
          }
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative p-6 sm:p-10 text-white space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-slate-950">
              {project.category.replace('_', ' ')}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center space-x-1 ${
                isRunning
                  ? 'bg-emerald-600 text-white'
                  : isPaused
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {isRunning && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
              {isPaused && <Clock className="w-3 h-3" />}
              {isCompleted && <CheckCircle2 className="w-3 h-3" />}
              <span>{project.status}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            {project.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {project.shortDescription}
          </p>
        </div>
      </div>

      {/* User Application Status Banner (if already applied) */}
      {project.userApplication && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-4">
          <div className="p-2 rounded-xl bg-emerald-200 text-emerald-800 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 text-sm">
                You Applied to this Project
              </h3>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  project.userApplication.status === 'APPROVED'
                    ? 'bg-emerald-600 text-white'
                    : project.userApplication.status === 'REJECTED'
                    ? 'bg-rose-600 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {project.userApplication.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Submission Date:{' '}
              {new Date(project.userApplication.appliedAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-700 mt-1 italic">
              "{project.userApplication.motivation}"
            </p>
          </div>
        </div>
      )}

      {/* Project Status Lifecycle Notice if Paused or Completed */}
      {isPaused && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-center space-x-3">
          <Clock className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="font-bold">This project is currently paused.</p>
            <p className="text-xs text-amber-700">
              Applications are temporarily disabled while our field teams process current allocations.
            </p>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-slate-600" />
          <div>
            <p className="font-bold">This project has been completed.</p>
            <p className="text-xs text-slate-500">
              All targeted distribution cycles have finished successfully. Thank you to all volunteers and contributors.
            </p>
          </div>
        </div>
      )}

      {/* Real-Time Live Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Applications</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {project.stats?.totalApplications || 0}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Approved Beneficiaries</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {project.stats?.beneficiaries || 0}
              {project.targetBeneficiaries ? ` / ${project.targetBeneficiaries}` : ''}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Approved Volunteers</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {project.stats?.volunteers || 0}
              {project.targetVolunteers ? ` / ${project.targetVolunteers}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Application Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Full Description & Specifications */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Project Description</h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-6 rounded-3xl border border-slate-200/80">
              {project.description}
            </div>
          </div>

          {project.objectives && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Program Objectives</span>
              </h2>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.objectives}
              </div>
            </div>
          )}

          {project.eligibility && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Eligibility Criteria</span>
              </h2>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.eligibility}
              </div>
            </div>
          )}

          {project.requirements && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <span>Required Documentation / Skills</span>
              </h2>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.requirements}
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Facts Sidebar & Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-base">Key Program Facts</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-3 text-slate-600">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-900">Duration</p>
                  <p>
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : 'Immediate start'}{' '}
                    -{' '}
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : 'Ongoing'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-600">
                <Target className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-900">Target Group</p>
                  <p>Beneficiaries & Volunteers across Gaza</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-900">Validation Mode</p>
                  <p>Verified through local NGO committees</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {isRunning ? (
                project.userApplication ? (
                  <div className="p-3 bg-emerald-50 rounded-xl text-center text-xs text-emerald-800 font-bold">
                    Application on file ({project.userApplication.status})
                  </div>
                ) : (
                  <button
                    onClick={handleApplyClick}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Apply to This Project</span>
                  </button>
                )
              ) : (
                <button
                  disabled
                  className="w-full py-3 rounded-2xl bg-slate-100 text-slate-400 font-medium text-xs cursor-not-allowed flex items-center justify-center space-x-1.5"
                >
                  <Ban className="w-4 h-4" />
                  <span>{isPaused ? 'Applications Paused' : 'Project Completed'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      <ApplicationModal
        project={project}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => fetchProjectDetails()}
      />
    </div>
  );
};

