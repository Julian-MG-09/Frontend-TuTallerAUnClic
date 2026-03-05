import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const ROLES_PUBLICOS = [
  { label: 'Cliente',  descripcion: 'Busco talleres y agendo citas' },
  { label: 'Empresa',  descripcion: 'Tengo un taller y ofrezco servicios' },
]

const EMPTY_FORM = {
  username:   '',
  first_name: '',
  last_name:  '',
  email:      '',
  telefono:   '',
  password:   '',
  password2:  '',
  rol_label:  'Cliente',
}

export default function Register() {
  const { dark, setDark } = useTheme()
  const navigate          = useNavigate()
  const { login }         = useAuth()

  const [form, setForm]     = useState(EMPTY_FORM)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit() {
    setError('')

    if (!form.username || !form.email || !form.password || !form.password2) {
      setError('Completa todos los campos obligatorios')
      return
    }
    if (form.password !== form.password2) {
      setError('Las contrasenas no coinciden')
      return
    }
    if (form.password.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
  const rolesRes = await api.get('/roles/')
  const rol = rolesRes.data.find(
    r => r.nombre.toLowerCase() === form.rol_label.toLowerCase()
  )

  if (!rol) {
    setError('No se pudo obtener el rol. Contacta al administrador.')
    setLoading(false)
    return
  }

  const res = await api.post('/usuarios/register/', {
    username:   form.username,
    first_name: form.first_name,
    last_name:  form.last_name,
    email:      form.email,
    telefono:   form.telefono,
    password:   form.password,
    rol:        rol.id,
  })

  localStorage.setItem('access_token', res.data.access)
  localStorage.setItem('refresh_token', res.data.refresh)

  const rolNombre = res.data.user.rol_nombre?.toLowerCase()

  if (rolNombre === 'empresa') {
    navigate('/empresa/dashboard')
  } else if (rolNombre === 'admin') {
    navigate('/admin/dashboard')
  } else {
    navigate('/cliente/dashboard')
  }

} catch (err) {
  const data = err.response?.data
  if (data?.username) {
    setError('Ese nombre de usuario ya existe')
  } else if (data?.email) {
    setError('Ese correo ya esta registrado')
  } else {
    setError('Ocurrio un error al registrarse. Intenta de nuevo.')
  }

    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-10">

      {/* Toggle tema */}
      <button
        onClick={() => setDark(!dark)}
        className="fixed top-4 right-4 p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
      >
        {dark ? 'Modo claro' : 'Modo oscuro'}
      </button>

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Crear cuenta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Registrate en Tu Taller a un Clic</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-6">

          {/* Selector de rol */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {ROLES_PUBLICOS.map(r => (
              <button
                key={r.label}
                onClick={() => setForm(f => ({ ...f, rol_label: r.label }))}
                className={`flex flex-col items-start px-4 py-3 rounded-lg border text-left transition-colors ${
                  form.rol_label === r.label
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className={`text-sm font-semibold mb-0.5 ${
                  form.rol_label === r.label
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-800 dark:text-gray-100'
                }`}>
                  {r.label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  {r.descripcion}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">

            {/* Nombre y apellido */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" value={form.first_name} onChange={set('first_name')} onKeyDown={handleKey} />
              <Field label="Apellido" value={form.last_name} onChange={set('last_name')} onKeyDown={handleKey} />
            </div>

            <Field label="Usuario *" value={form.username} onChange={set('username')} onKeyDown={handleKey} />
            <Field label="Correo electronico *" type="email" value={form.email} onChange={set('email')} onKeyDown={handleKey} />
            <Field label="Telefono" value={form.telefono} onChange={set('telefono')} onKeyDown={handleKey} />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Contrasena *" type="password" value={form.password} onChange={set('password')} onKeyDown={handleKey} />
              <Field label="Confirmar *" type="password" value={form.password2} onChange={set('password2')} onKeyDown={handleKey} />
            </div>

            {error && (
              <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center gap-2 mt-1"
            >
              {loading && (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              )}
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Inicia sesion
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-3">
          Tu Taller a un Clic &copy; 2025
        </p>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, onKeyDown, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
    </div>
  )
}