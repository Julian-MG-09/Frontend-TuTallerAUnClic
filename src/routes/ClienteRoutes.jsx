import { Routes, Route, Navigate } from 'react-router-dom'
import ClienteLayout   from '../layouts/ClienteLayout'
import ProtectedRoute  from './ProtectedRoute'
import Home            from '../pages/cliente/Home'
import Buscar          from '../pages/cliente/Buscar'
import MisCitas        from '../pages/cliente/MisCitas'
import MiPerfil        from '../pages/cliente/MiPerfil'
import MisVehiculos    from '../pages/cliente/MisVehiculos'

export default function ClienteRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRol="cliente">
            <ClienteLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="inicio" replace />} />
        <Route path="inicio"         element={<Home />} />
        <Route path="buscar"         element={<Buscar />} />
        <Route path="mis-citas"      element={<MisCitas />} />
        <Route path="mi-perfil"      element={<MiPerfil />} />
        <Route path="mis-vehiculos"  element={<MisVehiculos />} />
      </Route>
    </Routes>
  )
}