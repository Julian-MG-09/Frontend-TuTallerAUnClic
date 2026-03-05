import { useState } from 'react'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'

const MOCK_ROLES = [
  { id: 1, nombre: 'Admin',    descripcion: 'Acceso total al sistema',                    activo: true,  fecha_creacion: '2024-01-01' },
  { id: 2, nombre: 'Empresa',  descripcion: 'Propietario de establecimiento',              activo: true,  fecha_creacion: '2024-01-01' },
  { id: 3, nombre: 'Cliente',  descripcion: 'Usuario que solicita servicios',              activo: true,  fecha_creacion: '2024-01-01' },
  { id: 4, nombre: 'Soporte',  descripcion: 'Acceso limitado para atencion al cliente',   activo: false, fecha_creacion: '2024-02-15' },
]

const EMPTY_FORM = { nombre: '', descripcion: '', activo: true }

export default function Roles() {
  const [roles, setRoles]           = useState(MOCK_ROLES)
  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [confirmId, setConfirmId]   = useState(null)

  const filtered = roles.filter(r =>
    `${r.nombre} ${r.descripcion}`.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(r) {
    setEditTarget(r)
    setForm({ nombre: r.nombre, descripcion: r.descripcion, activo: r.activo })
    setShowModal(true)
  }

  function handleSave() {
    if (!form.nombre) return
    if (editTarget) {
      setRoles(prev => prev.map(r => r.id === editTarget.id ? { ...r, ...form } : r))
    } else {
      setRoles(prev => [...prev, { ...form, id: Date.now(), fecha_creacion: new Date().toISOString().split('T')[0] }])
    }
    setShowModal(false)
  }

  function handleDelete() {
    setRoles(prev => prev.filter(r => r.id !== confirmId))
    setConfirmId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Roles</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gestion de roles y permisos del sistema</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
          Nuevo rol
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o descripcion..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Descripcion</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Fecha de creacion</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  No se encontraron roles
                </td>
              </tr>
            ) : (
              filtered.map(r => (
                <tr key={r.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{r.nombre}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-xs truncate">{r.descripcion}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      r.activo
                        ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}>
                      {r.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.fecha_creacion}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(r)} className="px-3 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">Editar</button>
                      <button onClick={() => setConfirmId(r.id)} className="px-3 py-1 text-xs rounded border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        {filtered.length} rol{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {showModal && (
        <Modal title={editTarget ? 'Editar rol' : 'Nuevo rol'} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Descripcion</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Rol activo</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors">{editTarget ? 'Guardar cambios' : 'Crear rol'}</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Esta accion eliminara el rol permanentemente. Deseas continuar?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}