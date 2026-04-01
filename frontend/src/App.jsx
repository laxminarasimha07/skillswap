import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Spinner from './components/shared/Spinner';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const FeedPage = lazy(() => import('./pages/FeedPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ConnectionsPage = lazy(() => import('./pages/ConnectionsPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const SessionsPage = lazy(() => import('./pages/SessionsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <div className="min-h-screen bg-[#0B0F19] flex flex-col">
            <Routes>
              {/* Public home page */}
              <Route path="/" element={
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
                    <Spinner size="lg" />
                  </div>
                }>
                  <HomePage />
                </Suspense>
              } />

              <Route path="/home" element={<Navigate to="/" replace />} />

              {/* Public without Navbar */}
              <Route path="/login" element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0B0F19]"><Spinner size="lg" /></div>}>
                  <LoginPage />
                </Suspense>
              } />
              <Route path="/register" element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0B0F19]"><Spinner size="lg" /></div>}>
                  <RegisterPage />
                </Suspense>
              } />

              {/* All other pages render with navbar */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
                        <Spinner size="lg" />
                      </div>
                    }>
                      <Routes>
                        <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                        <Route path="/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
                        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                        <Route path="/sessions" element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />
                        <Route path="/404" element={<NotFoundPage />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      style: {
                        background: '#111827',
                        color: '#E5E7EB',
                        border: '1px solid #1F2937',
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                      },
                      success: { iconTheme: { primary: '#10b981', secondary: '#111827' } },
                      error: { iconTheme: { primary: '#ef4444', secondary: '#111827' } },
                    }}
                  />
                </>
              } />
            </Routes>
          </div>
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
