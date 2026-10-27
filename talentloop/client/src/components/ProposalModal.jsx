import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ProposalModal = ({ project, isOpen, onClose, onSuccess }) => {
  const [bidAmount, setBidAmount] = useState(project?.budget?.amount || '');
  const [deliveryTimeDays, setDeliveryTimeDays] = useState(7);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!bidAmount || Number(bidAmount) <= 0) {
      setError('Please specify a valid bid amount.');
      return;
    }

    if (!deliveryTimeDays || Number(deliveryTimeDays) < 1) {
      setError('Delivery estimate must be at least 1 day.');
      return;
    }

    if (!coverLetter.trim() || coverLetter.trim().length < 20) {
      setError('Please write a cover letter with at least 20 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/proposals', {
        projectId: project._id,
        bidAmount: Number(bidAmount),
        deliveryTimeDays: Number(deliveryTimeDays),
        coverLetter: coverLetter.trim(),
      });

      onSuccess(res.data.message || 'Proposal submitted successfully!');
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit proposal. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>Submit Proposal</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginTop: 2 }}>
              Project: <strong>{project.title}</strong>
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Your Bid Amount ($ USD)</label>
              <input
                type="number"
                min="5"
                className="form-input"
                placeholder="e.g. 800"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--navy-500)' }}>
                Client Budget: ${project.budget?.amount} ({project.budget?.type})
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Time (Days)</label>
              <input
                type="number"
                min="1"
                max="365"
                className="form-input"
                placeholder="e.g. 7"
                value={deliveryTimeDays}
                onChange={(e) => setDeliveryTimeDays(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--navy-500)' }}>
                Estimated days to completion
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Letter</label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Introduce yourself, describe your relevant experience, and outline your approach to solving this project..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--navy-400)', marginTop: 4 }}>
              <span>Minimum 20 characters</span>
              <span>{coverLetter.length} chars</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} /> Submit Proposal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalModal;
