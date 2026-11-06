import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Project, ProjectCategory, ProjectStatus } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { ApplicationModal } from '../components/ApplicationModal';
import { Search, Filter, Compass, SlidersHorizontal, RefreshCw } from 'lucide-react';

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'FOOD', label: 'Food Aid' },
  { value: 'WATER', label: 'Water & Sanitation' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'CLOTHING', label: 'Clothing & Warmth' },
  { value: 'SHELTER', label: 'Shelter' },
  { value: 'HEALTH', label: 'Healthcare' },
  { value: 'ORPHAN_SUPPORT', label: 'Orphan Support' },
  { value: 'TRAINING', label: 'Youth Training' },
  { value: 'ECONOMIC_SUPPORT', label: 'Economic Support' },
];

const STATUSES: { value: string; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'RUNNING', label: 'Running (Active)' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'COMPLETED', label: 'Completed' },
];

export const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL');
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectForApply, setSelectedProjectForApply] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'ALL') params.category = category;
      if (status !== 'ALL') params.status = status;

      const res = await api.get('/projects', { params });
      if (res.data?.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('ALL');
    setStatus('ALL');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Title & Subtitle */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Gaza Humanitarian Programs
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 tracking-tight">
          Relief & Community Projects
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
          Browse active humanitarian interventions across the Gaza Strip. Filter by sector or status, review project scopes, and submit your beneficiary or volunteer application.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-700 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-700 bg-white"
            >
              {STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit / Filter Buttons */}
          <div className="md:col-span-2 flex items-center space-x-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition shadow-sm"
            >
              Apply Filter
            </button>
            {(search || category !== 'ALL' || status !== 'ALL') && (
              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-2.5 rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Category Badges */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-bold uppercase text-[10px] whitespace-nowrap mr-1">
            Sectors:
          </span>
          {CATEGORIES.slice(1).map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(category === cat.value ? 'ALL' : cat.value)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition ${
                category === cat.value
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Projects Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, sector category, or status filter to see other initiatives.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onApplyClick={(p) => setSelectedProjectForApply(p)}
            />
          ))}
        </div>
      )}

      {/* Application Form Modal */}
      <ApplicationModal
        project={selectedProjectForApply}
        isOpen={!!selectedProjectForApply}
        onClose={() => setSelectedProjectForApply(null)}
        onSuccess={() => fetchProjects()}
      />
    </div>
  );
};

