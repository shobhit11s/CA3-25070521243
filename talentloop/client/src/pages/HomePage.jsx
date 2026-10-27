import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Code2,
  Palette,
  Film,
  FileText,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import FreelancerCard from '../components/FreelancerCard';

const categories = [
  { name: 'Web Development', icon: Code2, count: '140+ Projects', desc: 'React, Node.js, Next.js, Full-stack' },
  { name: 'Graphic Design', icon: Palette, count: '85+ Projects', desc: 'Figma, Branding, UI/UX, Design systems' },
  { name: 'Video Editing', icon: Film, count: '60+ Projects', desc: 'Reels, YouTube, Premiere, Motion' },
  { name: 'Content Creation', icon: FileText, count: '90+ Projects', desc: 'SEO, Technical blogs, Copywriting' },
  { name: 'Digital Marketing', icon: TrendingUp, count: '75+ Projects', desc: 'Growth, Meta Ads, Funnels, Email' },
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredFreelancers, setFeaturedFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, freeRes] = await Promise.all([
          api.get('/projects?limit=3'),
          api.get('/users/featured-freelancers'),
        ]);
        setFeaturedProjects(projRes.data.projects || []);
        setFeaturedFreelancers(freeRes.data.freelancers?.slice(0, 3) || []);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/projects');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(ellipse at top, #faf5ff 0%, #ffffff 80%)',
          borderBottom: '1px solid var(--navy-200)',
          padding: '80px 0 70px',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: 920 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--primary-hover)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            <Sparkles size={16} /> The Next-Gen Freelance Marketplace
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              color: 'var(--navy-900)',
              letterSpacing: '-0.025em',
              marginBottom: 20,
              lineHeight: 1.15,
            }}
          >
            Hire vetted talent.{' '}
            <span style={{ color: 'var(--primary)' }}>Deliver ambitious</span> projects.
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--navy-600)',
              lineHeight: 1.6,
              maxWidth: 720,
              margin: '0 auto 36px',
            }}
          >
            TalentLoop connects innovative startups and businesses with elite developers, designers, video editors, and digital marketers with verified milestone tracking.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--white)',
              borderRadius: 'var(--radius-xl)',
              padding: '8px 10px 8px 20px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--navy-200)',
              maxWidth: 680,
              margin: '0 auto 32px',
            }}
          >
            <Search size={22} color="var(--navy-400)" style={{ marginRight: 12 }} />
            <input
              type="text"
              placeholder="Search projects by skills, title, or category (e.g. React, UI/UX, Video Ads)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                color: 'var(--navy-900)',
                background: 'transparent',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 26px', borderRadius: 'var(--radius-lg)' }}>
              Search
            </button>
          </form>

          {/* Quick tags */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--navy-500)' }}>
            <span style={{ fontWeight: 600 }}>Popular Searches:</span>
            <Link to="/projects?search=React" className="tag-pill">React</Link>
            <Link to="/projects?search=Figma" className="tag-pill">Figma UI</Link>
            <Link to="/projects?search=Node.js" className="tag-pill">Node.js API</Link>
            <Link to="/projects?search=Video+Editing" className="tag-pill">Shorts / Reels</Link>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--navy-200)', padding: '24px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: 20,
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>99.2%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 500 }}>Contract Success Rate</div>
            </div>
            <div style={{ width: 1, height: 36, background: 'var(--navy-200)' }} />
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>2,400+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 500 }}>Vetted Freelancers</div>
            </div>
            <div style={{ width: 1, height: 36, background: 'var(--navy-200)' }} />
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 500 }}>Milestone Escrow Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <span className="badge badge-violet" style={{ marginBottom: 8 }}>Browse Categories</span>
              <h2 style={{ fontSize: '2rem', color: 'var(--navy-900)' }}>Top In-Demand Skills</h2>
            </div>
            <Link to="/projects" className="btn btn-outline btn-sm">
              All Categories <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3" style={{ gap: 20 }}>
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/projects?category=${encodeURIComponent(cat.name)}`}
                  className="card card-interactive"
                  style={{ textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 4, color: 'var(--navy-900)' }}>
                      {cat.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--navy-500)', marginBottom: 8 }}>
                      {cat.desc}
                    </p>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {cat.count}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section style={{ padding: '60px 0 70px', background: 'var(--white)', borderTop: '1px solid var(--navy-200)', borderBottom: '1px solid var(--navy-200)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <span className="badge badge-open" style={{ marginBottom: 8 }}>Available Now</span>
              <h2 style={{ fontSize: '2rem', color: 'var(--navy-900)' }}>Featured Active Listings</h2>
            </div>
            <Link to="/projects" className="btn btn-primary btn-sm">
              Explore All Projects <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <span className="spinner" />
              <p>Loading projects...</p>
            </div>
          ) : (
            <div className="grid-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Rated Freelancers */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <span className="badge badge-violet" style={{ marginBottom: 8 }}>Vetted Experts</span>
              <h2 style={{ fontSize: '2rem', color: 'var(--navy-900)' }}>Top-Rated Freelancers</h2>
            </div>
            <Link to="/projects" className="btn btn-outline btn-sm">
              Browse All Talent <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3">
            {featuredFreelancers.map((freelancer) => (
              <FreelancerCard key={freelancer._id} freelancer={freelancer} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: '70px 0', background: 'var(--white)', borderTop: '1px solid var(--navy-200)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-violet" style={{ marginBottom: 10 }}>Workflow</span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: 14 }}>How TalentLoop Works</h2>
          <p style={{ color: 'var(--navy-600)', maxWidth: 640, margin: '0 auto 48px' }}>
            A streamlined 3-step lifecycle that guarantees transparency, rapid hiring, and high-quality deliverables.
          </p>

          <div className="grid-3" style={{ textAlign: 'left' }}>
            <div className="card" style={{ position: 'relative' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary)',
                  color: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  marginBottom: 16,
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>Post & Browse Listings</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--navy-600)', lineHeight: 1.6 }}>
                Clients specify project goals, budgets, and required skills. Freelancers review transparent requirements and submit competitive proposals.
              </p>
            </div>

            <div className="card" style={{ position: 'relative' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary)',
                  color: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  marginBottom: 16,
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>Contract & Milestone Setup</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--navy-600)', lineHeight: 1.6 }}>
                Accepting a proposal immediately generates an active contract. Break down deliverables into milestones with estimated dates and amounts.
              </p>
            </div>

            <div className="card" style={{ position: 'relative' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary)',
                  color: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  marginBottom: 16,
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>Deliver, Approve & Review</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--navy-600)', lineHeight: 1.6 }}>
                Freelancers submit milestone work, clients approve and release payments, and verified two-sided ratings are logged on the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '60px 40px',
              color: 'var(--white)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 30,
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ maxWidth: 580 }}>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--white)', marginBottom: 12 }}>
                Ready to accelerate your projects?
              </h2>
              <p style={{ color: '#c7d2fe', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Join thousands of clients and verified freelancers building the future on TalentLoop today.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/register?role=client" className="btn btn-secondary btn-lg" style={{ color: '#312e81', fontWeight: 700 }}>
                Post a Project
              </Link>
              <Link to="/register?role=freelancer" className="btn btn-primary btn-lg" style={{ background: '#7c3aed', borderColor: '#8b5cf6' }}>
                Join as Freelancer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
