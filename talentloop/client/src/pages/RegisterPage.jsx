import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, Code, AlertCircle, ArrowRight, Check } from 'lucide-react';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'freelancer' ? 'freelancer' : 'client';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        title: title.trim(),
        skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
      });

      if (user.role === 'client') {
        navigate('/client/dashboard');
      } else {
        navigate('/freelancer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px 0', minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 540 }}>
        <div className="card" style={{ padding: '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--navy-900)', marginBottom: 8 }}>
              Join TalentLoop
            </h2>
            <p style={{ color: 'var(--navy-500)', fontSize: '0.925rem' }}>
              Connect with top clients and high-paying projects worldwide
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Role Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setRole('client')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '16px 12px',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${role === 'client' ? 'var(--primary)' : 'var(--navy-200)'}`,
                background: role === 'client' ? 'var(--primary-light)' : 'var(--white)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <Briefcase size={22} color={role === 'client' ? 'var(--primary)' : 'var(--navy-500)'} />
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: role === 'client' ? 'var(--primary-hover)' : 'var(--navy-800)' }}>
                I'm a Client
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)' }}>
                Hiring for projects
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('freelancer')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '16px 12px',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${role === 'freelancer' ? 'var(--primary)' : 'var(--navy-200)'}`,
                background: role === 'freelancer' ? 'var(--primary-light)' : 'var(--white)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <Code size={22} color={role === 'freelancer' ? 'var(--primary)' : 'var(--navy-500)'} />
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: role === 'freelancer' ? 'var(--primary-hover)' : 'var(--navy-800)' }}>
                I'm a Freelancer
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)' }}>
                Looking for work
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--navy-400)" style={{ position: 'absolute', top: 12, left: 12 }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 40 }}
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--navy-400)" style={{ position: 'absolute', top: 12, left: 12 }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 40 }}
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--navy-400)" style={{ position: 'absolute', top: 12, left: 12 }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 40 }}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Freelancer specific fields */}
            {role === 'freelancer' && (
              <>
                <div className="form-group">
                  <label className="form-label">Professional Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Full-Stack React Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Skills (Comma-separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="React, Node.js, UI/UX"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hourly Rate ($)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      placeholder="e.g. 50"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: 10 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Creating Account...
                </>
              ) : (
                <>
                  Create {role === 'client' ? 'Client' : 'Freelancer'} Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--navy-600)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
