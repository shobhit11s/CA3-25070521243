import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search, ArrowRight } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{ padding: '90px 20px', textAlign: 'center', minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <Compass size={44} />
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-800)', marginTop: 8, marginBottom: 12 }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--navy-600)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 32 }}>
          The page or contract you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} /> Return Home
          </Link>
          <Link to="/projects" className="btn btn-secondary btn-lg">
            <Search size={18} /> Explore Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
