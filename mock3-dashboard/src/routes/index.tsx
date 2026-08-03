import { Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import SignInPage from "@/views/auth/SignInPage";
import SignUpPage from "@/views/auth/SignUpPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/views/Dashboard";
import MockList from "@/views/mocks/MockList";
import MockDetail from "@/views/mocks/MockDetail";
import ApiKeyList from "@/views/api-keys/ApiKeyList";
import Settings from "@/views/settings/Settings";
import HowToUse from "@/views/guide/HowToUse";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="mocks" element={<MockList />} />
        <Route path="mocks/:id" element={<MockDetail />} />
        <Route path="api-keys" element={<ApiKeyList />} />
        <Route path="guide" element={<HowToUse />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
