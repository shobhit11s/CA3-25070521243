import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Trash2,
  Edit,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [projRes, contRes] = await Promise.all([
        api.get('/projects/my-projects'),
        api.get('/contracts'),
      ]);
      setProjects(projRes.data.projects || []);
      setContracts(contRes.data.contracts || []);
    } catch (err) {
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  const openProjects = projects.filter((p) => p.status === 'Open');
  const activeContracts = contracts.filter((c) => c.status === 'active');
  const completedContracts = contracts.filter((c) => c.status === 'completed');

  const totalProposalsCount = projects.reduce((acc, p) => acc + (p.proposalsCount || 0), 0);
  const totalSpend = contracts.reduce((acc, c) => acc + (c.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner" />
        <p>Loading client dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Welcome Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--navy-900)', marginBottom: 6 }}>
              Welcome back, {user?.name}
            </h1>
            <p style={{ color: 'var(--navy-600)', fontSize: '1rem' }}>
              Client Workspace • Manage listings, hire talent, and track milestone deliverables
            </p>
          </div>

          <Link to="/create-project" className="btn btn-primary btn-lg">
            <PlusCircle size={18} /> Post a New Project
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: 36 }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Open Listings</span>
              <div style={{ padding: 8, background: '#eff6ff', borderRadius: 'var(--radius-sm)', color: '#2563eb' }}>
                <Briefcase size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              {openProjects.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
              Accepting proposals
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Active Contracts</span>
              <div style={{ padding: 8, background: '#ecfdf5', borderRadius: 'var(--radius-sm)', color: '#059669' }}>
                <Clock size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              {activeContracts.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
              Freelancers currently working
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Total Proposals</span>
              <div style={{ padding: 8, background: '#f5f3ff', borderRadius: 'var(--radius-sm)', color: '#7c3aed' }}>
                <Users size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-hover)' }}>
              {totalProposalsCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
              Across all listings
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Total Value</span>
              <div style={{ padding: 8, background: '#fffbeb', borderRadius: 'var(--radius-sm)', color: '#d97706' }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              ${totalSpend.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
              {completedContracts.length} completed contracts
            </div>
          </div>
        </div>

        {/* Section 1: Active In-Progress Contracts */}
        {activeContracts.length > 0 && (
          <div className="card" style={{ padding: '28px', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
                Active Ongoing Work ({activeContracts.length})
              </h3>
              <Link to="/my-projects" className="btn btn-outline btn-sm">
                View All Contracts <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activeContracts.map((contract) => (
                <div
                  key={contract._id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--navy-200)',
                    background: 'var(--navy-50)',
                    gap: 16,
                  }}
                >
                  <div style={{ minWidth: 260 }}>
                    <span className="badge badge-inprogress" style={{ marginBottom: 6 }}>
                      In Progress
                    </span>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--navy-900)', marginBottom: 4 }}>
                      {contract.project?.title}
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--navy-600)' }}>
                      Freelancer: <strong>{contract.freelancer?.name}</strong> • ${contract.totalAmount}
                    </div>
                  </div>

                  <Link to={`/contracts/${contract._id}`} className="btn btn-primary btn-sm">
                    Open Contract & Milestones <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Manage Open & Listed Projects */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
                Your Project Listings ({projects.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginTop: 2 }}>
                Review incoming proposals, hire candidates, or update descriptions
              </p>
            </div>
            <Link to="/create-project" className="btn btn-secondary btn-sm">
              <PlusCircle size={15} /> Create Listing
            </Link>
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: 'var(--navy-500)', marginBottom: 16 }}>
                You haven't posted any projects yet.
              </p>
              <Link to="/create-project" className="btn btn-primary">
                Post Your First Project
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {projects.map((proj) => (
                <div
                  key={proj._id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--navy-200)',
                    background: 'var(--white)',
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span className="badge badge-violet">{proj.category}</span>
                      <span className={`badge badge-${proj.status.toLowerCase().replace(' ', '')}`}>
                        {proj.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--navy-400)' }}>
                        {new Date(proj.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      to={`/projects/${proj._id}`}
                      style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)' }}
                    >
                      {proj.title}
                    </Link>

                    <div style={{ fontSize: '0.85rem', color: 'var(--navy-600)', marginTop: 4 }}>
                      Budget: <strong>${proj.budget?.amount}</strong> ({proj.budget?.type}) •{' '}
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        {proj.proposalsCount || 0} Proposals
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Link to={`/projects/${proj._id}`} className="btn btn-primary btn-sm">
                      View Proposals ({proj.proposalsCount || 0})
                    </Link>
                    <Link to={`/projects/${proj._id}/edit`} className="btn btn-secondary btn-sm" title="Edit Listing">
                      <Edit size={14} />
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProject(proj._id, proj.title)}
                      title="Delete Listing"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
