import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Clock, Users, Star, ArrowRight, ShieldCheck } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Open':
        return 'badge-open';
      case 'In Progress':
        return 'badge-inprogress';
      case 'Completed':
        return 'badge-completed';
      case 'Cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-open';
    }
  };

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top category & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="badge badge-violet">{project.category}</span>
        <span className={`badge ${getBadgeClass(project.status)}`}>{project.status}</span>
      </div>

      {/* Project Title */}
      <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none' }}>
        <h3
          style={{
            fontSize: '1.15rem',
            marginBottom: 10,
            color: 'var(--navy-900)',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--navy-900)')}
        >
          {project.title}
        </h3>
      </Link>

      {/* Short Description */}
      <p
        style={{
          color: 'var(--navy-600)',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          marginBottom: 16,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </p>

      {/* Skills chips */}
      {project.skillsRequired && project.skillsRequired.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {project.skillsRequired.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="tag-pill">
              {skill}
            </span>
          ))}
          {project.skillsRequired.length > 4 && (
            <span className="tag-pill" style={{ background: 'none', border: '1px solid var(--navy-200)' }}>
              +{project.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Budget & Meta */}
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
          <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', fontWeight: 600, textTransform: 'uppercase' }}>
            {project.budget?.type === 'hourly' ? 'Hourly Rate' : 'Fixed Budget'}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-hover)' }}>
            ${project.budget?.amount?.toLocaleString()}
            {project.budget?.type === 'hourly' && <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>/hr</span>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem', color: 'var(--navy-500)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={14} /> {project.proposalsCount || 0}
          </span>
          <Link to={`/projects/${project._id}`} className="btn btn-outline btn-sm">
            View <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Client minimal info */}
      {project.client && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: '1px dashed var(--navy-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--navy-500)',
          }}
        >
          <span>Posted by <strong>{project.client.name}</strong></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#d97706', fontWeight: 600 }}>
            <Star size={13} fill="#d97706" /> {project.client.rating || 5.0}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
