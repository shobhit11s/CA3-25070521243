import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (redirectPath) {
        navigate(redirectPath);
      } else if (user.role === 'client') {
        navigate('/client/dashboard');
      } else if (user.role === 'freelancer') {
        navigate('/freelancer/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setLoading(true);

    try {
      const user = await login(demoEmail, 'password123');
      if (user.role === 'client') navigate('/client/dashboard');
      else if (user.role === 'freelancer') navigate('/freelancer/dashboard');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card" style={{ padding: '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--navy-900)', marginBottom: 8 }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--navy-500)', fontSize: '0.925rem' }}>
              Sign in to manage projects, proposals, and milestones
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Buttons */}
          <div
            style={{
              background: 'var(--navy-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--navy-300)',
              padding: '14px',
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--navy-600)', marginBottom: 10, textTransform: 'uppercase' }}>
              ⚡ One-Click Demo Access
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickLogin('sarah.client@talentloop.com')}
                disabled={loading}
                title="Log in as Sarah (Client)"
              >
                <Briefcase size={14} color="#7c3aed" /> Client
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickLogin('elena.dev@talentloop.com')}
                disabled={loading}
                title="Log in as Elena (Freelancer)"
              >
                <UserCheck size={14} color="#059669" /> Freelancer
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickLogin('admin@talentloop.com')}
                disabled={loading}
                title="Log in as System Admin"
              >
                <ShieldCheck size={14} color="#d97706" /> Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="var(--navy-400)"
                  style={{ position: 'absolute', top: 12, left: 12 }}
                />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 40 }}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Demo: password123</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="var(--navy-400)"
                  style={{ position: 'absolute', top: 12, left: 12 }}
                />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 40 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: 10 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--navy-600)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
