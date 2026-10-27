import React, { useState } from 'react';
import { X, Star, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ReviewModal = ({ contract, isOpen, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!comment.trim() || comment.trim().length < 10) {
      setError('Please provide feedback with at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/reviews', {
        contractId: contract._id,
        rating,
        comment: comment.trim(),
      });

      onSuccess(res.data.message || 'Review submitted successfully!');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>Leave a Review</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginTop: 2 }}>
              Project: <strong>{contract?.project?.title}</strong>
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
          {/* Star Rating Picker */}
          <div className="form-group" style={{ textAlign: 'center', margin: '20px 0' }}>
            <label className="form-label" style={{ marginBottom: 12 }}>Rating</label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={36}
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                    color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--navy-800)', marginTop: 8 }}>
              {rating === 5 && 'Outstanding (5.0)'}
              {rating === 4 && 'Very Good (4.0)'}
              {rating === 3 && 'Average (3.0)'}
              {rating === 2 && 'Below Expectations (2.0)'}
              {rating === 1 && 'Unsatisfactory (1.0)'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Feedback / Testimonial</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Detail your experience working together on deliverables, communication, quality, and timelines..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--navy-400)' }}>
              Minimum 10 characters ({comment.length} chars)
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
