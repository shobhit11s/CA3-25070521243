import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Briefcase,
  AlertCircle,
  DollarSign,
  Search,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const [propRes, contRes] = await Promise.all([
          api.get('/proposals/my-proposals'),
          api.get('/contracts'),
        ]);
        setProposals(propRes.data.proposals || []);
        setContracts(contRes.data.contracts || []);
      } catch (err) {
        setError('Failed to load freelancer dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancerData();
  }, []);

  const activeContracts = contracts.filter((c) => c.status === 'active');
  const completedContracts = contracts.filter((c) => c.status === 'completed');
  const pendingProposals = proposals.filter((p) => p.status === 'pending');

  const totalEarnings = completedContracts.reduce((acc, c) => acc + (c.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner" />
        <p>Loading freelancer workspace...</p>
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
              Freelancer Workspace
            </h1>
            <p style={{ color: 'var(--navy-600)', fontSize: '1rem' }}>
              Track active milestones, check proposal status, and land new contracts
            </p>
          </div>

          <Link to="/projects" className="btn btn-primary btn-lg">
            <Search size={18} /> Browse Open Projects
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
              <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Active Projects</span>
              <div style={{ padding: 8, background: '#eff6ff', borderRadius: 'var(--radius-sm)', color: '#2563eb' }}>
                <Clock size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              {activeContracts.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
              Currently ongoing
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Proposals Sent</span>
              <div style={{ padding: 8, background: '#f5f3ff', borderRadius: 'var(--radius-sm)', color: '#7c3aed' }}>
                <Send size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-hover)' }}>
              {proposals.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
              {pendingProposals.length} pending decisions
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Completed</span>
              <div style={{ padding: 8, background: '#ecfdf5', borderRadius: 'var(--radius-sm)', color: '#059669' }}>
                <CheckCircle size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              {completedContracts.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
              Successful contracts
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Client Rating</span>
              <div style={{ padding: 8, background: '#fffbeb', borderRadius: 'var(--radius-sm)', color: '#d97706' }}>
                <Star size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706' }}>
              {user?.rating?.toFixed(1) || '5.0'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
              {user?.reviewsCount || 0} verified reviews
            </div>
          </div>
        </div>

        {/* Section 1: Active In-Progress Contracts */}
        <div className="card" style={{ padding: '28px', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
                Active Contracts ({activeContracts.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginTop: 2 }}>
                Deliver milestones, submit progress reports, and collaborate with clients
              </p>
            </div>
            <Link to="/my-projects" className="btn btn-outline btn-sm">
              All Contracts <ArrowRight size={14} />
            </Link>
          </div>

          {activeContracts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--navy-500)' }}>
              <p style={{ marginBottom: 14 }}>No active contracts right now.</p>
              <Link to="/projects" className="btn btn-primary btn-sm">
                Apply for New Projects
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {activeContracts.map((contract) => (
                <div
                  key={contract._id}
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
                  <div style={{ minWidth: 260 }}>
                    <span className="badge badge-inprogress" style={{ marginBottom: 6 }}>
                      Active Contract
                    </span>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--navy-900)', marginBottom: 4 }}>
                      {contract.project?.title}
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--navy-600)' }}>
                      Client: <strong>{contract.client?.name}</strong> • Total Value: ${contract.totalAmount}
                    </div>
                  </div>

                  <Link to={`/contracts/${contract._id}`} className="btn btn-primary btn-sm">
                    Open Contract & Deliverables <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Submitted Proposals Tracker */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
                Submitted Proposals ({proposals.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginTop: 2 }}>
                Track acceptance and status for your applications
              </p>
            </div>
          </div>

          {proposals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--navy-500)' }}>
              <p>You haven't submitted any proposals yet.</p>
              <Link to="/projects" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                Browse Projects Now
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {proposals.map((prop) => (
                <div
                  key={prop._id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--navy-200)',
                    background: prop.status === 'accepted' ? '#f0fdf4' : 'var(--white)',
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span className={`badge badge-${prop.status}`}>
                        {prop.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--navy-400)' }}>
                        Applied on {new Date(prop.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      to={`/projects/${prop.project?._id}`}
                      style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)' }}
                    >
                      {prop.project?.title || 'Project Listing'}
                    </Link>

                    <div style={{ fontSize: '0.85rem', color: 'var(--navy-600)', marginTop: 4 }}>
                      Your Bid: <strong>${prop.bidAmount}</strong> • Delivery: {prop.deliveryTimeDays} days
                    </div>
                  </div>

                  {prop.status === 'accepted' && prop.project?.activeContract && (
                    <Link to={`/contracts/${prop.project.activeContract}`} className="btn btn-primary btn-sm">
                      Go to Active Contract <ArrowRight size={14} />
                    </Link>
                  )}

                  {prop.status === 'pending' && (
                    <Link to={`/projects/${prop.project?._id}`} className="btn btn-outline btn-sm">
                      View Listing
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
