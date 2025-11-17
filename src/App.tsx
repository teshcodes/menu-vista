// src/App.tsx
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute";
import MenuPage from "./components/MenuPage";
import { Toaster } from "sonner";
import { UserProvider } from "./providers/UserProvider";

// Lazy load pages
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Menu = lazy(() => import("./pages/Menu"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const Settings = lazy(() => import("./pages/Settings"));
const GoogleCallback = lazy(() => import("./pages/GoogleCallback"));

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-gray-600">
      <svg
        className="animate-spin h-8 w-8 mr-3"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  </div>
);

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Google OAuth Callback */}
            <Route path="/auth/google/callback" element={<GoogleCallback />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/menu"
              element={
                <ProtectedRoute>
                  <Menu />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/menupage"
              element={
                <ProtectedRoute>
                  <MenuPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                  <h1 className="text-2xl font-semibold text-gray-800">Page Not Found</h1>
                  <p className="text-gray-600">
                    The page you're looking for doesn't exist.
                  </p>
                  <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-[#5C2E1E] text-white rounded hover:bg-[#4a2f19] transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              }
            />
          </Routes>
        </Suspense>

        {/* Global Notifications */}
        <Toaster position="top-right" richColors />
      </Router>
    </UserProvider>
  );
}
