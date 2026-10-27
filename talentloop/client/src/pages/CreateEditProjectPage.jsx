import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, AlertCircle, Save, PlusCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Web Development',
  'Graphic Design',
  'Video Editing',
  'Content Creation',
  'Digital Marketing',
];

const CreateEditProjectPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [budgetType, setBudgetType] = useState('fixed');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('Open');

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          const res = await api.get(`/projects/${id}`);
          const p = res.data.project;

          // Check ownership or admin
          if (p.client?._id !== user?._id && user?.role !== 'admin') {
            setError('Not authorized to edit this project listing.');
            return;
          }

          setTitle(p.title || '');
          setDescription(p.description || '');
          setCategory(p.category || CATEGORIES[0]);
          setBudgetType(p.budget?.type || 'fixed');
          setBudgetAmount(p.budget?.amount || '');
          setSkillsRequired(p.skillsRequired?.join(', ') || '');
          setStatus(p.status || 'Open');
          if (p.deadline) {
            setDeadline(new Date(p.deadline).toISOString().split('T')[0]);
          }
        } catch (err) {
          setError('Failed to fetch project details.');
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [id, isEditMode, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !budgetAmount) {
      setError('Please fill in title, description, and budget amount.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        budgetType,
        budgetAmount: Number(budgetAmount),
        skillsRequired: skillsRequired
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        deadline: deadline || null,
        status,
      };

      if (isEditMode) {
        await api.put(`/projects/${id}`, payload);
        navigate(`/projects/${id}`);
      } else {
        const res = await api.post('/projects', payload);
        navigate(`/projects/${res.data.project._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project listing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner" />
        <p>Loading project data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        {/* Back Link */}
        <div style={{ marginBottom: 20 }}>
          <Link
            to="/client/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--navy-600)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <div className="card" style={{ padding: '36px 32px' }}>
          <div style={{ marginBottom: 28, borderBottom: '1px solid var(--navy-100)', paddingBottom: 16 }}>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--navy-900)', marginBottom: 6 }}>
              {isEditMode ? 'Edit Project Listing' : 'Post a New Project'}
            </h1>
            <p style={{ color: 'var(--navy-500)', fontSize: '0.95rem' }}>
              Describe your project specifications, required skills, and budget
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Build Responsive React Dashboard with Node API"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--navy-400)' }}>
                Maximum 120 characters ({title.length}/120)
              </span>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget & Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Budget Type</label>
                <select
                  className="form-select"
                  value={budgetType}
                  onChange={(e) => setBudgetType(e.target.value)}
                >
                  <option value="fixed">Fixed Price Project</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Budget Amount ($ USD)
                </label>
                <input
                  type="number"
                  min="5"
                  className="form-input"
                  placeholder="e.g. 1500"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Deadline & Status (if edit) */}
            <div style={{ display: 'grid', gridTemplateColumns: isEditMode ? '1fr 1fr' : '1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Target Completion Date (Optional)</label>
                <input
                  type="date"
                  className="form-input"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              {isEditMode && (
                <div className="form-group">
                  <label className="form-label">Project Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>

            {/* Required Skills */}
            <div className="form-group">
              <label className="form-label">Required Skills (Comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. React, Node.js, MongoDB, CSS3, REST APIs"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--navy-400)' }}>
                Separate individual skills with commas
              </span>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Detailed Project Description</label>
              <textarea
                className="form-textarea"
                rows={7}
                placeholder="Describe project deliverables, expected milestones, requirements, and communication expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Submit buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} /> {isEditMode ? 'Update Project' : 'Publish Project Listing'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEditProjectPage;
