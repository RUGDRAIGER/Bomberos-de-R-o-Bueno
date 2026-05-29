import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MisconfiguredEnv } from './components/MisconfiguredEnv'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminPartesPage } from './pages/AdminPartesPage'
import { AdminUsersPage } from './pages/AdminUsersPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { ParteDetailPage } from './pages/ParteDetailPage'
import { ParteWizardPage } from './pages/ParteWizardPage'
import { supabaseReady } from './lib/supabase'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  if (!supabaseReady) {
    return <MisconfiguredEnv />
  }

  return (
    <AuthProvider>
      <BrowserRouter basename={routerBasename || undefined}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="nuevo" element={<ParteWizardPage />} />
            <Route path="parte/:id" element={<ParteWizardPage />} />
            <Route path="ver/:id" element={<ParteDetailPage />} />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminUsersPage />} />
              <Route path="partes" element={<AdminPartesPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
