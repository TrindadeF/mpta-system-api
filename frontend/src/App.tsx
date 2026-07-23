import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { MembersListPage } from "./pages/MembersListPage";
import { MemberFormPage } from "./pages/MemberFormPage";
import { RegistrationLinksPage } from "./pages/RegistrationLinksPage";
import { PublicRegistrationPage } from "./pages/PublicRegistrationPage";
import { MinistriesPage } from "./pages/MinistriesPage";
import { MinistryDetailPage } from "./pages/MinistryDetailPage";
import { SchedulesListPage } from "./pages/SchedulesListPage";
import { ScheduleFormPage } from "./pages/ScheduleFormPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/membros" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro/:token" element={<PublicRegistrationPage />} />

          <Route
            path="/membros"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MembersListPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/membros/novo"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MemberFormPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/membros/:id/editar"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MemberFormPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/links-cadastro"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RegistrationLinksPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ministerios"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MinistriesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ministerios/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MinistryDetailPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/escalas"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SchedulesListPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/escalas/nova"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ScheduleFormPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/escalas/:id/editar"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ScheduleFormPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
