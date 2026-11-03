import { lazy } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/layout/AppLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { CalendarDataProvider } from "@/contexts/calendar-data-context"
import { AuthProvider } from "@/contexts/AuthProvider"
import { PreferencesProvider } from "@/contexts/PreferencesProvider"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"

const CalendarPage = lazy(() =>
  import("@/pages/CalendarPage").then((module) => ({
    default: module.CalendarPage,
  }))
)
const DDLPage = lazy(() =>
  import("@/pages/DDLPage").then((module) => ({
    default: module.DDLPage,
  }))
)
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  }))
)
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  }))
)

function App() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <CalendarDataProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/calendar" replace />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/ddl" element={<DDLPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </CalendarDataProvider>
      </AuthProvider>
    </PreferencesProvider>
  )
}

export default App
