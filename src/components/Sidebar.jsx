import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin/dashboard',       label: 'Dashboard' },
  { to: '/admin/anuncios', label: 'Anuncios'},
  { to: '/admin/usuarios',        label: 'Usuarios' },
  { to: '/admin/establecimientos',label: 'Establecimientos' },
  { to: '/admin/tipos-establecimiento',label: 'Tipos Establecimiento' },
  { to: '/admin/tipos-servicio',label: 'Tipos Servicio' },
  { to: '/admin/servicios',       label: 'Servicios' },
  { to: '/admin/prestaciones',    label: 'Prestaciones' },
  { to: '/admin/agenda',          label: 'Agenda' },
  { to: '/admin/calificaciones',  label: 'Calificaciones' },
  { to: '/admin/notificaciones',  label: 'Notificaciones' },
  { to: '/admin/vehiculos',       label: 'Vehiculos' },
  { to: '/admin/roles',           label: 'Roles' },
]

export default function Sidebar({ open }) {
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-20 flex flex-col
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${open ? 'w-56' : 'w-16'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-wide">
          {open ? 'Tu Taller A Un Clic - Admin' : 'TA'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 text-sm
              transition-colors duration-150
              ${isActive
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium border-r-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <span className="w-2 h-2 rounded-full bg-current shrink-0" />
            {open && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}