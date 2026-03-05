import { useState } from 'react'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { adminService } from '../../services/adminService'
import { useAdminData } from '../../hooks/useAdminData'

const ESTADOS = ['pendiente', 'confirmada', 'completada', 'cancelada']

const ESTADO_STYLES = {
  pendiente:  'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400',
  confirmada: 'bg-blue-50  dark:bg-blue-950  text-blue-600  dark:text-blue-400',
  completada: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
  cancelada:  'bg-gray-100 dark:bg-gray-800  text-gray-500  dark:text-gray-400',
}

const EMPTY_FORM = {
  fecha: '', estado: 'pendiente', usuario: '',
  establecimiento: '', servicio: '', vehiculo: '',
  agenda: '',
}

export default function Prestaciones() {
  const { data: prestaciones, setData: setPrestaciones, loading, error, reload } = useAdminData(adminService.getPrestaciones)
  const { data: usuarios }        = useAdminData(adminService.getUsuarios)
  const { data: establecimientos } = useAdminData(adminService.getEstablecimientos)
  const { data: servicios }       = useAdminData(adminService.getServicios)
  const { data: vehiculos }       = useAdminData(adminService.getVehiculos)
  const { data: agenda }          = useAdminData(adminService.getAgenda)

  const [search, setSearch]         = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [confirmId, setConfirmId]   = useState(null)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState('')

  const filtered = prestaciones.filter(p => {
    const matchSearch = `${p.usuario_username ?? ''} ${p.establecimiento_nombre ?? ''} ${p.servicio_nombre ?? ''} ${p.vehiculo ?? ''}`
      .toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado
    return matchSearch && matchEstado
  })

  function openCreate() { setEditTarget(null); setForm(EMPTY_FORM); setFormError(''); setShowModal(true) }
  function openEdit(p) {
    setEditTarget(p)
    setForm({ fecha: p.fecha, estado: p.estado, usuario: p.usuario, establecimiento: p.establecimiento, servicio: p.servicio, vehiculo: p.vehiculo, agenda: p.agenda })
    setFormError(''); setShowModal(true)
  }

  async function handleSave() {
    if (!form.fecha || !form.usuario) { setFormError('Fecha y usuario son obligatorios'); return }
    setSaving(true); setFormError('')
    try {
      if (editTarget) { await adminService.updatePrestacion(editTarget.id, form) }
      else { await adminService.createPrestacion(form) }
      await reload(); setShowModal(false)
    } catch { setFormError('Error al guardar. Verifica los datos.') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    try {
      await adminService.deletePrestacion(confirmId)
      setPrestaciones(prev => prev.filter(p => p.id !== confirmId))
    } catch { alert('Error al eliminar') }
    finally { setConfirmId(null) }
  }

  if (loading) return <LoadingSpinner />
  if (error)   return <ErrorMsg msg={error} onRetry={reload} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Prestaciones de servicio</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gestion de citas y servicios realizados</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">Nueva prestacion</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input type="text" placeholder="Buscar por usuario, establecimiento o vehiculo..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="todos">Todos los estados</option>
          {ESTADOS.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Establecimiento</th>
              <th className="px-4 py-3 text-left">Servicio</th>
              <th className="px-4 py-3 text-left">Vehiculo</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">No se encontraron prestaciones</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{p.fecha}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.usuario_username ?? p.usuario}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.establecimiento_nombre ?? p.establecimiento}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.servicio_nombre ?? p.servicio}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{p.vehiculo}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_STYLES[p.estado]}`}>
                    {p.estado?.charAt(0).toUpperCase() + p.estado?.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="px-3 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">Editar</button>
                    <button onClick={() => setConfirmId(p.id)} className="px-3 py-1 text-xs rounded border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">{filtered.length} prestacion{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}</p>

      {showModal && (
        <Modal title={editTarget ? 'Editar prestacion' : 'Nueva prestacion'} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
            <SelectField label="Usuario" value={form.usuario} onChange={v => setForm(f => ({ ...f, usuario: v }))} options={usuarios.map(u => ({ value: u.id, label: u.username }))} />
            <SelectField label="Establecimiento" value={form.establecimiento} onChange={v => setForm(f => ({ ...f, establecimiento: v }))} options={establecimientos.map(e => ({ value: e.id, label: e.nombre }))} />
            <SelectField label="Servicio" value={form.servicio} onChange={v => setForm(f => ({ ...f, servicio: v }))} options={servicios.map(s => ({ value: s.id, label: s.nombre }))} />
            <SelectField label="Vehiculo" value={form.vehiculo} onChange={v => setForm(f => ({ ...f, vehiculo: v }))} options={vehiculos.map(v => ({ value: v.placa, label: v.placa }))} />
            <SelectField label="Agenda" value={form.agenda} onChange={v => setForm(f => ({ ...f, agenda: v }))} options={agenda.map(a => ({ value: a.id, label: `${a.fecha} ${a.hora}` }))} />
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha</label>
              <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <SelectField label="Estado" value={form.estado} onChange={v => setForm(f => ({ ...f, estado: v }))} options={ESTADOS.map(e => ({ value: e, label: e.charAt(0).toUpperCase() + e.slice(1) }))} />
            {formError && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950 px-3 py-2 rounded">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white transition-colors flex items-center gap-2">
                {saving && <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                {editTarget ? 'Guardar cambios' : 'Crear prestacion'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {confirmId && <ConfirmDialog message="Esta accion eliminara la prestacion permanentemente. Deseas continuar?" onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />}
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Seleccionar {label.toLowerCase()}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function LoadingSpinner() { return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /></div> }
function ErrorMsg({ msg, onRetry }) {
  return <div className="flex flex-col items-center justify-center py-20 gap-3"><p className="text-sm text-red-500">{msg}</p><button onClick={onRetry} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Reintentar</button></div>
}