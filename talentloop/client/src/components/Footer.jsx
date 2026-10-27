import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-4" style={{ marginBottom: 40 }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div className="nav-brand-icon">
                <Layers size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--white)' }}>
                Talent<span style={{ color: '#a78bfa' }}>Loop</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--navy-400)', marginBottom: 20 }}>
              The modern marketplace connecting forward-thinking teams with world-class freelance talent across development, design, and digital growth.
            </p>
            <div style={{ display: 'flex', gap: 14, color: 'var(--navy-400)' }}>
              <a href="#" style={{ color: 'inherit' }}><Twitter size={18} /></a>
              <a href="#" style={{ color: 'inherit' }}><Github size={18} /></a>
              <a href="#" style={{ color: 'inherit' }}><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4>Marketplace</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
              <li><Link to="/projects?category=Web+Development">Web Development</Link></li>
              <li><Link to="/projects?category=Graphic+Design">Graphic Design</Link></li>
              <li><Link to="/projects?category=Video+Editing">Video Editing</Link></li>
              <li><Link to="/projects?category=Content+Creation">Content Creation</Link></li>
              <li><Link to="/projects?category=Digital+Marketing">Digital Marketing</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
              <li><Link to="/projects">Explore Projects</Link></li>
              <li><Link to="/register?role=freelancer">Become a Freelancer</Link></li>
              <li><Link to="/register?role=client">Hire Freelancers</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/admin">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4>Trust & Security</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--navy-400)', lineHeight: 1.6, marginBottom: 12 }}>
              Secure milestone escrow workflows, authenticated communications, and transparent verified reviews for every contract.
            </p>
            <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#cbd5e1' }}>
              🛡️ End-to-End Escrow Protection
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: '0.825rem',
            color: 'var(--navy-400)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} TalentLoop Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Crafted with modern MERN stack & local MongoDB.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
