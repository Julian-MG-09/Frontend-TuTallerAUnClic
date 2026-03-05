import { useState } from 'react'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { adminService } from '../../services/adminService'
import { useAdminData } from '../../hooks/useAdminData'

const EMPTY_FORM = { nombre: '', establecimiento: '', tipo_servicio: '' }

export default function Servicios() {
  const { data: servicios, setData: setServicios, loading, error, reload } = useAdminData(adminService.getServicios)
  const { data: establecimientos } = useAdminData(adminService.getEstablecimientos)
  const { data: tipos }            = useAdminData(adminService.getTiposServicio)

  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [confirmId, setConfirmId]   = useState(null)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState('')

  const filtered = servicios.filter(s =>
    `${s.nombre} ${s.establecimiento_nombre ?? ''} ${s.tipo_servicio_nombre ?? ''}`
      .toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() { setEditTarget(null); setForm(EMPTY_FORM); setFormError(''); setShowModal(true) }
  function openEdit(s) {
    setEditTarget(s)
    setForm({ nombre: s.nombre, establecimiento: s.establecimiento, tipo_servicio: s.tipo_servicio })
    setFormError(''); setShowModal(true)
  }

  async function handleSave() {
    if (!form.nombre || !form.establecimiento) { setFormError('Nombre y establecimiento son obligatorios'); return }
    setSaving(true); setFormError('')
    try {
      if (editTarget) {
        await adminService.updateServicio(editTarget.id, form)
      } else {
        await adminService.createServicio(form)
      }
      await reload(); setShowModal(false)
    } catch { setFormError('Error al guardar. Verifica los datos.') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    try {
      await adminService.deleteServicio(confirmId)
      setServicios(prev => prev.filter(s => s.id !== confirmId))
    } catch { alert('Error al eliminar') }
    finally { setConfirmId(null) }
  }

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMsg msg={error} onRetry={reload} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Servicios</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gestion de servicios por establecimiento</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">Nuevo servicio</button>
      </div>

      <div className="mb-4">
        <input type="text" placeholder="Buscar por nombre, establecimiento o tipo..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Establecimiento</th>
              <th className="px-4 py-3 text-left">Tipo de servicio</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">No se encontraron servicios</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{s.nombre}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.establecimiento_nombre ?? s.establecimiento}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    {s.tipo_servicio_nombre ?? s.tipo_servicio ?? '-'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(s)} className="px-3 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">Editar</button>
                    <button onClick={() => setConfirmId(s.id)} className="px-3 py-1 text-xs rounded border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">{filtered.length} servicio{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>

      {showModal && (
        <Modal title={editTarget ? 'Editar servicio' : 'Nuevo servicio'} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Establecimiento</label>
              <select value={form.establecimiento} onChange={e => setForm(f => ({ ...f, establecimiento: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar establecimiento</option>
                {establecimientos.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tipo de servicio</label>
              <select value={form.tipo_servicio} onChange={e => setForm(f => ({ ...f, tipo_servicio: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar tipo</option>
                {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
            {formError && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950 px-3 py-2 rounded">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white transition-colors flex items-center gap-2">
                {saving && <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                {editTarget ? 'Guardar cambios' : 'Crear servicio'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message="Esta accion eliminara el servicio permanentemente. Deseas continuar?" onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />}
    </div>
  )
}

function LoadingSpinner() { return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /></div> }
function ErrorMsg({ msg, onRetry }) {
  return <div className="flex flex-col items-center justify-center py-20 gap-3"><p className="text-sm text-red-500">{msg}</p><button onClick={onRetry} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Reintentar</button></div>
}