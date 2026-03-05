import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom'
import logo from '../assets/logo_solo.png'

export default function Login() {
  const { login }    = useAuth()
  const { dark, setDark } = useTheme()
  const navigate     = useNavigate()

  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!form.username || !form.password) {
      setError('Completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await login(form.username, form.password)

      const rolNombre = user.rol_nombre?.toLowerCase()

      if (rolNombre === 'admin') {
        navigate('/admin/dashboard')
      } else if (rolNombre === 'empresa') {
        navigate('/empresa/dashboard')
      } else {
        navigate('/cliente/dashboard')
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">

      {/* Toggle tema */}
      <button
        onClick={() => setDark(!dark)}
        className="fixed top-4 right-4 p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
      >
        {dark ? 'Modo claro' : 'Modo oscuro'}
      </button>

      <div className="w-full max-w-sm">

        {/* Logo / Titulo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Tu Taller a un Clic"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tu Taller a un Clic</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ingresa a tu cuenta</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-6">

          <div className="flex flex-col gap-4">
            {/* Usuario */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Usuario
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                onKeyDown={handleKey}
                placeholder="Tu nombre de usuario"
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Contrasena
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={handleKey}
                placeholder="Tu contraseña"
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Boton */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              )}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Registrate
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Tu Taller a un Clic &copy; 2025
        </p>
      </div>
    </div>
  )
}