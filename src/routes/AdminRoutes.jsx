import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard       from '../pages/admin/Dashboard'
import Usuarios        from '../pages/admin/Usuarios'
import Establecimientos from '../pages/admin/Establecimientos'
import Servicios       from '../pages/admin/Servicios'
import Prestaciones    from '../pages/admin/Prestaciones'
import Calificaciones  from '../pages/admin/Calificaciones'
import Notificaciones  from '../pages/admin/Notificaciones'
import Vehiculos       from '../pages/admin/Vehiculos'
import Roles           from '../pages/admin/Roles'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"        element={<Dashboard />} />
        <Route path="usuarios"         element={<Usuarios />} />
        <Route path="establecimientos" element={<Establecimientos />} />
        <Route path="servicios"        element={<Servicios />} />
        <Route path="prestaciones"     element={<Prestaciones />} />
        <Route path="calificaciones"   element={<Calificaciones />} />
        <Route path="notificaciones"   element={<Notificaciones />} />
        <Route path="vehiculos"        element={<Vehiculos />} />
        <Route path="roles"            element={<Roles />} />
      </Route>
    </Routes>
  )
}