import React,{useState} from 'react';
import { BrowserRouter as Router, Routes,Outlet, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import CheckInPage from './pages/CheckInPage';
import CheckOutPage from './pages/CheckOutPage';
import GuestsPage from './pages/GuestsPage';
import RecordsPage from './pages/RecordsPage';
import HelpPage from './pages/HelpPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem('isLoggedIn') === 'true'
  );

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />

        {/* Protected routes wrapper */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}> 
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Header />
                <Sidebar />
                <main className="md:ml-64 pt-16 px-4 md:px-8 py-6 bg-white dark:bg-gray-800">
                  <div className="max-w-7xl mx-auto">
                    <DashboardPage />
                  </div>
                </main>
              </div>
            }
          />
          <Route
            path="/check-in"
            element={
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Header />
                <Sidebar />
                <main className="md:ml-64 pt-16 px-4 md:px-8 py-6 bg-white dark:bg-gray-800">
                  <div className="max-w-7xl mx-auto">
                    <CheckInPage />
                  </div>
                </main>
              </div>
            }
          />
          <Route
            path="/check-out"
            element={
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Header />
                <Sidebar />
                <main className="md:ml-64 pt-16 px-4 md:px-8 py-6 bg-white dark:bg-gray-800">
                  <div className="max-w-7xl mx-auto">
                    <CheckOutPage />
                  </div>
                </main>
              </div>
            }
          />
          <Route
            path="/guests"
            element={
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Header />
                <Sidebar />
                <main className="md:ml-64 pt-16 px-4 md:px-8 py-6 bg-white dark:bg-gray-800">
                  <div className="max-w-7xl mx-auto">
                    <GuestsPage />
                  </div>
                </main>
              </div>
            }
          />
          <Route
            path="/records"
            element={
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Header />
                <Sidebar />
                <main className="md:ml-64 pt-16 px-4 md:px-8 py-6 bg-white dark:bg-gray-800">
                  <div className="max-w-7xl mx-auto">
                    <RecordsPage />
                  </div>
                </main>
              </div>
            }
          />
          <Route
            path="/profile"
            element={
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Header />
                <Sidebar />
                <main className="md:ml-64 pt-16 px-4 md:px-8 py-6 bg-white dark:bg-gray-800">
                  <div className="max-w-7xl mx-auto">
                    <ProfilePage />
                  </div>
                </main>
              </div>
            }
          />
          <Route
            path="/help"
            element={
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Header />
                <Sidebar />
                <main className="md:ml-64 pt-16 px-4 md:px-8 py-6 bg-white dark:bg-gray-800">
                  <div className="max-w-7xl mx-auto">
                    <HelpPage />
                  </div>
                </main>
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Header />
                <Sidebar />
                <main className="md:ml-64 pt-16 px-4 md:px-8 py-6 bg-white dark:bg-gray-800">
                  <div className="max-w-7xl mx-auto">
                    <SettingsPage onLogout={() => { localStorage.removeItem('isLoggedIn'); setIsAuthenticated(false); }} />
                  </div>
                </main>
              </div>
            }
          />
        </Route>

        {/* catch-all */}
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;