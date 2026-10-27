import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExploreProjectsPage from './pages/ExploreProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import CreateEditProjectPage from './pages/CreateEditProjectPage';
import FreelancerProfilePage from './pages/FreelancerProfilePage';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import MyProjectsPage from './pages/MyProjectsPage';
import ContractDetailsPage from './pages/ContractDetailsPage';
import MessagesPage from './pages/MessagesPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/projects" element={<ExploreProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/freelancers/:id" element={<FreelancerProfilePage />} />

              {/* Client Protected Routes */}
              <Route
                path="/client/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['client', 'admin']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-project"
                element={
                  <ProtectedRoute allowedRoles={['client', 'admin']}>
                    <CreateEditProjectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['client', 'admin']}>
                    <CreateEditProjectPage />
                  </ProtectedRoute>
                }
              />

              {/* Freelancer Protected Routes */}
              <Route
                path="/freelancer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['freelancer', 'admin']}>
                    <FreelancerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Shared Protected Routes */}
              <Route
                path="/my-projects"
                element={
                  <ProtectedRoute>
                    <MyProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contracts/:id"
                element={
                  <ProtectedRoute>
                    <ContractDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <ProfileSettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
