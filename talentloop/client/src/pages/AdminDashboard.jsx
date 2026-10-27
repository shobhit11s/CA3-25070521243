import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Check,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reportedProjects, setReportedProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'moderation'
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, reportedRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/users?role=${roleFilter}&search=${userSearch}`),
        api.get('/admin/reported-projects'),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setReportedProjects(reportedRes.data.projects || []);
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to fetch admin dashboard data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [roleFilter, userSearch]);

  const handleToggleSuspend = async (userId, currentSuspended, userName) => {
    const action = currentSuspended ? 'unsuspend' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${action} user "${userName}"?`)) return;

    try {
      await api.put(`/admin/users/${userId}/suspend`);
      setFeedback({ type: 'success', message: `User ${userName} ${action}ed successfully.` });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Action failed.' });
    }
  };

  const handleDismissReport = async (projectId) => {
    try {
      await api.put(`/admin/projects/${projectId}/dismiss-report`);
      setFeedback({ type: 'success', message: 'Report dismissed.' });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to dismiss report.' });
    }
  };

  const handleDeleteReportedProject = async (projectId) => {
    if (!window.confirm('Delete this reported project permanently?')) return;
    try {
      await api.delete(`/projects/${projectId}`);
      setFeedback({ type: 'success', message: 'Project removed by moderator.' });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to delete project.' });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner" />
        <p>Loading admin portal...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: 10,
              background: '#fef3c7',
              color: '#d97706',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Shield size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--navy-900)' }}>
              Admin Control Center
            </h1>
            <p style={{ color: 'var(--navy-500)', fontSize: '0.925rem' }}>
              Platform metrics, user account moderation, and listing enforcement
            </p>
          </div>
        </div>

        {feedback.message && (
          <div className={`alert alert-${feedback.type}`}>
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, borderBottom: '1px solid var(--navy-200)', paddingBottom: 10 }}>
          <button
            className="btn btn-sm"
            onClick={() => setActiveTab('overview')}
            style={{
              background: activeTab === 'overview' ? 'var(--primary)' : 'var(--white)',
              color: activeTab === 'overview' ? 'var(--white)' : 'var(--navy-700)',
              border: '1px solid var(--navy-200)',
            }}
          >
            Platform Overview
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setActiveTab('users')}
            style={{
              background: activeTab === 'users' ? 'var(--primary)' : 'var(--white)',
              color: activeTab === 'users' ? 'var(--white)' : 'var(--navy-700)',
              border: '1px solid var(--navy-200)',
            }}
          >
            User Management ({users.length})
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setActiveTab('moderation')}
            style={{
              background: activeTab === 'moderation' ? 'var(--primary)' : 'var(--white)',
              color: activeTab === 'moderation' ? 'var(--white)' : 'var(--navy-700)',
              border: '1px solid var(--navy-200)',
            }}
          >
            Reported Projects ({reportedProjects.length})
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && stats && (
          <div>
            {/* Top Stat Cards */}
            <div className="grid-4" style={{ marginBottom: 24 }}>
              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Total Registered Users</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: 4 }}>
                  {stats.totalUsers}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
                  {stats.clientsCount} Clients • {stats.freelancersCount} Freelancers
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Total Projects</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: 4 }}>
                  {stats.totalProjects}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
                  {stats.openProjects} Open • {stats.inProgressProjects} In Progress
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Total Contracts</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-hover)', marginTop: 4 }}>
                  {stats.totalContracts}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
                  {stats.completedProjects} Completed
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--navy-500)', fontWeight: 600 }}>Reported Items</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stats.reportedProjectsCount > 0 ? 'var(--danger)' : 'var(--navy-900)', marginTop: 4 }}>
                  {stats.reportedProjectsCount}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 4 }}>
                  Requires moderator review
                </div>
              </div>
            </div>

            {/* Platform Status Card */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 14 }}>System & Health Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ padding: 14, background: 'var(--navy-50)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase' }}>Database</div>
                  <div style={{ fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <CheckCircle size={16} /> MongoDB Connected
                  </div>
                </div>

                <div style={{ padding: 14, background: 'var(--navy-50)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase' }}>Authentication</div>
                  <div style={{ fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <CheckCircle size={16} /> JWT + Bcrypt Active
                  </div>
                </div>

                <div style={{ padding: 14, background: 'var(--navy-50)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)', textTransform: 'uppercase' }}>Total Proposals Logged</div>
                  <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginTop: 4 }}>
                    {stats.totalProposals} Submissions
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 20, justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', minWidth: 260, flex: 1 }}>
                <Search size={18} color="var(--navy-400)" style={{ position: 'absolute', top: 12, left: 12 }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 40 }}
                  placeholder="Filter users by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="client">Clients</option>
                <option value="freelancer">Freelancers</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--navy-200)', color: 'var(--navy-500)' }}>
                    <th style={{ padding: '12px 14px' }}>User</th>
                    <th style={{ padding: '12px 14px' }}>Role</th>
                    <th style={{ padding: '12px 14px' }}>Rating</th>
                    <th style={{ padding: '12px 14px' }}>Joined</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--navy-100)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-violet">{u.role}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        ⭐ {u.rating ? u.rating.toFixed(1) : '5.0'} ({u.reviewsCount || 0})
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--navy-500)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {u.isSuspended ? (
                          <span className="badge badge-cancelled">Suspended</span>
                        ) : (
                          <span className="badge badge-completed">Active</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        {u.role !== 'admin' && (
                          <button
                            className={`btn btn-sm ${u.isSuspended ? 'btn-secondary' : 'btn-danger'}`}
                            onClick={() => handleToggleSuspend(u._id, u.isSuspended, u.name)}
                          >
                            {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Moderation */}
        {activeTab === 'moderation' && (
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Reported Projects</h3>

            {reportedProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--navy-500)' }}>
                <CheckCircle size={36} color="#059669" style={{ margin: '0 auto 12px' }} />
                <p>No reported projects pending moderation.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reportedProjects.map((proj) => (
                  <div
                    key={proj._id}
                    style={{
                      border: '1px solid var(--danger-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      background: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', color: 'var(--navy-900)' }}>{proj.title}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--navy-500)', marginTop: 2 }}>
                          Client: <strong>{proj.client?.name}</strong> ({proj.client?.email})
                        </div>
                      </div>
                      <span className="badge badge-cancelled">Flagged</span>
                    </div>

                    <div style={{ padding: '10px 14px', background: '#fef2f2', borderRadius: 'var(--radius-sm)', marginBottom: 14 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                        Report Reason:
                      </span>
                      <p style={{ fontSize: '0.85rem', color: '#7f1d1d', marginTop: 2 }}>
                        {proj.reportReason || 'User flagged as inappropriate or suspicious.'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDismissReport(proj._id)}
                      >
                        Dismiss Flag
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteReportedProject(proj._id)}
                      >
                        <Trash2 size={14} /> Remove Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
