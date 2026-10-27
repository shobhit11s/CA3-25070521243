import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ArrowRight, Briefcase } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyProjectsPage = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isClient = user?.role === 'client';

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await api.get('/contracts');
        setContracts(res.data.contracts || []);
      } catch (err) {
        setError('Failed to fetch contracts.');
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const filteredContracts = contracts.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner" />
        <p>Loading your project contracts...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
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
              {isClient ? 'My Project Contracts' : 'My Active Work & Contracts'}
            </h1>
            <p style={{ color: 'var(--navy-600)', fontSize: '1rem' }}>
              Track milestones, review submissions, and manage ongoing projects
            </p>
          </div>

          {isClient && (
            <Link to="/create-project" className="btn btn-primary">
              Post Another Project
            </Link>
          )}
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--navy-200)', paddingBottom: 12 }}>
          {['all', 'active', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'capitalize',
                color: statusFilter === tab ? 'var(--primary)' : 'var(--navy-600)',
                backgroundColor: statusFilter === tab ? 'var(--primary-light)' : 'transparent',
              }}
            >
              {tab === 'all' ? 'All Contracts' : tab} ({contracts.filter((c) => tab === 'all' || c.status === tab).length})
            </button>
          ))}
        </div>

        {filteredContracts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Briefcase size={40} color="var(--navy-300)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-800)', marginBottom: 8 }}>
              No contracts found in this view
            </h3>
            <p style={{ color: 'var(--navy-500)', marginBottom: 20 }}>
              {isClient
                ? 'Accept a proposal on your projects to start an active contract.'
                : 'Browse projects and submit proposals to win new contracts.'}
            </p>
            <Link to={isClient ? '/client/dashboard' : '/projects'} className="btn btn-primary">
              {isClient ? 'Go to Client Dashboard' : 'Explore Open Projects'}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredContracts.map((contract) => {
              const otherUser = isClient ? contract.freelancer : contract.client;

              return (
                <div
                  key={contract._id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '24px',
                    gap: 20,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span className="badge badge-violet">{contract.project?.category}</span>
                      <span className={`badge badge-${contract.status}`}>
                        {contract.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--navy-400)' }}>
                        Started {new Date(contract.startDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: 6 }}>
                      {contract.project?.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.875rem', color: 'var(--navy-600)' }}>
                      <span>
                        {isClient ? 'Hired Freelancer:' : 'Client:'}{' '}
                        <strong>{otherUser?.name || 'User'}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Contract Value: <strong>${contract.totalAmount}</strong>
                      </span>
                    </div>
                  </div>

                  <Link to={`/contracts/${contract._id}`} className="btn btn-primary">
                    Manage Milestones & Work <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjectsPage;
