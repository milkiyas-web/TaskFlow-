import './App.css'
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage'
import SigninPage from './pages/SigninPage'
import DashboardPage from './pages/DashboardPage'
import Social from './pages/Social';
import Streak from './pages/Streak';
import TasksList from './components/TasksList';
import SignupPage from './pages/SignupPage';
import ProjectsList from './components/ProjectsList';
import AdminDashboard from './pages/AdminPage';
import CalendarComponent from './pages/Calendar';
import OnBoarding from './pages/OnBoarding';
import Organization from './pages/Organization';
import ProtectedRoute from './components/middleware';
import UserPerformance from './components/UserPerformance';
import UsersPerformance from './pages/UsersPerformance';
import Timeboxing from './pages/Timeboxing';

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-up/*" element={<SignupPage />} />
          <Route path="/sign-in/*" element={<SigninPage />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }>
            <Route index element={<ProjectsList />} />
            <Route path="social" element={<Social />} />
            <Route path="streak" element={<Streak />} />
            <Route path="projects/:projectId/tasks" element={<TasksList />} />
            <Route path="timebox" element={<CalendarComponent />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="organization" element={<Organization />} />
            <Route path="all-users" element={<UsersPerformance />} />
            <Route path="timeboxing" element={<Timeboxing />} />
            <Route path="admin/user-performance/:userId" element={<UserPerformance />} />
          </Route>
          <Route path="/onboarding" element={<OnBoarding />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  )
}

export default App
