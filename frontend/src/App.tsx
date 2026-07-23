import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { MembersListPage } from "./pages/MembersListPage";
import { MemberFormPage } from "./pages/MemberFormPage";
import { RegistrationLinksPage } from "./pages/RegistrationLinksPage";
import { PublicRegistrationPage } from "./pages/PublicRegistrationPage";

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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
