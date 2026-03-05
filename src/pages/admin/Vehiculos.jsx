import { useState } from 'react'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'

const MOCK_VEHICULOS = [
  { placa: 'ABC123', usuario: 'carlos123' },
  { placa: 'XYZ789', usuario: 'maria_e' },
  { placa: 'DEF456', usuario: 'admin01' },
]

const MOCK_USUARIOS = ['carlos123', 'maria_e', 'admin01']
const EMPTY_FORM    = { placa: '', usuario: 'carlos123' }

export default function Vehiculos() {
  const [vehiculos, setVehiculos]   = useState(MOCK_VEHICULOS)
  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [confirmPlaca, setConfirmPlaca] = useState(null)

  const filtered = vehiculos.filter(v =>
    `${v.placa} ${v.usuario}`.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(v) {
    setEditTarget(v)
    setForm({ placa: v.placa, usuario: v.usuario })
    setShowModal(true)
  }

  function handleSave() {
    if (!form.placa) return
    if (editTarget) {
      setVehiculos(prev => prev.map(v => v.placa === editTarget.placa ? { ...form } : v))
    } else {
      setVehiculos(prev => [...prev, { ...form }])
    }
    setShowModal(false)
  }

  function handleDelete() {
    setVehiculos(prev => prev.filter(v => v.placa !== confirmPlaca))
    setConfirmPlaca(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Vehiculos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gestion de vehiculos registrados por los usuarios</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
          Nuevo vehiculo
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por placa o usuario..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Placa</th>
              <th className="px-4 py-3 text-left">Propietario</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  No se encontraron vehiculos
                </td>
              </tr>
            ) : (
              filtered.map(v => (
                <tr key={v.placa} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {v.placa}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{v.usuario}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(v)} className="px-3 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">Editar</button>
                      <button onClick={() => setConfirmPlaca(v.placa)} className="px-3 py-1 text-xs rounded border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        {filtered.length} vehiculo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {showModal && (
        <Modal title={editTarget ? 'Editar vehiculo' : 'Nuevo vehiculo'} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Placa</label>
              <input
                type="text"
                value={form.placa}
                onChange={e => setForm(f => ({ ...f, placa: e.target.value.toUpperCase() }))}
                maxLength={10}
                disabled={!!editTarget}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {editTarget && <p className="text-xs text-gray-400 mt-1">La placa no se puede modificar</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Propietario</label>
              <select
                value={form.usuario}
                onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MOCK_USUARIOS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors">{editTarget ? 'Guardar cambios' : 'Crear vehiculo'}</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmPlaca && (
        <ConfirmDialog
          message={`Esta accion eliminara el vehiculo con placa ${confirmPlaca} permanentemente. Deseas continuar?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmPlaca(null)}
        />
      )}
    </div>
  )
}