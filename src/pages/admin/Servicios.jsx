import { useState } from 'react'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'

const MOCK_TIPOS_SERVICIO = [
  { id: 1, nombre: 'Cambio de aceite' },
  { id: 2, nombre: 'Alineacion y balanceo' },
  { id: 3, nombre: 'Diagnostico electrico' },
  { id: 4, nombre: 'Frenos' },
  { id: 5, nombre: 'Suspension' },
]

const MOCK_ESTABLECIMIENTOS = [
  { id: 1, nombre: 'Taller El Rapido' },
  { id: 2, nombre: 'AutoServicios Norte' },
]

const MOCK_SERVICIOS = [
  { id: 1, nombre: 'Cambio de aceite 4L',    establecimiento_id: 1, establecimiento: 'Taller El Rapido',    tipo_servicio_id: 1, tipo_servicio: 'Cambio de aceite' },
  { id: 2, nombre: 'Alineacion completa',     establecimiento_id: 1, establecimiento: 'Taller El Rapido',    tipo_servicio_id: 2, tipo_servicio: 'Alineacion y balanceo' },
  { id: 3, nombre: 'Diagnostico electrico',   establecimiento_id: 2, establecimiento: 'AutoServicios Norte', tipo_servicio_id: 3, tipo_servicio: 'Diagnostico electrico' },
]

const EMPTY_FORM = {
  nombre: '',
  establecimiento_id: 1,
  tipo_servicio_id: 1,
}

export default function Servicios() {
  const [servicios, setServicios]   = useState(MOCK_SERVICIOS)
  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [confirmId, setConfirmId]   = useState(null)

  const filtered = servicios.filter(s =>
    `${s.nombre} ${s.establecimiento} ${s.tipo_servicio}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(servicio) {
    setEditTarget(servicio)
    setForm({
      nombre: servicio.nombre,
      establecimiento_id: servicio.establecimiento_id,
      tipo_servicio_id: servicio.tipo_servicio_id,
    })
    setShowModal(true)
  }

  function handleSave() {
    if (!form.nombre) return

    const est  = MOCK_ESTABLECIMIENTOS.find(e => e.id === Number(form.establecimiento_id))
    const tipo = MOCK_TIPOS_SERVICIO.find(t => t.id === Number(form.tipo_servicio_id))

    if (editTarget) {
      setServicios(prev => prev.map(s =>
        s.id === editTarget.id
          ? { ...s, ...form, establecimiento: est.nombre, tipo_servicio: tipo.nombre }
          : s
      ))
    } else {
      setServicios(prev => [...prev, {
        ...form,
        id: Date.now(),
        establecimiento: est.nombre,
        tipo_servicio: tipo.nombre,
      }])
    }
    setShowModal(false)
  }

  function handleDelete() {
    setServicios(prev => prev.filter(s => s.id !== confirmId))
    setConfirmId(null)
  }

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Servicios
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Gestion de servicios ofrecidos por cada establecimiento
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Nuevo servicio
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, establecimiento o tipo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Nombre del servicio</th>
              <th className="px-4 py-3 text-left">Establecimiento</th>
              <th className="px-4 py-3 text-left">Tipo de servicio</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  No se encontraron servicios
                </td>
              </tr>
            ) : (
              filtered.map(s => (
                <tr
                  key={s.id}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                    {s.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {s.establecimiento}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {s.tipo_servicio}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="px-3 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmId(s.id)}
                        className="px-3 py-1 text-xs rounded border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        {filtered.length} servicio{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Modal */}
      {showModal && (
        <Modal
          title={editTarget ? 'Editar servicio' : 'Nuevo servicio'}
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Nombre del servicio
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Establecimiento */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Establecimiento
              </label>
              <select
                value={form.establecimiento_id}
                onChange={e => setForm(f => ({ ...f, establecimiento_id: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MOCK_ESTABLECIMIENTOS.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>

            {/* Tipo de servicio */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Tipo de servicio
              </label>
              <select
                value={form.tipo_servicio_id}
                onChange={e => setForm(f => ({ ...f, tipo_servicio_id: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MOCK_TIPOS_SERVICIO.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {editTarget ? 'Guardar cambios' : 'Crear servicio'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Esta accion eliminara el servicio permanentemente. Deseas continuar?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}