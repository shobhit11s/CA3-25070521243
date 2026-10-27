import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  ExternalLink,
  MessageSquare,
  Award,
  CheckCircle,
  Briefcase,
  Calendar,
  ArrowLeft,
  DollarSign,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FreelancerProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/freelancer/${id}`);
        setProfile(res.data.profile);
      } catch (err) {
        setError('Freelancer profile not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleStartMessage = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/messages/conversations', { recipientId: id });
      navigate('/messages', { state: { activeConversationId: res.data.conversation._id } });
    } catch (err) {
      alert(err.response?.data?.message || 'Could not start conversation.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner" />
        <p>Loading freelancer profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Freelancer Profile Not Found</h2>
        <Link to="/projects" className="btn btn-primary" style={{ marginTop: 16 }}>
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Back navigation */}
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

        <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr', gap: 30, alignItems: 'start' }}>
          {/* Left Sidebar / Card */}
          <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
            <div
              className="avatar"
              style={{
                width: 90,
                height: 90,
                fontSize: '2.4rem',
                margin: '0 auto 16px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {profile.name?.charAt(0)}
            </div>

            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: 4 }}>
              {profile.name}
            </h2>

            <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: 12 }}>
              {profile.title || 'Independent Specialist'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20, color: 'var(--navy-500)', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={14} /> {profile.location || 'Remote'}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#d97706', fontWeight: 700 }}>
                <Star size={14} fill="#d97706" /> {profile.rating?.toFixed(1) || '5.0'} ({profile.reviewsCount || 0})
              </span>
            </div>

            {/* Rate & Experience */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                padding: '16px',
                background: 'var(--navy-50)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 24,
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Hourly Rate
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  ${profile.hourlyRate || 50}/hr
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Experience
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-800)' }}>
                  {profile.experienceLevel || 'Expert'}
                </div>
              </div>
            </div>

            {user?._id !== profile._id && (
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleStartMessage}
              >
                <MessageSquare size={16} /> Contact / Message
              </button>
            )}
          </div>

          {/* Right Main Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Bio Card */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: 12 }}>
                About Me
              </h3>
              <p style={{ color: 'var(--navy-700)', lineHeight: 1.8, fontSize: '0.975rem', whiteSpace: 'pre-line' }}>
                {profile.bio || 'Professional freelancer delivering outstanding quality on TalentLoop.'}
              </p>
            </div>

            {/* Skills & Expertise */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: 16 }}>
                Skills & Technologies
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary-hover)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      border: '1px solid var(--primary-border)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio Links */}
            {profile.portfolioLinks && profile.portfolioLinks.length > 0 && (
              <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: 16 }}>
                  Portfolio & Case Studies
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  {profile.portfolioLinks.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: 'var(--navy-50)',
                        border: '1px solid var(--navy-200)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--navy-900)',
                        fontWeight: 600,
                        fontSize: '0.925rem',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--navy-200)')}
                    >
                      <span>{item.title}</span>
                      <ExternalLink size={16} color="var(--primary)" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Projects & Reviews */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-900)' }}>
                  Client Reviews & Completed Contracts ({profile.reviews?.length || 0})
                </h3>
                <span className="badge badge-completed">
                  {profile.completedProjectsCount || 0} Projects Completed
                </span>
              </div>

              {profile.reviews && profile.reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {profile.reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        padding: '18px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--navy-50)',
                        border: '1px solid var(--navy-200)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>
                            {rev.reviewer?.name?.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-900)' }}>
                              {rev.reviewer?.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)' }}>
                              Project: {rev.project?.title}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#d97706', fontWeight: 700 }}>
                          <Star size={15} fill="#d97706" /> {rev.rating}.0
                        </div>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--navy-700)', lineHeight: 1.6 }}>
                        "{rev.comment}"
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--navy-400)', marginTop: 8 }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--navy-500)', fontStyle: 'italic' }}>
                  No reviews yet. Completed projects will display client ratings here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfilePage;
