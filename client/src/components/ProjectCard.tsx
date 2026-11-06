import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Project, ProjectCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, HeartHandshake, ArrowRight, CheckCircle2, Clock, Ban } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onApplyClick?: (project: Project) => void;
}

const CATEGORY_COLORS: Record<ProjectCategory, { bg: string; text: string; label: string }> = {
  FOOD: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Food Aid' },
  WATER: { bg: 'bg-sky-100', text: 'text-sky-800', label: 'Water & Sanitation' },
  EDUCATION: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Education' },
  CLOTHING: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Clothing & Warmth' },
  SHELTER: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Shelter' },
  HEALTH: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Healthcare' },
  ORPHAN_SUPPORT: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Orphan Care' },
  TRAINING: { bg: 'bg-teal-100', text: 'text-teal-800', label: 'Youth Training' },
  ECONOMIC_SUPPORT: { bg: 'bg-emerald-100', text: 'text-emerald-900', label: 'Economic Support' },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onApplyClick }) => {
  const { isAuthenticated, setReturnUrl } = useAuth();
  const navigate = useNavigate();

  const categoryMeta = CATEGORY_COLORS[project.category] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    label: project.category,
  };

  const isPaused = project.status === 'PAUSED';
  const isCompleted = project.status === 'COMPLETED';
  const isRunning = project.status === 'RUNNING';

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isRunning) return;

    if (!isAuthenticated) {
      // Store return destination and intent so user returns directly to apply!
      setReturnUrl(`/projects/${project.slug}?apply=true`);
      navigate('/auth');
      return;
    }

    if (onApplyClick) {
      onApplyClick(project);
    } else {
      navigate(`/projects/${project.slug}?apply=true`);
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Cover Image & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={
            project.imageUrl ||
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
          }
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-md ${categoryMeta.bg} ${categoryMeta.text}`}
          >
            {categoryMeta.label}
          </span>

          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1 ${
              isRunning
                ? 'bg-emerald-500 text-white'
                : isPaused
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 text-slate-200'
            }`}
          >
            {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            {isPaused && <Clock className="w-3 h-3" />}
            {isCompleted && <CheckCircle2 className="w-3 h-3" />}
            <span>{project.status}</span>
          </span>
        </div>

        {/* Dates preview at bottom of photo */}
        {(project.startDate || project.endDate) && (
          <div className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Immediate'}
              {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
            </span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2.5">
            {project.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-5">
            {project.shortDescription}
          </p>
        </div>

        {/* Live Statistics */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Beneficiaries</p>
                <p className="text-sm font-bold text-slate-800">
                  {project.stats?.beneficiaries ?? 0}
                  {project.targetBeneficiaries ? ` / ${project.targetBeneficiaries}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-blue-100 text-blue-700">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Volunteers</p>
                <p className="text-sm font-bold text-slate-800">
                  {project.stats?.volunteers ?? 0}
                  {project.targetVolunteers ? ` / ${project.targetVolunteers}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 pt-1">
            <Link
              to={`/projects/${project.slug || project.id}`}
              className="flex-1 text-center py-2.5 px-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-700 font-semibold text-xs sm:text-sm transition flex items-center justify-center space-x-1.5"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {isRunning ? (
              <button
                onClick={handleApply}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition shadow-sm shadow-emerald-600/30 flex items-center justify-center space-x-1"
              >
                <span>Apply Now</span>
              </button>
            ) : (
              <button
                disabled
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-400 font-medium text-xs sm:text-sm cursor-not-allowed flex items-center justify-center space-x-1"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{isPaused ? 'Paused' : 'Completed'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

