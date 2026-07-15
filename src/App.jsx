import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import PublicLayout from './components/public/PublicLayout'
import Home from './pages/public/Home'
import PerformersList from './pages/public/PerformersList'
import PerformerDetail from './pages/public/PerformerDetail'
import Gallery from './pages/public/Gallery'
import GalleryDetail from './pages/public/GalleryDetail'
import Contact from './pages/public/Contact'
import NotFound from './pages/public/NotFound'

import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import PerformersAdmin from './pages/admin/PerformersAdmin'
import PerformerForm from './pages/admin/PerformerForm'
import GalleryAdmin from './pages/admin/GalleryAdmin'
import GalleryForm from './pages/admin/GalleryForm'
import ContentAdmin from './pages/admin/ContentAdmin'
import SettingsAdmin from './pages/admin/SettingsAdmin'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="performers/korean" element={<PerformersList category="korean" />} />
            <Route path="performers/asian" element={<PerformersList category="asian" />} />
            <Route path="performers/:id" element={<PerformerDetail />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="gallery/:id" element={<GalleryDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="admin/login" element={<Login />} />
          <Route path="admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="performers" element={<PerformersAdmin />} />
              <Route path="performers/new" element={<PerformerForm />} />
              <Route path="performers/:id" element={<PerformerForm />} />
              <Route path="gallery" element={<GalleryAdmin />} />
              <Route path="gallery/new" element={<GalleryForm />} />
              <Route path="gallery/:id" element={<GalleryForm />} />
              <Route path="content" element={<ContentAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
