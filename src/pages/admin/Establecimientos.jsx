import { useState } from 'react'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'

const MOCK_ESTABLECIMIENTOS = [
  {
    id: 1,
    nombre: 'Taller El Rapido',
    direccion: 'Cra 15 #45-20, Bogota',
    telefono: '3001112233',
    hora_apertura: '08:00',
    hora_cierre: '18:00',
    descripcion: 'Taller especializado en mecanica general y cambio de aceite',
    latitud: '4.711000',
    longitud: '-74.072000',
    tipo: 'Mecanica',
    propietario: 'maria_e',
  },
  {
    id: 2,
    nombre: 'AutoServicios Norte',
    direccion: 'Av. 68 #100-15, Bogota',
    telefono: '3209988776',
    hora_apertura: '07:00',
    hora_cierre: '17:00',
    descripcion: 'Centro de diagnostico y electricidad automotriz',
    latitud: '4.732000',
    longitud: '-74.055000',
    tipo: 'Electricidad',
    propietario: 'carlos123',
  },
]

const TIPOS = ['Mecanica', 'Electricidad', 'Latoneria', 'Pintura', 'Llantas', 'Otro']

const EMPTY_FORM = {
  nombre: '', direccion: '', telefono: '',
  hora_apertura: '08:00', hora_cierre: '18:00',
  descripcion: '', latitud: '', longitud: '',
  tipo: 'Mecanica', propietario: '',
}

export default function Establecimientos() {
  const [establecimientos, setEstablecimientos] = useState(MOCK_ESTABLECIMIENTOS)
  const [search, setSearch]                     = useState('')
  const [showModal, setShowModal]               = useState(false)
  const [editTarget, setEditTarget]             = useState(null)
  const [form, setForm]                         = useState(EMPTY_FORM)
  const [confirmId, setConfirmId]               = useState(null)

  const filtered = establecimientos.filter(e =>
    `${e.nombre} ${e.direccion} ${e.tipo} ${e.propietario}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(est) {
    setEditTarget(est)
    setForm({ ...est })
    setShowModal(true)
  }

  function handleSave() {
    if (!form.nombre || !form.direccion) return
    if (editTarget) {
      setEstablecimientos(prev =>
        prev.map(e => e.id === editTarget.id ? { ...e, ...form } : e)
      )
    } else {
      setEstablecimientos(prev => [...prev, { ...form, id: Date.now() }])
    }
    setShowModal(false)
  }

  function handleDelete() {
    setEstablecimientos(prev => prev.filter(e => e.id !== confirmId))
    setConfirmId(null)
  }

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Establecimientos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Gestion de talleres y centros de servicio registrados
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Nuevo establecimiento
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, tipo o propietario..."
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
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Direccion</th>
              <th className="px-4 py-3 text-left">Telefono</th>
              <th className="px-4 py-3 text-left">Horario</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Propietario</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  No se encontraron establecimientos
                </td>
              </tr>
            ) : (
              filtered.map(e => (
                <tr
                  key={e.id}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                    {e.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                    {e.direccion}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{e.telefono}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {e.hora_apertura} - {e.hora_cierre}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {e.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{e.propietario}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(e)}
                        className="px-3 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmId(e.id)}
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
        {filtered.length} establecimiento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Modal */}
      {showModal && (
        <Modal
          title={editTarget ? 'Editar establecimiento' : 'Nuevo establecimiento'}
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
            <Field label="Nombre" value={form.nombre}
              onChange={v => setForm(f => ({ ...f, nombre: v }))} />
            <Field label="Direccion" value={form.direccion}
              onChange={v => setForm(f => ({ ...f, direccion: v }))} />
            <Field label="Telefono" value={form.telefono}
              onChange={v => setForm(f => ({ ...f, telefono: v }))} />
            <Field label="Descripcion" value={form.descripcion}
              onChange={v => setForm(f => ({ ...f, descripcion: v }))} />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Hora apertura" type="time" value={form.hora_apertura}
                onChange={v => setForm(f => ({ ...f, hora_apertura: v }))} />
              <Field label="Hora cierre" type="time" value={form.hora_cierre}
                onChange={v => setForm(f => ({ ...f, hora_cierre: v }))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Latitud" value={form.latitud}
                onChange={v => setForm(f => ({ ...f, latitud: v }))} />
              <Field label="Longitud" value={form.longitud}
                onChange={v => setForm(f => ({ ...f, longitud: v }))} />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Tipo de establecimiento
              </label>
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <Field label="Propietario (username)" value={form.propietario}
              onChange={v => setForm(f => ({ ...f, propietario: v }))} />

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
                {editTarget ? 'Guardar cambios' : 'Crear establecimiento'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Esta accion eliminara el establecimiento permanentemente. Deseas continuar?"
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
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}