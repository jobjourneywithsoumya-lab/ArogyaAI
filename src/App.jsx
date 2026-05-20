import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HealthProvider } from './context/HealthContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Pharmacy from './pages/Pharmacy';
import HealthRecords from './pages/HealthRecords';
import DiseaseTracker from './pages/DiseaseTracker';
import HospitalFinder from './pages/HospitalFinder';
import AwarenessHub from './pages/AwarenessHub';
import WellnessAI from './pages/WellnessAI';
import DoctorsDirectory from './pages/DoctorsDirectory';
import MentalHealthBot from './components/MentalHealthBot';
import InstallPrompt from './components/InstallPrompt';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <HealthProvider>
          <div className="app">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div>
                      <Navbar />
                      <main>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/pharmacy" element={<Pharmacy />} />
                          <Route path="/records" element={<HealthRecords />} />
                          <Route path="/tracker" element={<DiseaseTracker />} />
                          <Route path="/hospitals" element={<HospitalFinder />} />
                          <Route path="/doctors" element={<DoctorsDirectory />} />
                          <Route path="/awareness" element={<AwarenessHub />} />
                          <Route path="/wellness-ai" element={<WellnessAI />} />
                        </Routes>
                      </main>
                      <MentalHealthBot />
                      <InstallPrompt />
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </HealthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
