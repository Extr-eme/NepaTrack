import { useEffect, useState } from 'react';
import { Map, List, Search, Filter } from 'lucide-react';
import { supabase, Project } from './lib/supabase';
import ProjectMap from './components/ProjectMap';
import ProjectList from './components/ProjectList';
import ProjectDetailsModal from './components/ProjectDetailsModal';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(projects.map(p => p.category))];
  const statuses = ['all', 'Planning', 'In Progress', 'Completed', 'On Hold'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/Logo.png"
                alt="NEPATRACK Logo"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold">
  <span className="text-[#CE1126]">Nepa</span><span className="text-[#003893]">Track</span>
</h1>
                <p className="text-xs text-slate-500 tracking-wide">Track Ongoing Projects Nationwide</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded transition-all font-medium ${
                  viewMode === 'map'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Map View</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded transition-all font-medium ${
                  viewMode === 'list'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List View</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by project name, location, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none bg-white"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-6 text-xs text-slate-600 font-medium">
            <span>Total Projects <span className="text-slate-900 font-bold">{projects.length}</span></span>
            <span>In Progress <span className="text-slate-900 font-bold">{projects.filter(p => p.status === 'In Progress').length}</span></span>
            <span>Completed <span className="text-slate-900 font-bold">{projects.filter(p => p.status === 'Completed').length}</span></span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
              <p className="mt-4 text-slate-600 font-medium">Loading projects...</p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'map' ? (
              <div className="h-[calc(100vh-250px)]">
                <ProjectMap
                  projects={projects.filter(project => {
                    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        project.description?.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
                    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
                    return matchesSearch && matchesStatus && matchesCategory;
                  })}
                  onProjectClick={setSelectedProject}
                />
              </div>
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <ProjectList
                  projects={projects}
                  onProjectClick={setSelectedProject}
                  searchTerm={searchTerm}
                  selectedStatus={selectedStatus}
                  selectedCategory={selectedCategory}
                />
              </div>
            )}
          </>
        )}
      </main>

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

export default App;
