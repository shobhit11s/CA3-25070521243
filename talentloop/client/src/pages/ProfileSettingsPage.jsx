import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Save, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ProfileSettingsPage = () => {
  const { user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security'

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Intermediate');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [portfolioLinks, setPortfolioLinks] = useState(
    user?.portfolioLinks && user.portfolioLinks.length > 0
      ? user.portfolioLinks
      : [{ title: '', url: '' }]
  );

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    setLoading(true);

    try {
      const filteredLinks = portfolioLinks.filter((l) => l.title.trim() && l.url.trim());
      await updateProfile({
        name: name.trim(),
        title: title.trim(),
        bio: bio.trim(),
        location: location.trim(),
        hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
        experienceLevel,
        skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        portfolioLinks: filteredLinks,
      });

      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'danger', message: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({ type: 'danger', message: 'New password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setFeedback({ type: 'success', message: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update password.',
      });
    } finally {
      setLoading(false);
    }
  };

  const addPortfolioRow = () => {
    setPortfolioLinks([...portfolioLinks, { title: '', url: '' }]);
  };

  const removePortfolioRow = (idx) => {
    setPortfolioLinks(portfolioLinks.filter((_, i) => i !== idx));
  };

  const updatePortfolioLink = (idx, field, value) => {
    const updated = [...portfolioLinks];
    updated[idx][field] = value;
    setPortfolioLinks(updated);
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.9rem', color: 'var(--navy-900)' }}>Profile & Account Settings</h1>
          <p style={{ color: 'var(--navy-500)', fontSize: '0.95rem' }}>
            Manage your public marketplace presence and security preferences
          </p>
        </div>

        {feedback.message && (
          <div className={`alert alert-${feedback.type}`}>
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--navy-200)', paddingBottom: 10 }}>
          <button
            className="btn btn-sm"
            onClick={() => setActiveTab('profile')}
            style={{
              background: activeTab === 'profile' ? 'var(--primary)' : 'var(--white)',
              color: activeTab === 'profile' ? 'var(--white)' : 'var(--navy-700)',
              border: '1px solid var(--navy-200)',
            }}
          >
            <User size={15} /> Profile Details
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setActiveTab('security')}
            style={{
              background: activeTab === 'security' ? 'var(--primary)' : 'var(--white)',
              color: activeTab === 'security' ? 'var(--white)' : 'var(--navy-700)',
              border: '1px solid var(--navy-200)',
            }}
          >
            <Lock size={15} /> Security & Password
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="card" style={{ padding: '32px' }}>
            <form onSubmit={handleProfileSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. San Francisco, CA / Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Professional Title / Headline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Full-Stack React & Node Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">About / Bio</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Highlight your background, key achievements, and client experience..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              {/* Freelancer Specific Details */}
              {user?.role === 'freelancer' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Hourly Rate ($ USD)</label>
                      <input
                        type="number"
                        min="0"
                        className="form-input"
                        placeholder="e.g. 65"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Experience Level</label>
                      <select
                        className="form-select"
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                      >
                        <option value="Entry">Entry Level</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert / Senior</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Skills (Comma-separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="React, TypeScript, Node.js, Express, UI/UX"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                  </div>

                  {/* Portfolio Links */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Portfolio Links</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={addPortfolioRow}
                      >
                        <Plus size={14} /> Add Link
                      </button>
                    </div>

                    {portfolioLinks.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Project Title (e.g. SaaS App)"
                          value={item.title}
                          onChange={(e) => updatePortfolioLink(idx, 'title', e.target.value)}
                        />
                        <input
                          type="url"
                          className="form-input"
                          placeholder="URL (https://github.com/...)"
                          value={item.url}
                          onChange={(e) => updatePortfolioLink(idx, 'url', e.target.value)}
                        />
                        {portfolioLinks.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => removePortfolioRow(idx)}
                            style={{ color: 'var(--danger)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={16} /> {loading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={16} /> {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
