import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Project, LiveStats } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { ApplicationModal } from '../components/ApplicationModal';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  Users,
  Compass,
  ArrowRight,
  Droplets,
  BookOpen,
  Tent,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';

const IMPACT_SLIDES = [
  {
    title: 'Safe Schools & Tents Supported',
    metric: '18 Learning Encampments',
    description: 'Providing uninterrupted literacy, math circles, and trauma counseling for 2,400+ displaced children across Khan Younis and Deir al-Balah.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    tag: 'Education Continuity',
  },
  {
    title: 'Families Assisted with Food & Aid',
    metric: '12,500+ Monthly Rations',
    description: 'Direct door-to-tent dry protein, flour, and infant nutrition packages delivered with cardless biometric dignity.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    tag: 'Food Security',
  },
  {
    title: 'Winterized Tents & Insulated Flooring',
    metric: '4,200 Weatherproof Units',
    description: 'Elevated wooden sub-floors, rainproof tarps, and heavy wool blankets shielding families from coastal mud and winter storms.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    tag: 'Emergency Shelter',
  },
  {
    title: 'Solar Potable Water Wells Rehabilitated',
    metric: '6 Municipal Wells Restored',
    description: 'Off-grid solar reverse osmosis stations pumping 180,000 liters of safe drinking water daily to neighboring camp clusters.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    tag: 'Clean Water',
  },
  {
    title: 'Youth Digital & Remote Work Training',
    metric: '120 Graduates Mentored',
    description: 'Empowering unemployed software engineers and digital translators in Gaza to secure international freelance work and livelihoods.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    tag: 'Economic Resilience',
  },
];

export const HomePage: React.FC = () => {
  const { isAuthenticated, setReturnUrl } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<LiveStats>({
    totalProjects: 8,
    totalBeneficiaries: 3,
    totalVolunteers: 3,
    communitiesServed: 5,
    totalApprovedApplications: 5,
    totalRunningProjects: 6,
  });

  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProjectForApply, setSelectedProjectForApply] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, featRes] = await Promise.all([
          api.get('/public/stats'),
          api.get('/projects/featured'),
        ]);

        if (statsRes.data?.success) {
          setStats(statsRes.data.stats);
        }
        if (featRes.data?.success) {
          setFeaturedProjects(featRes.data.projects);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchData();
  }, []);

  // Impact Carousel auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IMPACT_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleApplyClick = (project: Project) => {
    if (!isAuthenticated) {
      setReturnUrl(`/projects/${project.slug}?apply=true`);
      navigate('/auth');
      return;
    }
    setSelectedProjectForApply(project);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-20 pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Senabil Community Impact Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Building Sustainable Impact <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              Across Gaza
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Empowering individuals, supporting families, and transforming communities through
            education, economic empowerment, and humanitarian assistance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/projects"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Projects</span>
            </Link>

            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base transition border border-white/15 backdrop-blur-md flex items-center justify-center space-x-2"
            >
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              <span>Join Us</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Live Statistics Section (Calculated directly from DB records) */}
      <section className="-mt-16 relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-900/10 border border-slate-200/80">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Live Verified Database Metrics
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              Real-Time Humanitarian Impact
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition group">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {stats.totalProjects}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Total Projects
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition group">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {stats.totalBeneficiaries}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Total Beneficiaries
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition group">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {stats.totalVolunteers}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Total Volunteers
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition group">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {stats.communitiesServed}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Communities Served
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Impact Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Community Progress
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Field Impact Carousel
            </h2>
          </div>

          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev === 0 ? IMPACT_SLIDES.length - 1 : prev - 1))
              }
              className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % IMPACT_SLIDES.length)
              }
              className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl min-h-[420px] md:min-h-[460px] flex items-center">
          <img
            src={IMPACT_SLIDES[currentSlide].image}
            alt={IMPACT_SLIDES[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

          <div className="relative max-w-2xl p-8 sm:p-12 lg:p-16 text-white space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-slate-950">
              {IMPACT_SLIDES[currentSlide].tag}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">
              {IMPACT_SLIDES[currentSlide].metric}
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              {IMPACT_SLIDES[currentSlide].title}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {IMPACT_SLIDES[currentSlide].description}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 right-6 flex items-center space-x-2">
            {IMPACT_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Active Relief Initiatives
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Featured Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition group"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onApplyClick={handleApplyClick}
              />
            ))}
          </div>
        )}

        <div className="text-center pt-12">
          <Link
            to="/projects"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition"
          >
            <span>Explore All Relief Programs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Application Form Modal */}
      <ApplicationModal
        project={selectedProjectForApply}
        isOpen={!!selectedProjectForApply}
        onClose={() => setSelectedProjectForApply(null)}
      />
    </div>
  );
};

