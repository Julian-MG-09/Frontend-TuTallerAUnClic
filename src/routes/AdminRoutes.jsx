import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout      from '../layouts/AdminLayout'
import Dashboard        from '../pages/admin/Dashboard'
import Usuarios         from '../pages/admin/Usuarios'
import Establecimientos from '../pages/admin/Establecimientos'
import Servicios        from '../pages/admin/Servicios'
import Prestaciones     from '../pages/admin/Prestaciones'
import Calificaciones   from '../pages/admin/Calificaciones'
import Notificaciones   from '../pages/admin/Notificaciones'
import Vehiculos        from '../pages/admin/Vehiculos'
import Roles            from '../pages/admin/Roles'
import TiposEstablecimiento from '../pages/admin/TiposEstablecimiento'
import TiposServicio from '../pages/admin/TiposServicio'
import Agenda from '../pages/admin/Agenda'
import Perfil from '../pages/admin/Perfil'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRol="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"        element={<Dashboard />} />
        <Route path="usuarios"         element={<Usuarios />} />
        <Route path="establecimientos" element={<Establecimientos />} />
        <Route path="servicios"        element={<Servicios />} />
        <Route path="prestaciones"     element={<Prestaciones />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="calificaciones"   element={<Calificaciones />} />
        <Route path="notificaciones"   element={<Notificaciones />} />
        <Route path="vehiculos"        element={<Vehiculos />} />
        <Route path="roles"            element={<Roles />} />
        <Route path="tipos-establecimiento" element={<TiposEstablecimiento />} />
        <Route path="tipos-servicio"        element={<TiposServicio />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  )
}