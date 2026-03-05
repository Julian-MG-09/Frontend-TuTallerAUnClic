import { useState } from 'react'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'

const MOCK_PRESTACIONES = [
  {
    id: 1,
    fecha: '2025-03-10',
    estado: 'pendiente',
    usuario: 'carlos123',
    establecimiento: 'Taller El Rapido',
    servicio: 'Cambio de aceite 4L',
    vehiculo: 'ABC123',
    agenda_hora: '09:00',
    agenda_descripcion: 'Turno manana',
  },
  {
    id: 2,
    fecha: '2025-03-11',
    estado: 'confirmada',
    usuario: 'maria_e',
    establecimiento: 'AutoServicios Norte',
    servicio: 'Diagnostico electrico',
    vehiculo: 'XYZ789',
    agenda_hora: '14:00',
    agenda_descripcion: 'Turno tarde',
  },
  {
    id: 3,
    fecha: '2025-03-08',
    estado: 'completada',
    usuario: 'carlos123',
    establecimiento: 'Taller El Rapido',
    servicio: 'Alineacion completa',
    vehiculo: 'ABC123',
    agenda_hora: '11:00',
    agenda_descripcion: 'Turno medio dia',
  },
  {
    id: 4,
    fecha: '2025-03-12',
    estado: 'cancelada',
    usuario: 'admin01',
    establecimiento: 'AutoServicios Norte',
    servicio: 'Diagnostico electrico',
    vehiculo: 'DEF456',
    agenda_hora: '16:00',
    agenda_descripcion: 'Turno tarde',
  },
]

const MOCK_USUARIOS        = ['carlos123', 'maria_e', 'admin01']
const MOCK_ESTABLECIMIENTOS = ['Taller El Rapido', 'AutoServicios Norte']
const MOCK_SERVICIOS       = ['Cambio de aceite 4L', 'Alineacion completa', 'Diagnostico electrico']
const MOCK_VEHICULOS       = ['ABC123', 'XYZ789', 'DEF456']
const ESTADOS              = ['pendiente', 'confirmada', 'completada', 'cancelada']

const ESTADO_STYLES = {
  pendiente:  'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400',
  confirmada: 'bg-blue-50  dark:bg-blue-950  text-blue-600  dark:text-blue-400',
  completada: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
  cancelada:  'bg-gray-100 dark:bg-gray-800  text-gray-500  dark:text-gray-400',
}

const EMPTY_FORM = {
  fecha: '',
  estado: 'pendiente',
  usuario: 'carlos123',
  establecimiento: 'Taller El Rapido',
  servicio: 'Cambio de aceite 4L',
  vehiculo: 'ABC123',
  agenda_hora: '09:00',
  agenda_descripcion: '',
}

export default function Prestaciones() {
  const [prestaciones, setPrestaciones] = useState(MOCK_PRESTACIONES)
  const [search, setSearch]             = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [showModal, setShowModal]       = useState(false)
  const [editTarget, setEditTarget]     = useState(null)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [confirmId, setConfirmId]       = useState(null)

  const filtered = prestaciones.filter(p => {
    const matchSearch = `${p.usuario} ${p.establecimiento} ${p.servicio} ${p.vehiculo}`
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado
    return matchSearch && matchEstado
  })

  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(p) {
    setEditTarget(p)
    setForm({ ...p })
    setShowModal(true)
  }

  function handleSave() {
    if (!form.fecha || !form.usuario) return
    if (editTarget) {
      setPrestaciones(prev =>
        prev.map(p => p.id === editTarget.id ? { ...p, ...form } : p)
      )
    } else {
      setPrestaciones(prev => [...prev, { ...form, id: Date.now() }])
    }
    setShowModal(false)
  }

  function handleDelete() {
    setPrestaciones(prev => prev.filter(p => p.id !== confirmId))
    setConfirmId(null)
  }

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Prestaciones de servicio
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Gestion de citas y servicios realizados
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Nueva prestacion
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por usuario, establecimiento o vehiculo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos los estados</option>
          {ESTADOS.map(e => (
            <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Establecimiento</th>
              <th className="px-4 py-3 text-left">Servicio</th>
              <th className="px-4 py-3 text-left">Vehiculo</th>
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  No se encontraron prestaciones
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr
                  key={p.id}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">
                    {p.fecha}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.usuario}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.establecimiento}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.servicio}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {p.vehiculo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.agenda_hora}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_STYLES[p.estado]}`}>
                      {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="px-3 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmId(p.id)}
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
        {filtered.length} prestacion{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Modal */}
      {showModal && (
        <Modal
          title={editTarget ? 'Editar prestacion' : 'Nueva prestacion'}
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">

            <SelectField
              label="Usuario"
              value={form.usuario}
              options={MOCK_USUARIOS}
              onChange={v => setForm(f => ({ ...f, usuario: v }))}
            />
            <SelectField
              label="Establecimiento"
              value={form.establecimiento}
              options={MOCK_ESTABLECIMIENTOS}
              onChange={v => setForm(f => ({ ...f, establecimiento: v }))}
            />
            <SelectField
              label="Servicio"
              value={form.servicio}
              options={MOCK_SERVICIOS}
              onChange={v => setForm(f => ({ ...f, servicio: v }))}
            />
            <SelectField
              label="Vehiculo"
              value={form.vehiculo}
              options={MOCK_VEHICULOS}
              onChange={v => setForm(f => ({ ...f, vehiculo: v }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Fecha"
                type="date"
                value={form.fecha}
                onChange={v => setForm(f => ({ ...f, fecha: v }))}
              />
              <InputField
                label="Hora"
                type="time"
                value={form.agenda_hora}
                onChange={v => setForm(f => ({ ...f, agenda_hora: v }))}
              />
            </div>

            <InputField
              label="Descripcion de la agenda"
              value={form.agenda_descripcion}
              onChange={v => setForm(f => ({ ...f, agenda_descripcion: v }))}
            />

            <SelectField
              label="Estado"
              value={form.estado}
              options={ESTADOS}
              onChange={v => setForm(f => ({ ...f, estado: v }))}
            />

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
                {editTarget ? 'Guardar cambios' : 'Crear prestacion'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Esta accion eliminara la prestacion permanentemente. Deseas continuar?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text' }) {
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

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(o => (
          <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
        ))}
      </select>
    </div>
  )
}