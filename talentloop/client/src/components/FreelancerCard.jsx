import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, CheckCircle } from 'lucide-react';

const FreelancerCard = ({ freelancer }) => {
  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div className="avatar" style={{ width: 52, height: 52, fontSize: '1.25rem' }}>
          {freelancer.name ? freelancer.name.charAt(0).toUpperCase() : 'F'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--navy-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {freelancer.name}
            </h4>
            <CheckCircle size={15} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {freelancer.title || 'Freelance Specialist'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: 'var(--navy-500)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} /> {freelancer.location || 'Remote'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#d97706', fontWeight: 700 }}>
              <Star size={13} fill="#d97706" /> {freelancer.rating ? freelancer.rating.toFixed(1) : '5.0'} ({freelancer.reviewsCount || 0})
            </span>
          </div>
        </div>
      </div>

      {/* Bio snippet */}
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--navy-600)',
          lineHeight: 1.5,
          marginBottom: 16,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {freelancer.bio || 'Experienced professional ready to collaborate on challenging digital projects.'}
      </p>

      {/* Skills */}
      {freelancer.skills && freelancer.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {freelancer.skills.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="tag-pill">
              {skill}
            </span>
          ))}
          {freelancer.skills.length > 4 && (
            <span className="tag-pill" style={{ background: 'none', border: '1px solid var(--navy-200)' }}>
              +{freelancer.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Rate & View Profile */}
      <div
        style={{
          borderTop: '1px solid var(--navy-100)',
          paddingTop: 14,
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            ${freelancer.hourlyRate || 50}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--navy-500)' }}> /hr</span>
        </div>

        <Link to={`/freelancers/${freelancer._id}`} className="btn btn-primary btn-sm">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default FreelancerCard;
