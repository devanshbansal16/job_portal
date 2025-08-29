import React, { useContext, useEffect } from "react";
import { Routes, Route, useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "./context/AppContext";

// Pages
import Home from "./pages/Home";
import ApplyJobSimple from "./pages/ApplyJobSimple";
import JobDetail from "./pages/JobDetail";
import Applications from "./pages/Applications";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import RecruiterLogin from "./components/RecruiterLogin";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

// Clerk
import { useUser, useAuth } from "@clerk/clerk-react";

// Styles
import "quill/dist/quill.snow.css";

// ✅ Protected wrapper for users (Clerk)
function ProtectedRoute({ children }) {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

// ✅ Protected wrapper for companies (JWT)
function ProtectedCompanyRoute({ children }) {
  const { companyToken } = useContext(AppContext);

  if (!companyToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function SyncUser() {
  return null;
}

// ✅ Dashboard layout with nested routes
function DashboardLayout() {
  return (
    <Dashboard>
      <Outlet />
    </Dashboard>
  );
}

const App = () => {
  const { showRecruiterLogin, setShowRecruiterLogin, companyToken, clearUserData } =
    useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const showNavbar = !location.pathname.startsWith("/dashboard");
  const { user } = useUser();

  // Clear user data when user changes (additional protection)
  useEffect(() => {
    if (user) {
      // Redirect user away from auth pages after successful login
      if (location.pathname.startsWith('/sign-in') || location.pathname.startsWith('/sign-up')) {
        // Check if there's a redirect parameter
        const urlParams = new URLSearchParams(location.search);
        const redirectTo = urlParams.get('redirect') || '/';
        navigate(redirectTo, { replace: true });
      }
    } else {
      // Clear data when user logs out
      clearUserData();
    }
  }, [user?.id, clearUserData, location.pathname, location.search, navigate]);

  return (
    <div className="relative">
      {showRecruiterLogin && (
        <RecruiterLogin onClose={() => setShowRecruiterLogin(false)} />
      )}
      <ToastContainer />
      <SyncUser /> {/* ✅ Always syncing user globally */}
      <div
        className={`${
          showRecruiterLogin ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {showNavbar && <Navbar />}

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/apply-job/:id" element={<ApplyJobSimple />} />
          <Route path="/job/:id" element={<JobDetail />} />
          {/* Clerk authentication routes with wildcard support */}
          <Route path="/sign-in/*" element={<SignIn />} />
          <Route path="/sign-up/*" element={<SignUp />} />
          <Route path="/forgot-password/*" element={<SignIn />} />

          {/* Protected routes */}
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedCompanyRoute>
                <DashboardLayout />
              </ProtectedCompanyRoute>
            }
          >
            <Route index element={<ManageJobs />} />
            <Route path="add-job" element={<AddJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route
              path="view-applications"
              element={<ViewApplications />}
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
