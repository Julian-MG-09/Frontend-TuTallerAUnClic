import { useState } from 'react'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { adminService } from '../../services/adminService'
import { useAdminData } from '../../hooks/useAdminData'

const EMPTY_FORM = { titulo: '', mensaje: '', leida: false, fecha: '', usuario: '' }

export default function Notificaciones() {
  const { data: notificaciones, setData: setNotificaciones, loading, error, reload } = useAdminData(adminService.getNotificaciones)
  const { data: usuarios } = useAdminData(adminService.getUsuarios)

  const [search, setSearch]         = useState('')
  const [filtroLeida, setFiltroLeida] = useState('todas')
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [confirmId, setConfirmId]   = useState(null)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState('')

  const filtered = notificaciones.filter(n => {
    const matchSearch = `${n.titulo} ${n.mensaje} ${n.usuario_username ?? ''}`.toLowerCase().includes(search.toLowerCase())
    const matchLeida = filtroLeida === 'todas' || (filtroLeida === 'leidas' && n.leida) || (filtroLeida === 'no_leidas' && !n.leida)
    return matchSearch && matchLeida
  })

  function openCreate() { setEditTarget(null); setForm(EMPTY_FORM); setFormError(''); setShowModal(true) }
  function openEdit(n) { setEditTarget(n); setForm({ titulo: n.titulo, mensaje: n.mensaje, leida: n.leida, fecha: n.fecha, usuario: n.usuario }); setFormError(''); setShowModal(true) }

  async function handleSave() {
    if (!form.titulo || !form.mensaje || !form.usuario) { setFormError('Titulo, mensaje y usuario son obligatorios'); return }
    setSaving(true); setFormError('')
    try {
      if (editTarget) { await adminService.updateNotificacion(editTarget.id, form) }
      else { await adminService.createNotificacion(form) }
      await reload(); setShowModal(false)
    } catch { setFormError('Error al guardar.') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    try {
      await adminService.deleteNotificacion(confirmId)
      setNotificaciones(prev => prev.filter(n => n.id !== confirmId))
    } catch { alert('Error al eliminar') }
    finally { setConfirmId(null) }
  }

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMsg msg={error} onRetry={reload} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Notificaciones</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gestion de notificaciones enviadas a usuarios</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">Nueva notificacion</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input type="text" placeholder="Buscar por titulo, mensaje o usuario..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={filtroLeida} onChange={e => setFiltroLeida(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="todas">Todas</option>
          <option value="leidas">Leidas</option>
          <option value="no_leidas">No leidas</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Titulo</th>
              <th className="px-4 py-3 text-left">Mensaje</th>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">No se encontraron notificaciones</td></tr>
            ) : filtered.map(n => (
              <tr key={n.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{n.titulo}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-xs truncate">{n.mensaje}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{n.usuario_username ?? n.usuario}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{n.fecha}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${n.leida ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'}`}>
                    {n.leida ? 'Leida' : 'No leida'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(n)} className="px-3 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">Editar</button>
                    <button onClick={() => setConfirmId(n.id)} className="px-3 py-1 text-xs rounded border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">{filtered.length} notificacion{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}</p>

      {showModal && (
        <Modal title={editTarget ? 'Editar notificacion' : 'Nueva notificacion'} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Usuario</label>
              <select value={form.usuario} onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar usuario</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Titulo</label>
              <input type="text" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mensaje</label>
              <textarea value={form.mensaje} onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))} rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha</label>
              <input type="datetime-local" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.leida} onChange={e => setForm(f => ({ ...f, leida: e.target.checked }))} className="accent-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Marcar como leida</span>
            </label>
            {formError && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950 px-3 py-2 rounded">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white transition-colors flex items-center gap-2">
                {saving && <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                {editTarget ? 'Guardar cambios' : 'Crear notificacion'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message="Esta accion eliminara la notificacion permanentemente. Deseas continuar?" onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />}
    </div>
  )
}

function LoadingSpinner() { return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /></div> }
function ErrorMsg({ msg, onRetry }) {
  return <div className="flex flex-col items-center justify-center py-20 gap-3"><p className="text-sm text-red-500">{msg}</p><button onClick={onRetry} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Reintentar</button></div>
}