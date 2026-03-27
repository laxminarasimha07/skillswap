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
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Routes>
              {/* Public home page */}
              <Route path="/" element={
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <Spinner size="lg" />
                  </div>
                }>
                  <HomePage />
                </Suspense>
              } />

              <Route path="/home" element={<Navigate to="/" replace />} />

              {/* Public without Navbar */}
              <Route path="/login" element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
                  <LoginPage />
                </Suspense>
              } />
              <Route path="/register" element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
                  <RegisterPage />
                </Suspense>
              } />

              {/* All other pages render with navbar */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center">
                        <Spinner size="lg" />
                      </div>
                    }>
                      <Routes>
                        {/* Protected Routes */}

                        <Route path="/feed" element={
                          <ProtectedRoute>
                            <FeedPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } />
                        <Route path="/connections" element={
                          <ProtectedRoute>
                            <ConnectionsPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/chat" element={
                          <ProtectedRoute>
                            <ChatPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/sessions" element={
                          <ProtectedRoute>
                            <SessionsPage />
                          </ProtectedRoute>
                        } />

                        {/* Error Handling */}
                        <Route path="/404" element={<NotFoundPage />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Toaster position="bottom-right" />
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
