import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/entretenimiento', label: 'Entretenimiento' },
]

export default function TopBar({ open, setOpen }) {
  const { dark, setDark }             = useTheme()
  const { user, logout }              = useAuth()
  const navigate                      = useNavigate()
  const [userMenu, setUserMenu]       = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const menuRef                       = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header
        className="fixed top-0 right-0 z-10 h-16 flex items-center justify-between px-5
          bg-white dark:bg-gray-900
          border-b border-gray-200 dark:border-gray-700
          transition-all duration-300"
        style={{ left: open ? '14rem' : '4rem' }}
      >
        <div className="flex items-center gap-6">
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-1.5 p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <span className="block h-0.5 w-5 bg-current rounded" />
            <span className={`block h-0.5 bg-current rounded transition-all duration-300 ${open ? 'w-3' : 'w-5'}`} />
            <span className="block h-0.5 w-5 bg-current rounded" />
          </button>

          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => setDark(!dark)}
            className="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none bg-gray-200 dark:bg-blue-600"
            aria-label="Toggle dark mode"
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 flex items-center justify-center text-xs
              ${dark ? 'translate-x-5' : 'translate-x-0'}`}
            >
              {dark ? '🌙' : '☀️'}
            </span>
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenu(v => !v)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">
                  {user?.username?.[0]?.toUpperCase() ?? 'A'}
                </span>
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {user?.username ?? 'Admin'}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {user?.rol_nombre ?? 'Administrador'}
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenu ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {userMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                    {user?.username ?? 'Admin'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {user?.email ?? ''}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/admin/perfil"
                    onClick={() => setUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Editar perfil
                  </Link>

                  <button
                    onClick={() => { setUserMenu(false); handleLogout() }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Cerrar sesion
                  </button>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 py-1">
                  <button
                    onClick={() => { setUserMenu(false); setDeleteModal(true) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Eliminar cuenta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={() => setDeleteModal(false)} />
          <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Eliminar cuenta</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Esta accion no se puede deshacer</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Se eliminaran permanentemente todos tus datos, historial de citas, establecimientos y configuraciones asociadas a esta cuenta.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { setDeleteModal(false); alert('Cuenta eliminada') }}
                  className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                  Si, eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}