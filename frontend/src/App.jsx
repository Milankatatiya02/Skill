import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import SkillSelection from './pages/SkillSelection';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import MyTasks from './pages/MyTasks';
import SubmitWork from './pages/SubmitWork';
import Portfolio from './pages/Portfolio';
import AdminDashboard from './pages/AdminDashboard';
import PublicPortfolio from './pages/PublicPortfolio';
import Notifications from './pages/Notifications';
import EditProfile from './pages/EditProfile';
import Leaderboard from './pages/Leaderboard';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                borderRadius: 12,
                border: '1px solid rgba(148,163,184,0.1)',
                fontSize: '0.875rem',
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/portfolio/:userId" element={<PublicPortfolio />} />
            <Route path="/skills" element={<ProtectedRoute><SkillSelection /></ProtectedRoute>} />
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/my-tasks" element={<MyTasks />} />
              <Route path="/submit" element={<SubmitWork />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
