import { useState } from 'react'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { adminService } from '../../services/adminService'
import { useAdminData } from '../../hooks/useAdminData'

const EMPTY_FORM = {
  username: '', first_name: '', last_name: '',
  email: '', telefono: '', rol: '', password: '', is_active: true,
}

export default function Usuarios() {
  const { data: usuarios, setData: setUsuarios, loading, error, reload, count } = useAdminData(adminService.getUsuarios)
  const { data: roles } = useAdminData(adminService.getRolesPublicos)

  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [confirmId, setConfirmId]   = useState(null)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState('')
  const [page, setPage]             = useState(1)
  const PAGE_SIZE                   = 10

  const filtered = usuarios.filter(u =>
    `${u.username} ${u.email} ${u.first_name} ${u.last_name}`
      .toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(count / PAGE_SIZE)

  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setShowModal(true)
  }

  function openEdit(u) {
    setEditTarget(u)
    setForm({
      username: u.username, first_name: u.first_name,
      last_name: u.last_name, email: u.email,
      telefono: u.telefono, rol: u.rol,
      password: '', is_active: u.is_active,
    })
    setFormError('')
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.username || !form.email) {
      setFormError('Usuario y correo son obligatorios')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const payload = { ...form }
      if (!payload.password) delete payload.password
      if (editTarget) {
        await adminService.updateUsuario(editTarget.id, payload)
      } else {
        if (!form.password) {
          setFormError('La contrasena es obligatoria')
          setSaving(false)
          return
        }
        await adminService.createUsuario(payload)
      }
      await reload()
      setShowModal(false)
    } catch (e) {
      const data = e.response?.data
      if (data?.username)   setFormError('Ese nombre de usuario ya existe')
      else if (data?.email) setFormError('Ese correo ya esta registrado')
      else setFormError('Error al guardar. Verifica los datos.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await adminService.deleteUsuario(confirmId)
      setUsuarios(prev => prev.filter(u => u.id !== confirmId))
    } catch {
      alert('Error al eliminar el usuario')
    } finally {
      setConfirmId(null)
    }
  }

  async function changePage(p) {
    setPage(p)
    const res = await adminService.getUsuarios(p)
    const newData = res.data?.results ?? res.data
    setUsuarios(newData)
  }

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMsg msg={error} onRetry={reload} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Usuarios</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Gestion de usuarios registrados en la plataforma
          </p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
          Nuevo usuario
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, usuario o correo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Correo</th>
              <th className="px-4 py-3 text-left">Telefono</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{u.username}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{u.first_name} {u.last_name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{u.telefono}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {u.rol_nombre ?? '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      u.is_active
                        ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}>
                      {u.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u)} className="px-3 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">Editar</button>
                      <button onClick={() => setConfirmId(u.id)} className="px-3 py-1 text-xs rounded border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginacion */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {count} usuario{count !== 1 ? 's' : ''} en total
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => changePage(p)}
                className={`px-3 py-1 text-xs rounded border transition-colors ${
                  p === page
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editTarget ? 'Editar usuario' : 'Nuevo usuario'} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" value={form.first_name} onChange={v => setForm(f => ({ ...f, first_name: v }))} />
              <Field label="Apellido" value={form.last_name} onChange={v => setForm(f => ({ ...f, last_name: v }))} />
            </div>
            <Field label="Usuario" value={form.username} onChange={v => setForm(f => ({ ...f, username: v }))} />
            <Field label="Correo" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
            <Field label="Telefono" value={form.telefono} onChange={v => setForm(f => ({ ...f, telefono: v }))} />
            <Field
              label={editTarget ? 'Nueva contrasena (dejar vacio para no cambiar)' : 'Contrasena'}
              type="password" value={form.password}
              onChange={v => setForm(f => ({ ...f, password: v }))}
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Rol</label>
              <select
                value={form.rol}
                onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar rol</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={form.is_active}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Usuario activo</span>
            </label>
            {formError && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950 px-3 py-2 rounded">{formError}</p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white transition-colors flex items-center gap-2">
                {saving && <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                {editTarget ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Esta accion eliminara el usuario permanentemente. Deseas continuar?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  )
}

function ErrorMsg({ msg, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <p className="text-sm text-red-500">{msg}</p>
      <button onClick={onRetry} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Reintentar
      </button>
    </div>
  )
}