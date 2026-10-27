import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Send,
  MessageSquare,
  Star,
  DollarSign,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  X,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';

const ContractDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modals state
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeMilestoneForSubmit, setActiveMilestoneForSubmit] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // New Milestone Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const fetchContract = async () => {
    try {
      const res = await api.get(`/contracts/${id}`);
      setContract(res.data.contract);
      setMilestones(res.data.milestones || []);
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to fetch contract details.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [id]);

  const isClient = user && contract && contract.client?._id === user._id;
  const isFreelancer = user && contract && contract.freelancer?._id === user._id;

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/contracts/${id}/milestones`, {
        title: newTitle,
        description: newDesc,
        amount: Number(newAmount),
        dueDate: newDueDate || null,
      });
      setIsAddMilestoneOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewAmount('');
      setNewDueDate('');
      setFeedback({ type: 'success', message: 'Milestone added successfully!' });
      fetchContract();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to add milestone.' });
    }
  };

  const handleUpdateMilestoneStatus = async (milestoneId, status, notes = '') => {
    try {
      await api.put(`/contracts/milestones/${milestoneId}`, { status, submissionNotes: notes });
      setFeedback({ type: 'success', message: `Milestone marked as ${status}!` });
      fetchContract();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to update milestone.' });
    }
  };

  const handleOpenSubmitModal = (m) => {
    setActiveMilestoneForSubmit(m);
    setSubmissionNotes(m.submissionNotes || '');
    setIsSubmitModalOpen(true);
  };

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!activeMilestoneForSubmit) return;
    await handleUpdateMilestoneStatus(activeMilestoneForSubmit._id, 'Submitted', submissionNotes);
    setIsSubmitModalOpen(false);
  };

  const handleCompleteContract = async () => {
    if (!window.confirm('Mark this entire contract as Completed? This will release final deliverables.')) {
      return;
    }
    try {
      await api.put(`/contracts/${id}/complete`);
      setFeedback({ type: 'success', message: 'Contract completed successfully! You can now leave a review.' });
      fetchContract();
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to complete contract.' });
    }
  };

  const handleMessagePartner = async () => {
    const partnerId = isClient ? contract.freelancer?._id : contract.client?._id;
    try {
      const res = await api.post('/messages/conversations', {
        recipientId: partnerId,
        projectId: contract.project?._id,
      });
      navigate('/messages', { state: { activeConversationId: res.data.conversation._id } });
    } catch (err) {
      alert('Could not open conversation.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner" />
        <p>Loading contract details...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Contract Not Found</h2>
        <Link to="/my-projects" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to Contracts
        </Link>
      </div>
    );
  }

  const approvedAmount = milestones
    .filter((m) => m.status === 'Approved')
    .reduce((acc, m) => acc + (m.amount || 0), 0);

  const progressPercent = Math.min(
    100,
    Math.round((approvedAmount / (contract.totalAmount || 1)) * 100)
  );

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: 20 }}>
          <Link
            to="/my-projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--navy-600)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to My Projects
          </Link>
        </div>

        {feedback.message && (
          <div className={`alert alert-${feedback.type}`}>
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Contract Header Card */}
        <div className="card" style={{ padding: '32px', marginBottom: 28 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className={`badge badge-${contract.status}`}>{contract.status}</span>
              <span className="badge badge-violet">{contract.project?.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)' }}>
                Started {new Date(contract.startDate).toLocaleDateString()}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={handleMessagePartner}>
                <MessageSquare size={16} /> Message {isClient ? 'Freelancer' : 'Client'}
              </button>

              {isClient && contract.status === 'active' && (
                <button className="btn btn-primary btn-sm" onClick={handleCompleteContract}>
                  <CheckCircle size={16} /> Complete Contract
                </button>
              )}

              {contract.status === 'completed' && (
                <button className="btn btn-primary btn-sm" onClick={() => setIsReviewModalOpen(true)}>
                  <Star size={16} /> Leave a Review
                </button>
              )}
            </div>
          </div>

          <h1 style={{ fontSize: '1.8rem', color: 'var(--navy-900)', marginBottom: 16 }}>
            {contract.project?.title}
          </h1>

          {/* Parties & Escrow Progress */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
              padding: '20px',
              background: 'var(--navy-50)',
              borderRadius: 'var(--radius-md)',
              marginTop: 16,
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                Client
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy-900)' }}>
                {contract.client?.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)' }}>{contract.client?.email}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                Assigned Freelancer
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy-900)' }}>
                {contract.freelancer?.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)' }}>{contract.freelancer?.title}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Contract Budget
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--primary-hover)' }}>
                ${contract.totalAmount}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)' }}>
                ${approvedAmount} Approved ({progressPercent}%)
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--navy-600)', marginBottom: 6 }}>
              <span>Milestone Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--navy-200)', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary), #10b981)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Milestones List Card */}
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--navy-900)' }}>
                Project Milestones & Deliverables ({milestones.length})
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginTop: 2 }}>
                Track deliverables, submit progress, and approve milestones
              </p>
            </div>

            {isClient && contract.status === 'active' && (
              <button className="btn btn-secondary btn-sm" onClick={() => setIsAddMilestoneOpen(true)}>
                <PlusCircle size={15} /> Add Milestone
              </button>
            )}
          </div>

          {milestones.length === 0 ? (
            <p style={{ color: 'var(--navy-500)', fontStyle: 'italic' }}>
              No milestones have been defined yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {milestones.map((m, idx) => (
                <div
                  key={m._id}
                  style={{
                    border: '1px solid var(--navy-200)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    background: m.status === 'Approved' ? '#f0fdf4' : 'var(--white)',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>
                          #{idx + 1}
                        </span>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)' }}>{m.title}</h3>
                        <span className={`badge badge-${m.status.toLowerCase().replace(' ', '')}`}>
                          {m.status}
                        </span>
                      </div>
                      {m.dueDate && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={13} /> Due: {new Date(m.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                      ${m.amount}
                    </div>
                  </div>

                  {m.description && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--navy-600)', marginBottom: 14, lineHeight: 1.6 }}>
                      {m.description}
                    </p>
                  )}

                  {/* Submission Notes */}
                  {m.submissionNotes && (
                    <div
                      style={{
                        padding: '12px 14px',
                        background: 'var(--navy-50)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        color: 'var(--navy-800)',
                        marginBottom: 14,
                        borderLeft: '3px solid var(--primary)',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--navy-500)', marginBottom: 2 }}>
                        Freelancer Submission Notes:
                      </div>
                      {m.submissionNotes}
                    </div>
                  )}

                  {/* Action buttons based on Role & State */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--navy-100)', paddingTop: 12 }}>
                    {/* Freelancer actions */}
                    {isFreelancer && contract.status === 'active' && (
                      <>
                        {m.status === 'Pending' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleUpdateMilestoneStatus(m._id, 'In Progress')}
                          >
                            Mark In Progress
                          </button>
                        )}
                        {['Pending', 'In Progress'].includes(m.status) && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenSubmitModal(m)}
                          >
                            <Send size={14} /> Submit Deliverable
                          </button>
                        )}
                      </>
                    )}

                    {/* Client actions */}
                    {isClient && contract.status === 'active' && (
                      <>
                        {m.status === 'Submitted' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleUpdateMilestoneStatus(m._id, 'Approved')}
                          >
                            <CheckCircle size={14} /> Approve & Release (${m.amount})
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {isAddMilestoneOpen && (
        <div className="modal-overlay" onClick={() => setIsAddMilestoneOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)' }}>Add New Milestone</h3>
              <button className="modal-close" onClick={() => setIsAddMilestoneOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateMilestone}>
              <div className="form-group">
                <label className="form-label">Milestone Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Design & Prototype Sign-off"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Amount ($ USD)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    placeholder="e.g. 500"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deliverable Scope</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Details of what must be submitted to complete this milestone..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddMilestoneOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Deliverable Modal */}
      {isSubmitModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSubmitModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)' }}>
                Submit Deliverable: {activeMilestoneForSubmit?.title}
              </h3>
              <button className="modal-close" onClick={() => setIsSubmitModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverable}>
              <div className="form-group">
                <label className="form-label">Submission Details & Links</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  placeholder="Provide repository links, preview links, Figma URLs, or details of completed work for client review..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsSubmitModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Send to Client for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {contract && (
        <ReviewModal
          contract={contract}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={(msg) => setFeedback({ type: 'success', message: msg })}
        />
      )}
    </div>
  );
};

export default ContractDetailsPage;
