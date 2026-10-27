import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, AlertCircle } from 'lucide-react';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';

const CATEGORIES = [
  'All',
  'Web Development',
  'Graphic Design',
  'Video Editing',
  'Content Creation',
  'Digital Marketing',
];

const ExploreProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [minBudget, setMinBudget] = useState(searchParams.get('minBudget') || '');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('maxBudget') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(1);

  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch projects whenever filter states change
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          page,
          limit: 9,
          sort,
          status: 'Open',
        };
        if (search) params.search = search;
        if (category && category !== 'All') params.category = category;
        if (type) params.type = type;
        if (minBudget) params.minBudget = minBudget;
        if (maxBudget) params.maxBudget = maxBudget;

        const res = await api.get('/projects', { params });
        setProjects(res.data.projects || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError('Failed to fetch projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [search, category, type, minBudget, maxBudget, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setType('');
    setMinBudget('');
    setMaxBudget('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--navy-900)', marginBottom: 8 }}>
            Explore Projects
          </h1>
          <p style={{ color: 'var(--navy-600)', fontSize: '1.05rem' }}>
            Discover open client listings, submit proposals, and land high-paying contracts
          </p>
        </div>

        {/* Search Bar & Primary Filters */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: 30 }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
              <Search size={18} color="var(--navy-400)" style={{ position: 'absolute', top: 12, left: 14 }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="Search by keywords, title, skills (e.g. React, Figma, SEO)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleResetFilters} title="Reset all filters">
              <RotateCcw size={16} /> Reset
            </button>
          </form>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${category === cat ? 'var(--primary)' : 'var(--navy-200)'}`,
                  background: category === cat ? 'var(--primary)' : 'var(--white)',
                  color: category === cat ? 'var(--white)' : 'var(--navy-700)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary filter bar: Budget Type, Range & Sort */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              marginTop: 18,
              paddingTop: 16,
              borderTop: '1px solid var(--navy-100)',
              fontSize: '0.875rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              {/* Type */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--navy-500)', fontWeight: 600 }}>Type:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 12px' }}
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Types</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>

              {/* Min Budget */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--navy-500)', fontWeight: 600 }}>Min $:</span>
                <input
                  type="number"
                  placeholder="Min"
                  className="form-input"
                  style={{ width: 90, padding: '6px 10px' }}
                  value={minBudget}
                  onChange={(e) => {
                    setMinBudget(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Max Budget */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--navy-500)', fontWeight: 600 }}>Max $:</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="form-input"
                  style={{ width: 90, padding: '6px 10px' }}
                  value={maxBudget}
                  onChange={(e) => {
                    setMaxBudget(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {/* Sorting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--navy-500)', fontWeight: 600 }}>Sort by:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '6px 12px' }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
                <option value="proposals">Most Proposals</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--navy-600)' }}>
            Showing <strong>{projects.length}</strong> of <strong>{total}</strong> open projects
          </div>
        </div>

        {/* Projects Grid or State */}
        {loading ? (
          <div className="loading-container">
            <span className="spinner" />
            <p>Searching open projects...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-800)', marginBottom: 8 }}>
              No projects found matching your criteria
            </h3>
            <p style={{ color: 'var(--navy-500)', maxWidth: 440, margin: '0 auto 20px' }}>
              Try broadening your keyword search, clearing category filters, or resetting budget ranges.
            </p>
            <button className="btn btn-primary" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid-3" style={{ marginBottom: 40 }}>
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 20 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${p === page ? 'var(--primary)' : 'var(--navy-200)'}`,
                      background: p === page ? 'var(--primary)' : 'var(--white)',
                      color: p === page ? 'var(--white)' : 'var(--navy-700)',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExploreProjectsPage;
