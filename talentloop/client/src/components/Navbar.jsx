import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Layers,
  MessageSquare,
  PlusCircle,
  Shield,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="nav-brand-icon">
            <Layers size={20} />
          </div>
          <span>Talent<span style={{ color: 'var(--primary)' }}>Loop</span></span>
        </Link>

        {/* Center Nav Links */}
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <Link
              to="/projects"
              className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Projects
            </Link>
          </li>

          {/* Role specific links */}
          {user && user.role === 'client' && (
            <>
              <li>
                <Link
                  to="/client/dashboard"
                  className={`nav-link ${isActive('/client/dashboard') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/my-projects"
                  className={`nav-link ${isActive('/my-projects') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/messages"
                  className={`nav-link ${isActive('/messages') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
              </li>
            </>
          )}

          {user && user.role === 'freelancer' && (
            <>
              <li>
                <Link
                  to="/freelancer/dashboard"
                  className={`nav-link ${isActive('/freelancer/dashboard') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/my-projects"
                  className={`nav-link ${isActive('/my-projects') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Active Work
                </Link>
              </li>
              <li>
                <Link
                  to="/messages"
                  className={`nav-link ${isActive('/messages') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
              </li>
            </>
          )}

          {user && user.role === 'admin' && (
            <li>
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield size={16} style={{ display: 'inline', marginRight: 4 }} />
                Admin Portal
              </Link>
            </li>
          )}
        </ul>

        {/* Right side CTA & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {user && user.role === 'client' && (
            <Link to="/create-project" className="btn btn-primary btn-sm" style={{ display: 'none', '@media (minWidth: 768px)': { display: 'inline-flex' } }}>
              <PlusCircle size={16} />
              Post Project
            </Link>
          )}

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div className="avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'none', '@media (minWidth: 800px)': { display: 'block' } }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy-900)' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'capitalize' }}>
                    {user.role}
                  </div>
                </div>
                <ChevronDown size={14} color="var(--navy-500)" />
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    width: 220,
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--navy-200)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px 0',
                    zIndex: 200,
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--navy-100)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)' }}>{user.email}</div>
                    <span className="badge badge-violet" style={{ marginTop: 6 }}>
                      {user.role}
                    </span>
                  </div>

                  {user.role === 'freelancer' && (
                    <Link
                      to={`/freelancers/${user._id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 16px',
                        color: 'var(--navy-700)',
                        fontSize: '0.875rem',
                      }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} /> Public Profile
                    </Link>
                  )}

                  <Link
                    to="/settings"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      color: 'var(--navy-700)',
                      fontSize: '0.875rem',
                    }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={16} /> Profile Settings
                  </Link>

                  <div style={{ borderTop: '1px solid var(--navy-100)', margin: '4px 0' }} />

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      color: 'var(--danger)',
                      fontSize: '0.875rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join TalentLoop
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              '@media (maxWidth: 768px)': { display: 'flex' },
              background: 'none',
              border: 'none',
              color: 'var(--navy-800)',
              cursor: 'pointer',
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
