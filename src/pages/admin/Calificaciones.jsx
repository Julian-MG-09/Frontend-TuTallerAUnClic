import { useState } from 'react'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'

const MOCK_CALIFICACIONES = [
  { id: 1, puntuacion: 5, comentario: 'Excelente servicio, muy rapido y profesional', fecha: '2025-03-08', prestacion_id: 3, usuario: 'carlos123', establecimiento: 'Taller El Rapido' },
  { id: 2, puntuacion: 4, comentario: 'Buen trabajo aunque demoraron un poco mas de lo esperado', fecha: '2025-03-09', prestacion_id: 2, usuario: 'maria_e', establecimiento: 'AutoServicios Norte' },
  { id: 3, puntuacion: 2, comentario: 'El servicio fue regular, esperaba mas calidad', fecha: '2025-03-10', prestacion_id: 1, usuario: 'carlos123', establecimiento: 'Taller El Rapido' },
]

const MOCK_PRESTACIONES = [
  { id: 1, label: 'Prestacion #1 - carlos123' },
  { id: 2, label: 'Prestacion #2 - maria_e' },
  { id: 3, label: 'Prestacion #3 - carlos123' },
]

const EMPTY_FORM = {
  puntuacion: 5,
  comentario: '',
  fecha: '',
  prestacion_id: 1,
}

function Estrellas({ puntuacion }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`text-sm ${i <= puntuacion ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function Calificaciones() {
  const [calificaciones, setCalificaciones] = useState(MOCK_CALIFICACIONES)
  const [search, setSearch]                 = useState('')
  const [showModal, setShowModal]           = useState(false)
  const [editTarget, setEditTarget]         = useState(null)
  const [form, setForm]                     = useState(EMPTY_FORM)
  const [confirmId, setConfirmId]           = useState(null)

  const filtered = calificaciones.filter(c =>
    `${c.usuario} ${c.establecimiento} ${c.comentario}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(c) {
    setEditTarget(c)
    setForm({ puntuacion: c.puntuacion, comentario: c.comentario, fecha: c.fecha, prestacion_id: c.prestacion_id })
    setShowModal(true)
  }

  function handleSave() {
    if (!form.fecha) return
    const prestacion = MOCK_PRESTACIONES.find(p => p.id === Number(form.prestacion_id))
    if (editTarget) {
      setCalificaciones(prev => prev.map(c =>
        c.id === editTarget.id ? { ...c, ...form } : c
      ))
    } else {
      setCalificaciones(prev => [...prev, {
        ...form,
        id: Date.now(),
        usuario: prestacion.label.split(' - ')[1],
        establecimiento: 'Sin asignar',
      }])
    }
    setShowModal(false)
  }

  function handleDelete() {
    setCalificaciones(prev => prev.filter(c => c.id !== confirmId))
    setConfirmId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Calificaciones</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Resenas y puntuaciones de los servicios prestados</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
          Nueva calificacion
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por usuario, establecimiento o comentario..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Puntuacion</th>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Establecimiento</th>
              <th className="px-4 py-3 text-left">Comentario</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  No se encontraron calificaciones
                </td>
              </tr>
            ) : (
              filtered.map(c => (
                <tr key={c.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3"><Estrellas puntuacion={c.puntuacion} /></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.usuario}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.establecimiento}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-xs truncate">{c.comentario}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.fecha}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="px-3 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">Editar</button>
                      <button onClick={() => setConfirmId(c.id)} className="px-3 py-1 text-xs rounded border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        {filtered.length} calificacion{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
      </p>

      {showModal && (
        <Modal title={editTarget ? 'Editar calificacion' : 'Nueva calificacion'} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Prestacion</label>
              <select
                value={form.prestacion_id}
                onChange={e => setForm(f => ({ ...f, prestacion_id: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MOCK_PRESTACIONES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Puntuacion</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setForm(f => ({ ...f, puntuacion: n }))}
                    className={`text-2xl transition-colors ${n <= form.puntuacion ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Comentario</label>
              <textarea
                value={form.comentario}
                onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha</label>
              <input
                type="date"
                value={form.fecha}
                onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors">{editTarget ? 'Guardar cambios' : 'Crear calificacion'}</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Esta accion eliminara la calificacion permanentemente. Deseas continuar?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}