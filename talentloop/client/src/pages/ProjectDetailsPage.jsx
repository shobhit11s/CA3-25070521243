import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  Clock,
  Shield,
  Star,
  User,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Send,
  Flag,
  Edit3,
  Users,
  Briefcase,
  ArrowLeft,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProposalModal from '../components/ProposalModal';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const isOwner = user && project && project.client?._id === user._id;

  const fetchProjectDetails = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);

      // If user is freelancer, check if they already submitted a proposal
      if (user && user.role === 'freelancer') {
        const propRes = await api.get('/proposals/my-proposals');
        const applied = propRes.data.proposals?.some(
          (p) => p.project?._id === id || p.project === id
        );
        setAlreadyApplied(applied);
      }

      // If user is owner or admin, fetch all proposals for this project
      if (user && (res.data.project.client?._id === user._id || user.role === 'admin')) {
        const propRes = await api.get(`/proposals/project/${id}`);
        setProposals(propRes.data.proposals || []);
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Project not found or error loading details.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id, user]);

  const handleAcceptProposal = async (proposalId) => {
    if (!window.confirm('Accept this proposal? This will hire the freelancer and activate the contract.')) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.put(`/proposals/${proposalId}/accept`);
      setFeedback({ type: 'success', message: res.data.message });
      await fetchProjectDetails();
      if (res.data.contractId) {
        navigate(`/contracts/${res.data.contractId}`);
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to accept proposal.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectProposal = async (proposalId) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/proposals/${proposalId}/reject`);
      setFeedback({ type: 'info', message: 'Proposal rejected.' });
      fetchProjectDetails();
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to reject proposal.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReportProject = async () => {
    const reason = window.prompt('Please enter the reason for reporting this project:');
    if (!reason) return;
    try {
      await api.post(`/projects/${id}/report`, { reason });
      setFeedback({ type: 'info', message: 'Thank you. This project has been flagged for admin moderation.' });
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to report project.' });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner" />
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Project not found</h2>
        <Link to="/projects" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb Back */}
        <div style={{ marginBottom: 20 }}>
          <Link
            to="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--navy-600)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>

        {feedback.message && (
          <div className={`alert alert-${feedback.type}`}>
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr', gap: 30, alignItems: 'start' }}>
          {/* Main Column */}
          <div>
            <div className="card" style={{ padding: '32px', marginBottom: 24 }}>
              {/* Category & Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span className="badge badge-violet">{project.category}</span>
                <span className={`badge badge-${project.status.toLowerCase().replace(' ', '')}`}>
                  {project.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--navy-400)', marginLeft: 'auto' }}>
                  Posted {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: '1.9rem', color: 'var(--navy-900)', marginBottom: 20 }}>
                {project.title}
              </h1>

              {/* Quick specs grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                  padding: '16px',
                  background: 'var(--navy-50)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 28,
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Budget ({project.budget?.type})
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-hover)' }}>
                    ${project.budget?.amount?.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Deadline
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-800)' }}>
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Flexible'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Proposals Received
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-800)' }}>
                    {project.proposalsCount || 0}
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', marginBottom: 12 }}>
                Project Overview & Requirements
              </h3>
              <div
                style={{
                  color: 'var(--navy-700)',
                  lineHeight: 1.8,
                  fontSize: '0.975rem',
                  whiteSpace: 'pre-line',
                  marginBottom: 30,
                }}
              >
                {project.description}
              </div>

              {/* Skills Required */}
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', marginBottom: 12 }}>
                Skills & Expertise Needed
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {project.skillsRequired?.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 14px',
                      background: 'var(--navy-100)',
                      color: 'var(--navy-800)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Owner's Proposal Review Section */}
            {isOwner && (
              <div className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--navy-900)' }}>
                    Proposals ({proposals.length})
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)' }}>
                    Review submissions and select your freelancer
                  </span>
                </div>

                {proposals.length === 0 ? (
                  <p style={{ color: 'var(--navy-500)', fontStyle: 'italic' }}>
                    No proposals submitted yet. Freelancers browsing the marketplace will apply soon.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {proposals.map((prop) => (
                      <div
                        key={prop._id}
                        style={{
                          border: '1px solid var(--navy-200)',
                          borderRadius: 'var(--radius-md)',
                          padding: '20px',
                          background: prop.status === 'accepted' ? '#f0fdf4' : 'var(--white)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="avatar" style={{ width: 44, height: 44 }}>
                              {prop.freelancer?.name?.charAt(0)}
                            </div>
                            <div>
                              <Link
                                to={`/freelancers/${prop.freelancer?._id}`}
                                style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy-900)' }}
                              >
                                {prop.freelancer?.name}
                              </Link>
                              <div style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
                                {prop.freelancer?.title || 'Freelancer'}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-hover)' }}>
                              ${prop.bidAmount}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)' }}>
                              in {prop.deliveryTimeDays} days
                            </div>
                          </div>
                        </div>

                        {/* Proposal Cover letter */}
                        <p style={{ fontSize: '0.9rem', color: 'var(--navy-700)', lineHeight: 1.6, marginBottom: 16 }}>
                          {prop.coverLetter}
                        </p>

                        {/* Actions for proposal */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className={`badge badge-${prop.status}`}>
                            {prop.status}
                          </span>

                          {project.status === 'Open' && prop.status === 'pending' && (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleRejectProposal(prop._id)}
                                disabled={actionLoading}
                              >
                                Reject
                              </button>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleAcceptProposal(prop._id)}
                                disabled={actionLoading}
                              >
                                Accept & Hire
                              </button>
                            </div>
                          )}

                          {prop.status === 'accepted' && (
                            <Link to={`/contracts/${project.activeContract}`} className="btn btn-primary btn-sm">
                              View Active Contract
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar: Client Info & Application Action */}
          <div>
            {/* Action Box */}
            <div className="card" style={{ padding: '24px', marginBottom: 24, textAlign: 'center' }}>
              {isOwner ? (
                <div>
                  <h4 style={{ marginBottom: 8 }}>You own this listing</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginBottom: 16 }}>
                    Manage incoming proposals or update project specifications
                  </p>
                  <Link to={`/projects/${project._id}/edit`} className="btn btn-secondary" style={{ width: '100%' }}>
                    <Edit3 size={16} /> Edit Project
                  </Link>
                </div>
              ) : user && user.role === 'freelancer' ? (
                <div>
                  {alreadyApplied ? (
                    <div style={{ padding: '12px 0' }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 'var(--radius-full)',
                          background: '#ecfdf5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 12px',
                        }}
                      >
                        <CheckCircle size={28} />
                      </div>
                      <h4 style={{ color: '#065f46', marginBottom: 4 }}>Proposal Submitted!</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginBottom: 14 }}>
                        You have already applied for this project. Track status in your dashboard.
                      </p>
                      <Link to="/freelancer/dashboard" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                        View in Dashboard
                      </Link>
                    </div>
                  ) : project.status === 'Open' ? (
                    <div>
                      <h4 style={{ marginBottom: 6 }}>Interested in this project?</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginBottom: 18 }}>
                        Submit your proposal with delivery timeline and rate
                      </p>
                      <button
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                        onClick={() => setIsProposalModalOpen(true)}
                      >
                        <Send size={18} /> Apply for Project
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--navy-500)', fontSize: '0.9rem' }}>
                      This project is currently <strong>{project.status}</strong> and no longer accepting proposals.
                    </div>
                  )}
                </div>
              ) : !user ? (
                <div>
                  <h4 style={{ marginBottom: 6 }}>Ready to submit a proposal?</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginBottom: 16 }}>
                    Join TalentLoop or sign in with your freelancer account
                  </p>
                  <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginBottom: 10 }}>
                    Sign In to Apply
                  </Link>
                  <Link to="/register?role=freelancer" className="btn btn-outline" style={{ width: '100%' }}>
                    Create Freelancer Account
                  </Link>
                </div>
              ) : (
                <div style={{ color: 'var(--navy-500)', fontSize: '0.85rem' }}>
                  Logged in as <strong>{user.role}</strong>. Only freelancers can apply to project listings.
                </div>
              )}
            </div>

            {/* Client Profile Card */}
            <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--navy-900)', marginBottom: 16 }}>
                About the Client
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div className="avatar" style={{ width: 48, height: 48, fontSize: '1.1rem' }}>
                  {project.client?.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{project.client?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)' }}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {project.client?.location || 'Remote'}
                  </div>
                </div>
              </div>

              {project.client?.bio && (
                <p style={{ fontSize: '0.85rem', color: 'var(--navy-600)', lineHeight: 1.5, marginBottom: 16 }}>
                  {project.client.bio}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--navy-100)', paddingTop: 12, fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--navy-500)' }}>Client Rating:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: '#d97706' }}>
                  <Star size={14} fill="#d97706" /> {project.client?.rating || 5.0} ({project.client?.reviewsCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Flag / Report */}
            {user && (
              <button
                type="button"
                onClick={handleReportProject}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: 'var(--navy-400)',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                <Flag size={14} /> Report inappropriate listing
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {project && (
        <ProposalModal
          project={project}
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          onSuccess={(msg) => {
            setFeedback({ type: 'success', message: msg });
            setAlreadyApplied(true);
            fetchProjectDetails();
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetailsPage;
